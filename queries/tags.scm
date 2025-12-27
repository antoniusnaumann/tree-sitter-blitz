; Function definitions
(function_definition
  name: (identifier) @name) @definition.function

; Type definitions
(struct_definition
  name: (type) @name) @definition.type

(union_definition
  name: (type) @name) @definition.type

(actor_definition
  name: (type) @name) @definition.type

; Field definitions
(field
  name: (identifier) @name) @definition.field
