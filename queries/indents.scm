; Indents
; Only indent for structures that have their own braces without nested block nodes
[
  (struct_definition)
  (union_definition)
  (actor_definition)
  (block)
] @indent

; Dedents
[
  "}"
  "]"
  ")"
] @dedent
