; Comments (early so they don't override other highlights)
(comment) @comment.line

; Literals
(number_literal) @constant.numeric.integer
(string_literal) @string
(string_interpolation) @string
(char_literal) @constant.character
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
  "..="
  "..<"
  "..+"
  "+-"
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

; Keywords - control flow
[
  "for"
  "while"
] @keyword.control.repeat

[
  "if"
  "else"
  "switch"
] @keyword.control.conditional

; Expression keywords
(break_expression) @keyword.control
(continue_expression) @keyword.control
(return_expression "return" @keyword.control.return)

; Keywords - other
[
  "as"
] @keyword

"await" @keyword.control
"go" @keyword.control

; Keywords - storage/modifiers
; Note: 'let' declares immutable variables, 'mut' declares mutable variables
[
  "let"
  "mut"
] @keyword.storage.modifier

; Mut keyword in function parameters (separate from declarations)
(parameter "mut" @keyword.storage.modifier)

; Keywords - definition/type
[
  "struct"
  "union"
  "actor"
  "alias"
  "fn"
  "test"
] @keyword.storage.type

"pub" @keyword.storage.modifier

; Types (before variables since type_identifier can appear in expressions)
; Single uppercase letters are generic type parameters
(type_identifier) @type.parameter
  (#match? @type.parameter "^[A-Z]$")

; All other type identifiers
(type_identifier) @type

; Type annotations
(parameter
  type: (type) @type)

(declaration
  type: (type) @type)

(field
  type: (type) @type)

; Variables - generic, will be overridden by more specific rules
(identifier) @variable.other

; Fields - more specific than generic variables
(field
  name: (identifier) @variable.other.member)

(constructor_field
  name: (identifier) @variable.other.member)

(member_expression
  property: (identifier) @variable.other.member)

; Parameters - more specific than generic variables
(parameter
  name: (identifier) @variable.parameter)

; Parameter references in function body
; NOTE: This requires editor support for local scope tracking (locals.scm)
; Helix should automatically apply @variable.parameter to references of parameters
; when local scope analysis is enabled

; Variables in declarations
(declaration
  name: (identifier) @variable.other)

; Switch case patterns - constants
(switch_case
  pattern: (identifier) @constant)

(switch_case
  pattern: (char_literal) @constant.character)

(switch_case
  pattern: (string_literal) @string)

(switch_case
  pattern: (number_literal) @constant.numeric.integer)

(switch_case
  pattern: "_" @constant.builtin)

; Union case labels - constants
(union_case
  label: (identifier) @constant)

; Function calls - more specific than variables
; Note: UFCS means member calls are just regular function calls
(call_expression
  function: (identifier) @function.call)

(call_expression
  function: (member_expression
    property: (identifier) @function.call))

; Function definitions - most specific, should override variables
(function_definition
  name: (identifier) @function)

; Type definitions - most specific for types
(struct_definition
  name: (type) @type)

(union_definition
  name: (type) @type)

(actor_definition
  name: (type) @type)

(alias_definition
  name: (type) @type)

; Test names
(test_definition
  name: (string_literal) @string)
