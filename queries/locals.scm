; Scopes
(function_definition) @local.scope
(block) @local.scope
(for_expression) @local.scope
(while_expression) @local.scope

; Definitions
(function_definition
  name: (identifier) @local.definition.function)

(parameter
  name: (identifier) @local.definition.parameter)

(declaration
  name: (identifier) @local.definition.variable)

(for_expression
  element: (identifier) @local.definition.variable)

(switch_case
  binding: (identifier) @local.definition.variable)

; References
(identifier) @local.reference
