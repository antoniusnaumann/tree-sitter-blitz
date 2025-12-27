; Keywords
[
  "struct"
  "union"
  "actor"
  "alias"
  "fn"
  "pub"
  "let"
  "mut"
  "for"
  "while"
  "if"
  "else"
  "switch"
  "test"
  "as"
] @keyword

; Expression keywords
(break_expression) @keyword
(continue_expression) @keyword
(return_expression "return" @keyword)
(await_expression "await" @keyword)
(go_expression "go" @keyword)

; Boolean literals
(boolean_literal) @constant.builtin.boolean

; Operators
[
  "+"
  "-"
  "*"
  "/"
  "%"
  "++"
  "!"
  "=="
  "!="
  ">"
  ">="
  "<"
  "<="
  "="
  "+="
  "-="
  "*="
  "/="
  "%="
  "++="
  "&"
  "|"
  "^"
  "~"
  "<<"
  ">>"
  "&="
  "|="
  "^="
  "<<="
  ">>="
] @operator

; Punctuation
[
  ","
  "."
] @punctuation.delimiter

[
  "("
  ")"
  "["
  "]"
  "{"
  "}"
] @punctuation.bracket

; Function definitions
(function_definition
  name: (identifier) @function)

(parameter
  name: (identifier) @variable.parameter)

; Function calls
(call_expression
  function: (identifier) @function.call)

(call_expression
  function: (member_expression
    property: (identifier) @function.method.call))

; Types
(type_identifier) @type

(struct_definition
  name: (type) @type.definition)

(union_definition
  name: (type) @type.definition)

(actor_definition
  name: (type) @type.definition)

(alias_definition
  name: (type) @type.definition)

; Type annotations
(parameter
  type: (type) @type)

(declaration
  type: (type) @type)

(field
  type: (type) @type)

; Variables
(identifier) @variable

(declaration
  name: (identifier) @variable)

(field
  name: (identifier) @property)

(constructor_field
  name: (identifier) @property)

(member_expression
  property: (identifier) @property)

; Literals
(number_literal) @constant.numeric
(string_literal) @string
(string_interpolation) @string
(char_literal) @string.special

; Comments
(comment) @comment

; Special patterns
(switch_case
  pattern: (identifier) @constant)

(switch_case
  pattern: "_" @constant.builtin)

; Test names
(test_definition
  name: (string_literal) @string.special)

; Range operators
[
  "..="
  "..<"
  "..+"
  "+-"
] @operator

; Type modifiers
[
  "?"
  "!"
  "~"
] @type.qualifier
