// 特殊トークン
export const SpecialTokens = {
  ILLEGAL: 'ILLEGAL',
  EOF: 'EOF',
} as const

// 識別子 & リテラル
export const IdentifiersAndLiterals = {
  IDENT: 'IDENT',
  INT: 'INT',
} as const

// 演算子
export const Operators = {
  ASSIGN: '=',
  PLUS: '+',
  MINUS: '-',
  BANG: '!',
  ASTERISK: '*',
  SLASH: '/',
  LT: '<',
  GT: '>',
  EQ: '==',
  NOT_EQ: '!=',
} as const

// デリミタ
export const Delimiters = {
  COMMA: ',',
  SEMICOLON: ';',
  LPAREN: '(',
  RPAREN: ')',
  LBRACE: '{',
  RBRACE: '}',
} as const

// キーワード
export const Keywords = {
  LET: 'let',
  FUNCTION: 'fn',
  TRUE: 'true',
  FALSE: 'false',
  IF: 'if',
  ELSE: 'else',
  RETURN: 'return',
} as const

export const TokenType = {
  ...SpecialTokens,
  ...IdentifiersAndLiterals,
  ...Operators,
  ...Delimiters,
  ...Keywords,
} as const

export type TokenType = (typeof TokenType)[keyof typeof TokenType]

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
