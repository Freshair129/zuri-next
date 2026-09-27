---
id: FR-057-002
title: "Read-only GitHub projection of a Business-owned repository (declared, blocked)"
delivery: building
legacy: [FR-130 (split 2/2)]
relations:
  specified_by: [SDD-057]
  derived_from: [BR-047, SEC-004]
---

# FR-057-002 — Read-only GitHub projection of a Business-owned repository (declared, blocked)

The system SHALL let a person the owning Business admits read the tree and file
contents of a `Repository` that Business owns and that names its GitHub origin, as a
live read-through (no stored mirror, no sync columns); `Repository.url` /
`defaultBranch` (with `ProjectRepository.branch` override) identify it, GitHub's numeric
id is kept only as an external reference, and the feature SHALL NOT be enabled until a
recorded assertion that the repository contains no personal data exists.

## Acceptance criteria

- AC-057-002-01 — Given a repository without the no-personal-data assertion, when a projection is requested, then it is refused.

## Implementation

- — (declared, blocked)
