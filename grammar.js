module.exports = grammar({
  name: 'blitz',

  extras: $ => [
    /\s/,
    $.comment,
  ],

  word: $ => $.identifier,

  conflicts: $ => [
    [$.return_expression],
    [$.type, $._expression],
    [$.function_type],
    [$.block, $.dict_literal],
    [$.block, $.set_literal],
    [$.expression_statement, $.set_literal],
    [$.return_expression, $.range_literal],
    [$.string_literal, $.string_interpolation],
    [$.for_expression, $._expression],
    [$.switch_case, $._expression],
  ],

  rules: {
    source_file: $ => repeat($._definition),

    // Definitions
    _definition: $ => choice(
      $.function_definition,
      $.struct_definition,
      $.union_definition,
      $.actor_definition,
      $.alias_definition,
      $.test_definition,
      $.pub_definition,
    ),

    pub_definition: $ => seq(
      'pub',
      $._definition,
    ),

    function_definition: $ => seq(
      'fn',
      field('name', $.identifier),
      field('parameters', $.parameter_list),
      optional(field('return_type', $.type)),
      optional(field('body', $.block)),
    ),

    parameter_list: $ => seq(
      '(',
      optional(seq(
        $.parameter,
        repeat(seq(',', $.parameter)),
        optional(','),
      )),
      ')',
    ),

    parameter: $ => seq(
      optional('mut'),
      field('name', $.identifier),
      optional(field('type', $.type)),
    ),

    struct_definition: $ => seq(
      'struct',
      field('name', $.type),
      '{',
      repeat($.field),
      '}',
    ),

    union_definition: $ => seq(
      'union',
      field('name', $.type),
      '{',
      repeat($.union_case),
      '}',
    ),

    union_case: $ => choice(
      seq(field('label', $.identifier), ':', field('type', $.type)),
      field('label', choice($.identifier, $.type_identifier)),
    ),

    actor_definition: $ => seq(
      'actor',
      field('name', $.type),
      '{',
      repeat(choice(
        $.field,
        $.function_definition,
      )),
      '}',
    ),

    alias_definition: $ => seq(
      'alias',
      field('name', $.type),
      '=',
      field('type', $.type),
    ),

    test_definition: $ => seq(
      'test',
      field('name', $.string_literal),
      field('body', $.block),
    ),

    field: $ => seq(
      field('name', $.identifier),
      field('type', $.type),
    ),

    // Types
    type: $ => choice(
      $.type_identifier,
      $.generic_type,
      $.optional_type,
      $.result_type,
      $.result_type_unspecified,
      $.future_type,
      $.list_type,
      $.set_type,
      $.dict_type,
      $.ordered_dict_type,
      $.function_type,
    ),

    type_identifier: $ => /[A-Z][a-zA-Z0-9_]*/,

    generic_type: $ => prec(2, seq(
      field('name', $.type_identifier),
      '(',
      seq(
        $.type,
        repeat(seq(',', $.type)),
        optional(','),
      ),
      ')',
    )),

    optional_type: $ => prec.left(1, seq(
      choice($.type_identifier, $.generic_type, $.list_type, $.set_type, $.dict_type, $.ordered_dict_type),
      '?',
    )),

    result_type: $ => prec.left(1, seq(
      choice($.type_identifier, $.generic_type, $.list_type, $.set_type, $.dict_type, $.ordered_dict_type),
      '!',
      choice($.type_identifier, $.generic_type),
    )),

    result_type_unspecified: $ => prec.left(1, seq(
      choice($.type_identifier, $.generic_type, $.list_type, $.set_type, $.dict_type, $.ordered_dict_type),
      '!',
    )),

    future_type: $ => prec.left(1, seq(
      choice($.type_identifier, $.generic_type, $.list_type, $.set_type, $.dict_type, $.ordered_dict_type),
      '~',
    )),

    list_type: $ => prec(2, seq('[', $.type, ']')),

    set_type: $ => prec(2, seq('{', $.type, '}')),

    dict_type: $ => prec(2, seq(
      '{',
      field('key', $.type),
      ':',
      field('value', $.type),
      '}',
    )),

    ordered_dict_type: $ => prec(2, seq(
      '[',
      field('key', $.type),
      ':',
      field('value', $.type),
      ']',
    )),

    function_type: $ => prec(2, seq(
      '|',
      optional(seq(
        $.type,
        repeat(seq(',', $.type)),
      )),
      '|',
      $.type,
    )),

    // Statements
    _statement: $ => choice(
      $.declaration,
      $.expression_statement,
    ),

    declaration: $ => seq(
      choice('let', 'mut'),
      field('name', $.identifier),
      optional(seq(':', field('type', $.type))),
      optional(seq('=', field('value', $._expression))),
    ),

    expression_statement: $ => $._expression,

    // Expressions
    _expression: $ => choice(
      $.identifier,
      $.type_identifier,
      $.number_literal,
      $.string_literal,
      $.char_literal,
      $.boolean_literal,
      $.list_literal,
      $.set_literal,
      $.dict_literal,
      $.ordered_dict_literal,
      $.range_literal,
      $.parenthesized_expression,
      $.call_expression,
      $.constructor_expression,
      $.member_expression,
      $.binary_expression,
      $.unary_expression,
      $.assignment_expression,
      $.compound_assignment_expression,
      $.if_expression,
      $.for_expression,
      $.while_expression,
      $.switch_expression,
      $.block,
      $.return_expression,
      $.break_expression,
      $.continue_expression,
      $.await_expression,
      $.async_expression,
      $.assert_expression,
      $.string_interpolation,
    ),

    parenthesized_expression: $ => seq(
      '(',
      $._expression,
      ')',
    ),

    call_expression: $ => prec.left(15, seq(
      field('function', choice($.identifier, $.member_expression)),
      field('arguments', $.argument_list),
    )),

    argument_list: $ => seq(
      '(',
      optional(seq(
        $._expression,
        repeat(seq(',', $._expression)),
        optional(','),
      )),
      ')',
    ),

    constructor_expression: $ => prec(1, seq(
      optional(field('type', $.type_identifier)),
      '(',
      seq(
        $.constructor_field,
        repeat(seq(',', $.constructor_field)),
        optional(','),
      ),
      ')',
    )),

    constructor_field: $ => seq(
      field('name', $.identifier),
      ':',
      field('value', $._expression),
    ),

    member_expression: $ => prec.left(16, seq(
      field('object', $._expression),
      '.',
      field('property', $.identifier),
    )),

    binary_expression: $ => choice(
      // Arithmetic
      prec.left(12, seq($._expression, '+', $._expression)),
      prec.left(12, seq($._expression, '-', $._expression)),
      prec.left(13, seq($._expression, '*', $._expression)),
      prec.left(13, seq($._expression, '/', $._expression)),
      prec.left(13, seq($._expression, '%', $._expression)),

      // Concatenation
      prec.left(12, seq($._expression, '++', $._expression)),

      // Comparison
      prec.left(9, seq($._expression, '==', $._expression)),
      prec.left(9, seq($._expression, '!=', $._expression)),
      prec.left(10, seq($._expression, '>', $._expression)),
      prec.left(10, seq($._expression, '>=', $._expression)),
      prec.left(10, seq($._expression, '<', $._expression)),
      prec.left(10, seq($._expression, '<=', $._expression)),

      // Logical
      prec.left(5, seq($._expression, 'and', $._expression)),
      prec.left(4, seq($._expression, 'or', $._expression)),

      // Else operator
      prec.left(3, seq($._expression, 'else', $._expression)),

      // Bitwise operators
      prec.left(8, seq($._expression, '&', $._expression)),
      prec.left(6, seq($._expression, '|', $._expression)),
      prec.left(7, seq($._expression, '^', $._expression)),
      prec.left(11, seq($._expression, '<<', $._expression)),
      prec.left(11, seq($._expression, '>>', $._expression)),
    ),

    unary_expression: $ => choice(
      prec.right(14, seq('-', $._expression)),
      prec.right(14, seq('!', $._expression)),
      prec.right(14, seq('~', $._expression)),
    ),

    assignment_expression: $ => prec.right(2, seq(
      field('left', choice($.identifier, $.member_expression)),
      '=',
      field('right', $._expression),
    )),

    compound_assignment_expression: $ => prec.right(2, seq(
      field('left', choice($.identifier, $.member_expression)),
      field('operator', choice(
        '+=',
        '-=',
        '*=',
        '/=',
        '%=',
        '++=',
        '&=',
        '|=',
        '^=',
        '<<=',
        '>>=',
      )),
      field('right', $._expression),
    )),

    if_expression: $ => prec.right(seq(
      'if',
      field('condition', $._expression),
      field('consequence', $.block),
      optional(seq('else', field('alternative', choice($.block, $.if_expression)))),
    )),

    for_expression: $ => seq(
      'for',
      field('iterable', $._expression),
      optional(seq(
        '|',
        field('element', $.identifier),
        '|',
      )),
      field('body', $.block),
    ),

    while_expression: $ => seq(
      'while',
      field('condition', $._expression),
      field('body', $.block),
    ),

    switch_expression: $ => seq(
      'switch',
      field('value', $._expression),
      '{',
      repeat($.switch_case),
      '}',
    ),

    switch_case: $ => seq(
      field('pattern', choice(
        $.type_identifier,
        $.identifier,
        $.char_literal,
        $.string_literal,
        $.number_literal,
        '_',
      )),
      optional(seq('as', field('binding', $.identifier))),
      // Body can be a block or a non-block expression
      // This avoids the ambiguity between blocks and set literals
      field('body', choice(
        $.block,
        $.identifier,
        $.type_identifier,
        $.number_literal,
        $.string_literal,
        $.char_literal,
        $.boolean_literal,
        $.list_literal,
        $.dict_literal,
        $.call_expression,
        $.member_expression,
        $.binary_expression,
        $.unary_expression,
        $.if_expression,
        $.switch_expression,
        $.parenthesized_expression,
      )),
    ),

    block: $ => seq(
      '{',
      repeat($._statement),
      '}',
    ),

    return_expression: $ => seq(
      'return',
      optional($._expression),
    ),

    break_expression: $ => 'break',

    continue_expression: $ => 'continue',

    await_expression: $ => prec.right(14, seq(
      'await',
      $._expression,
    )),

    async_expression: $ => prec.right(14, seq(
      'async',
      $._expression,
    )),

    assert_expression: $ => prec.right(2, seq(
      'assert',
      $._expression,
    )),

    // Literals
    number_literal: $ => /\d+(\.\d+)?/,

    string_literal: $ => seq(
      '"',
      repeat(choice(
        /[^"\\]/,
        seq('\\', /./)
      )),
      '"',
    ),

    string_interpolation: $ => seq(
      '"',
      repeat(choice(
        /[^"\\]/,
        seq('\\', /./),
        seq('\\(', $._expression, ')'),
      )),
      '"',
    ),

    char_literal: $ => seq(
      "'",
      choice(
        /[^'\\]/,
        seq('\\', /./),
      ),
      "'",
    ),

    boolean_literal: $ => choice('true', 'false'),

    list_literal: $ => seq(
      '[',
      optional(seq(
        $._expression,
        repeat(seq(',', $._expression)),
        optional(','),
      )),
      ']',
    ),

    set_literal: $ => prec.dynamic(1, seq(
      '{',
      $._expression,
      repeat(seq(',', $._expression)),
      optional(','),
      '}',
    )),

    dict_literal: $ => seq(
      '{',
      optional(seq(
        $.dict_entry,
        repeat(seq(',', $.dict_entry)),
        optional(','),
      )),
      '}',
    ),

    dict_entry: $ => seq(
      field('key', $._expression),
      ':',
      field('value', $._expression),
    ),

    ordered_dict_literal: $ => seq(
      '[',
      $.dict_entry,
      repeat(seq(',', $.dict_entry)),
      optional(','),
      ']',
    ),

    range_literal: $ => prec.left(8, choice(
      seq($._expression, '..=', $._expression),  // inclusive
      seq($._expression, '..<', $._expression),  // exclusive
      seq($._expression, '..+', $._expression),  // relative
      seq($._expression, '+-', $._expression),   // tolerance
    )),

    // Identifiers
    identifier: $ => /[a-z_][a-zA-Z0-9_]*/,

    // Comments
    comment: $ => token(seq('//', /.*/)),
  },
});
