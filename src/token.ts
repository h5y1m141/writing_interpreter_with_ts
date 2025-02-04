export type TokenType = string

export class Token {
  constructor(
    public type: TokenType,
    public literal: string
  ) {}

  static ILLEGAL: TokenType = 'ILLEGAL'
  static EOF: TokenType = 'EOF'

  // Operators
  static ASSIGN: TokenType = '='
  static PLUS: TokenType = '+'

  // Delimiters
  static COMMA: TokenType = ','
  static SEMICOLON: TokenType = ';'

  static LPAREN: TokenType = '('
  static RPAREN: TokenType = ')'
  static LBRACE: TokenType = '{'
  static RBRACE: TokenType = '}'
}
