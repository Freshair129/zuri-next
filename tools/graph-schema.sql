-- Engineering graph schema (STD-004). Portable SQL: runs on SQLite 3.38+ and PostgreSQL 14+
-- (on PostgreSQL write `INTEGER GENERATED ALWAYS AS IDENTITY` for the surrogate keys).
-- The graph is an INDEX rebuilt from a git revision (STD-002 R7); nothing but the indexer writes it.
--
-- Keys: every table joins on INTEGER surrogate keys. The document ID ('FR-042-003') is stored
-- once, in node.id, as a unique lookup column — it is what people and agents search by.

-- 1. Vocabulary ---------------------------------------------------------------------------

-- family = a group of types that answer the same kind of question
CREATE TABLE family (
  family      TEXT PRIMARY KEY,            -- product | structure | requirement | design | decision | contract | runtime | verification | operation | governance | code
  description TEXT NOT NULL
);

-- type = the ID prefix (STD-002 R1); the unit a node is typed by
CREATE TABLE node_type (
  type          TEXT PRIMARY KEY,          -- FEAT, FR, NFR, AC, …, FILE, SYMBOL
  family        TEXT NOT NULL REFERENCES family(family),
  parent_type   TEXT REFERENCES node_type(type),   -- FR → FEAT, AC → FR; NULL = standalone
  id_pattern    TEXT NOT NULL,             -- regex the validator uses
  description   TEXT NOT NULL
);

CREATE TABLE relation_type (
  relation      TEXT PRIMARY KEY,          -- owned_by, implements, verifies, … (STD-002 R4)
  inverse       TEXT NOT NULL,             -- name shown when walking the edge backwards
  inferred      INTEGER NOT NULL DEFAULT 0,-- 1 = derived by the indexer (part_of), never written by hand
  description   TEXT NOT NULL
);

-- which (source type, relation, target type) triples are legal
CREATE TABLE relation_rule (
  source_type    TEXT NOT NULL REFERENCES node_type(type),
  relation       TEXT NOT NULL REFERENCES relation_type(relation),
  target_type    TEXT NOT NULL REFERENCES node_type(type),
  max_per_source INTEGER,                  -- 1 = at most one (owned_by on FEAT); NULL = unbounded
  PRIMARY KEY (source_type, relation, target_type)
);

-- 2. Snapshot -------------------------------------------------------------------------------

CREATE TABLE revision (
  revision_id INTEGER PRIMARY KEY,
  git_sha     TEXT NOT NULL UNIQUE,        -- commit the index was built from
  indexed_at  TEXT NOT NULL,
  is_current  INTEGER NOT NULL DEFAULT 0
);

-- 3. Nodes ----------------------------------------------------------------------------------

-- One row per artifact (FEAT-042, FR-042-003, DOM-CRM, ADR-017 …) and per code entity
-- (FILE:apps/server/src/x.js, SYMBOL:apps/server/src/x.js#resolveTenant).
CREATE TABLE node (
  node_id     INTEGER PRIMARY KEY,         -- surrogate key: every join uses it
  id          TEXT NOT NULL UNIQUE,        -- the document ID — what humans, grep and agents look up
  type        TEXT NOT NULL REFERENCES node_type(type),
  num         INTEGER,                     -- the number inside the ID (3 for FR-042-003); NULL for DOM/FILE/SYMBOL
  parent_node_id INTEGER REFERENCES node(node_id),  -- containment parsed from the ID (FR-042-003 → FEAT-042)
  title       TEXT NOT NULL,               -- a NAME: may change every revision, the id does not
  status      TEXT,                        -- draft | proposed | approved | superseded | retired
  delivery    TEXT,                        -- declared | building | implemented | live | retired
  attrs       TEXT,                        -- JSON: anything type-specific (e.g. {"feature_type":"cross-domain-feature"})
  revision_id INTEGER NOT NULL REFERENCES revision(revision_id),
  UNIQUE (type, parent_node_id, num)
);
CREATE INDEX node_type_idx   ON node(type, num);
CREATE INDEX node_parent_idx ON node(parent_node_id);

-- Where a node is declared (STD-002 R2). Path/anchor are locators: they move, the id does not.
CREATE TABLE locator (
  node_id      INTEGER NOT NULL REFERENCES node(node_id),
  revision_id  INTEGER NOT NULL REFERENCES revision(revision_id),
  path         TEXT NOT NULL,
  anchor       TEXT,                       -- heading anchor or symbol name
  line_start   INTEGER,
  line_end     INTEGER,
  content_hash TEXT NOT NULL,
  PRIMARY KEY (node_id, revision_id)
);
CREATE INDEX locator_path_idx ON locator(path);

-- 4. Edges ----------------------------------------------------------------------------------

CREATE TABLE edge (
  edge_id     INTEGER PRIMARY KEY,
  source_id   INTEGER NOT NULL REFERENCES node(node_id),
  relation    TEXT    NOT NULL REFERENCES relation_type(relation),
  target_id   INTEGER NOT NULL REFERENCES node(node_id),
  attrs       TEXT,                        -- JSON: e.g. {"role":"Delivery receipts"} on a part's owned_by
  provenance  TEXT NOT NULL,               -- id-inferred | frontmatter | heading | code-annotation | registry
  declared_in TEXT,                        -- path:line of the declaration
  revision_id INTEGER NOT NULL REFERENCES revision(revision_id),
  UNIQUE (source_id, relation, target_id, revision_id)
);
CREATE INDEX edge_source_idx ON edge(source_id, relation);
CREATE INDEX edge_target_idx ON edge(target_id, relation);

-- 5. Registries -----------------------------------------------------------------------------

CREATE TABLE domain (
  node_id INTEGER PRIMARY KEY REFERENCES node(node_id),   -- the DOM-CRM node
  code    TEXT NOT NULL UNIQUE,                            -- CRM (the code IS the domain's identity)
  slug    TEXT NOT NULL UNIQUE,                            -- crm (folder name; may change)
  name    TEXT NOT NULL                                    -- Customer & Conversation (may change)
);

CREATE TABLE legacy_id (
  legacy_id   TEXT NOT NULL,               -- FR-252 (previous repository)
  node_id     INTEGER REFERENCES node(node_id),  -- NULL when retired/dropped
  disposition TEXT NOT NULL,               -- migrated | split | merged | retired | dropped
  note        TEXT
);
CREATE INDEX legacy_id_idx ON legacy_id(legacy_id);

-- 6. Optional retrieval layer (STD-002 R9 step 5) --------------------------------------------
CREATE TABLE chunk (
  node_id   INTEGER NOT NULL REFERENCES node(node_id),
  chunk_no  INTEGER NOT NULL,
  text      TEXT NOT NULL,
  embedding BLOB,                          -- vector(n) on PostgreSQL + pgvector
  PRIMARY KEY (node_id, chunk_no)
);

-- 7. Views (expose document IDs, join on integers) -------------------------------------------

-- Edges with document IDs on both ends, current revision only
CREATE VIEW v_edge AS
  SELECT s.id AS source, s.type AS source_type, e.relation, t.id AS target, t.type AS target_type,
         e.attrs, e.provenance, e.declared_in
  FROM edge e
  JOIN revision r ON r.revision_id = e.revision_id AND r.is_current = 1
  JOIN node s ON s.node_id = e.source_id
  JOIN node t ON t.node_id = e.target_id;

-- Current owner of anything that has one
CREATE VIEW v_owner AS
  SELECT source AS node, target AS domain, attrs FROM v_edge WHERE relation = 'owned_by';

-- Domain view (STD-003 R2): features a domain owns, and parts it holds in other domains' features
CREATE VIEW v_domain_features AS
  SELECT o.domain, f.id AS feature, f.title, 'owns' AS role, NULL AS part, f.delivery
  FROM v_owner o JOIN node f ON f.id = o.node AND f.type = 'FEAT'
  UNION ALL
  SELECT o.domain, f.id, f.title, 'participates', p.id, f.delivery
  FROM v_owner o
  JOIN node p ON p.id = o.node AND p.type = 'PART'
  JOIN node f ON f.node_id = p.parent_node_id
  WHERE NOT EXISTS (SELECT 1 FROM v_owner fo WHERE fo.node = f.id AND fo.domain = o.domain);

-- Requirement trace: FR/NFR → implementing code → verifying tests
CREATE VIEW v_requirement_trace AS
  SELECT fr.id AS requirement, feat.id AS feature, fr.delivery,
         impl.source AS implemented_by, ver.source AS verified_by
  FROM node fr
  JOIN node feat ON feat.node_id = fr.parent_node_id
  LEFT JOIN v_edge impl ON impl.target = fr.id AND impl.relation = 'implements'
  LEFT JOIN v_edge ver  ON ver.target  = fr.id AND ver.relation  = 'verifies'
  WHERE fr.type IN ('FR', 'NFR');
