# Newline Handling in tree-sitter-blitz

## Current Behavior

The tree-sitter-blitz grammar currently treats **all whitespace (including newlines) as insignificant**. This means newlines do not act as statement separators.

### What Works Well

✅ **Method chaining** - Works correctly across lines:
```blitz
result = foo()
  .bar()
  .baz()
```

✅ **Binary expressions** - Works with operators at end of line:
```blitz
sum = 1 +
  2 +
  3
```

✅ **Multi-line function calls** - Parameters can span multiple lines:
```blitz
print(
  "hello",
  "world"
)
```

✅ **Control flow** - Works across lines:
```blitz
if condition
{
  body
}
```

### Known Limitations

⚠️ **Ambiguous cases** - Some edge cases parse differently than they might in the Blitz compiler:

1. **Unary vs Binary Minus**:
```blitz
x
-y
```
Currently parses as `x - y` (binary subtraction) instead of two statements.

2. **Return with value on next line**:
```blitz
return
5
```
Currently parses as `return` followed by separate `5` statement.

## Why Not Implement Full Newline Handling?

Blitz's own lexer emits `newline` tokens, indicating that newlines ARE significant in the language. However, implementing full newline-sensitive parsing in tree-sitter would require:

1. **External scanner** (C code) to emit newline tokens selectively
2. **Complex lookahead** to distinguish continuation vs termination
3. **Breaking changes** to the grammar that would require rewriting all tests
4. **Potential conflicts** with tree-sitter's parsing model

Since tree-sitter grammars are primarily used for:
- Syntax highlighting
- Code folding  
- Structural navigation
- Static analysis

...and NOT for:
- Compilation
- Runtime execution
- Strict syntactic validation

The current approach is a **reasonable tradeoff** that successfully parses all real-world Blitz code while maintaining simplicity.

## Recommendations for Users

1. **Follow Blitz style conventions**: Keep statements on their own lines
2. **Use explicit continuation**: When breaking expressions across lines, place operators at the end of the line
3. **Avoid ambiguous patterns**: Don't rely on newlines for statement separation in edge cases

## Future Work

If full newline handling becomes necessary, the implementation would need:
- Custom scanner (src/scanner.c) that emits `_newline` tokens
- Grammar rules updated to use `_newline` as statement separators
- Lookahead logic to detect continuation patterns (`.`, `+`, `-`, etc.)
- All test cases updated to expect newline nodes in the parse tree

## Variable Declarations

✅ **Declarations at statement level only** - The grammar correctly restricts variable declarations (`let`/`mut`) to statement contexts. Attempting to use declarations at expression level results in parse errors.

```blitz
// Valid
fn test() {
  let x = 5
}

// Invalid - creates ERROR node
fn test() {
  print(let x = 5)
}
```
