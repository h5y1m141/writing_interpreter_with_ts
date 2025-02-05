export type TokenType = string

export class Token {
  constructor(
    public type: TokenType,
    public literal: string
  ) {}

  static ILLEGAL: TokenType = 'ILLEGAL'
  static EOF: TokenType = 'EOF'

  // Identifiers + literals
  static IDENT: TokenType = 'IDENT'
  static INT: TokenType = 'INT'

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

  // Keywords
  static LET: TokenType = 'let'
  static FUNCTION: TokenType = 'FUNCTION'
  static TRUE: TokenType = 'TRUE'
  static FALSE: TokenType = 'FALSE'
  static IF: TokenType = 'IF'
  static ELSE: TokenType = 'ELSE'
  static RETURN: TokenType = 'RETURN'

  static keywords: { [ident: string]: TokenType } = {
    fn: Token.FUNCTION,
    let: Token.LET,
    true: Token.TRUE,
    false: Token.FALSE,
    if: Token.IF,
    else: Token.ELSE,
    return: Token.RETURN,
  }

  static lookupIdent(ident: string): TokenType {
    return Token.keywords[ident] || Token.IDENT
  }
}
