export enum TokenType {
  // 特殊トークン
  ILLEGAL = 'ILLEGAL',
  EOF = 'EOF',

  // 識別子 & リテラル
  IDENT = 'IDENT',
  INT = 'INT',

  // 演算子
  ASSIGN = '=',
  PLUS = '+',
  MINUS = '-',
  BANG = '!',
  ASTERISK = '*',
  SLASH = '/',
  LT = '<',
  GT = '>',
  EQ = '==',
  NOT_EQ = '!=',

  // デリミタ
  COMMA = ',',
  SEMICOLON = ';',
  LPAREN = '(',
  RPAREN = ')',
  LBRACE = '{',
  RBRACE = '}',

  // キーワード
  LET = 'let',
  FUNCTION = 'fn',
  TRUE = 'true',
  FALSE = 'false',
  IF = 'if',
  ELSE = 'else',
  RETURN = 'return',
}

export class Token {
  constructor(
    public type: TokenType,
    public literal: string
  ) {}

  static keywords: { [ident: string]: TokenType } = {
    fn: TokenType.FUNCTION,
    let: TokenType.LET,
    true: TokenType.TRUE,
    false: TokenType.FALSE,
    if: TokenType.IF,
    else: TokenType.ELSE,
    return: TokenType.RETURN,
  }

  static lookupIdent(ident: string): TokenType {
    return Token.keywords[ident] || TokenType.IDENT
  }
}
