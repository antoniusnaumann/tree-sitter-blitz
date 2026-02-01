# Assert Expression Support

## Overview

Added support for the `assert` keyword in both prefix and UFCS (Uniform Function Call Syntax) forms.

## Syntax Forms

### Prefix Form
```blitz
assert expression
```

The `assert` keyword takes the entire following expression:
```blitz
assert x > 0
assert a == b
assert items.length() > 0
assert x > 0 and y > 0
```

### UFCS/Postfix Form
```blitz
expression.assert
```

The `.assert` method can be called on any expression:
```blitz
(x > 0).assert
(a == b).assert
items.is_empty().assert
getValue().assert
```

## Implementation Details

### Grammar Changes (`grammar.js`)

1. **Added `assert_expression` to expression types** (line ~242):
```javascript
_expression: $ => choice(
  // ... other expressions
  $.assert_expression,
  // ...
)
```

2. **Defined `assert_expression` rule** (line ~444):
```javascript
assert_expression: $ => prec.right(2, seq(
  'assert',
  $._expression,
)),
```

**Precedence**: Set to `2` (lower than comparison operators at 9-10) so that `assert a == b` is parsed as `assert (a == b)` rather than `(assert a) == b`.

### Highlighting (`queries/highlights.scm`)

1. **Keyword highlighting for prefix form**:
```scheme
(assert_expression "assert" @keyword.control)
"assert" @keyword.control
```

2. **UFCS form highlighting**:
```scheme
(member_expression
  property: (identifier) @keyword.control
  (#match? @keyword.control "^(await|async|assert)$"))
```

This ensures `.assert` is highlighted as a keyword when used in method position.

## Test Coverage

Added test case in `test/corpus/test.txt`:
```blitz
fn test() {
  assert x > 0
  (x > 0).assert
}
```

Expected parse tree includes:
- `assert_expression` node for prefix form
- `member_expression` with `property: (identifier)` for UFCS form

## Examples

Added comprehensive examples to `examples/example.blitz` demonstrating both forms.

## Compatibility

- ✅ All existing tests pass (11/11)
- ✅ Prefix form parses correctly with proper precedence
- ✅ UFCS form parses as standard member expression
- ✅ Both forms highlight correctly as `@keyword.control`
- ✅ Works with complex expressions and logical operators

## Precedence Table

For reference, here are the relevant precedence levels:

| Precedence | Operators/Constructs |
|------------|---------------------|
| 14 | Unary (`-`, `!`), `await`, `async` |
| 12 | Concatenation (`++`) |
| 11 | Bitshift (`<<`, `>>`) |
| 10 | Comparison (`>`, `>=`, `<`, `<=`) |
| 9 | Equality (`==`, `!=`) |
| 8 | Bitwise AND (`&`) |
| 7 | Bitwise XOR (`^`) |
| 6 | Bitwise OR (`\|`) |
| 5 | Logical AND (`and`) |
| 4 | Logical OR (`or`) |
| 3 | Else operator (`else`) |
| **2** | **Assert (`assert`)** |

The low precedence ensures `assert` captures the entire expression including comparisons and logical operators.
