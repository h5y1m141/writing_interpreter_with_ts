import { Token, TokenType } from 'src/token'

export class Lexer {
  private input: string
  private position: number
  private readPosition: number
  private currentCharacter: string

  constructor(input: string) {
    this.input = input
    this.position = 0
    this.readPosition = 0
    this.currentCharacter = ''

    this.readChar()
  }

  public nextToken(): Token {
    let token: Token

    this.skipWhitespace()

    switch (this.currentCharacter) {
      case '=':
        if (this.isPeekCharAssign()) {
          const type = TokenType.EQ
          const literal = this.extractChainedOperator()
          token = this.newToken(type, literal)
          break
        } else {
          token = this.newToken(TokenType.ASSIGN, this.currentCharacter)
          break
        }

      case ';':
        token = this.newToken(TokenType.SEMICOLON, this.currentCharacter)
        break
      case '(':
        token = this.newToken(TokenType.LPAREN, this.currentCharacter)
        break
      case ')':
        token = this.newToken(TokenType.RPAREN, this.currentCharacter)
        break
      case ',':
        token = this.newToken(TokenType.COMMA, this.currentCharacter)
        break
      case '+':
        token = this.newToken(TokenType.PLUS, this.currentCharacter)
        break
      case '{':
        token = this.newToken(TokenType.LBRACE, this.currentCharacter)
        break
      case '}':
        token = this.newToken(TokenType.RBRACE, this.currentCharacter)
        break
      case '+':
        token = this.newToken(TokenType.PLUS, this.currentCharacter)
        break
      case '-':
        token = this.newToken(TokenType.MINUS, this.currentCharacter)
        break
      case '!':
        if (this.isPeekCharAssign()) {
          const type = TokenType.NOT_EQ
          const literal = this.extractChainedOperator()
          token = this.newToken(type, literal)
          break
        } else {
          token = this.newToken(TokenType.BANG, this.currentCharacter)
          break
        }
      case '/':
        token = this.newToken(TokenType.SLASH, this.currentCharacter)
        break
      case '*':
        token = this.newToken(TokenType.ASTERISK, this.currentCharacter)
        break
      case '<':
        token = this.newToken(TokenType.LT, this.currentCharacter)
        break
      case '>':
        token = this.newToken(TokenType.GT, this.currentCharacter)
        break
      case '\0':
        token = this.newToken(TokenType.EOF, '')
        break
      default:
        if (this.isLetter(this.currentCharacter)) {
          const literal = this.readIdentifier()
          // 識別子がキーワードであるかどうかは lookupIdent() で判定
          return new Token(Token.lookupIdent(literal), literal)
        } else if (this.isDigit(this.currentCharacter)) {
          const type = TokenType.INT
          const literal = this.readNumber()
          return new Token(type, literal)
        } else {
          token = this.newToken(TokenType.ILLEGAL, this.currentCharacter)
        }
        break
    }
    this.readChar()
    return token
  }

  public skipWhitespace() {
    const skipCharacters = [' ', '\t', '\n', '\r']
    while (skipCharacters.includes(this.currentCharacter)) {
      this.readChar()
    }
  }

  private readChar(): void {
    this.currentCharacter =
      this.readPosition >= this.input.length
        ? '\0'
        : this.input[this.readPosition]
    this.position = this.readPosition
    this.readPosition += 1
  }

  private newToken(type: TokenType, literal: string): Token {
    return new Token(type, literal)
  }

  public readIdentifier() {
    const position = this.position
    while (this.isLetter(this.currentCharacter)) {
      this.readChar()
    }
    return this.input.substring(position, this.position)
  }

  public isLetter(currentCharacter: string) {
    return (
      (currentCharacter >= 'a' && currentCharacter <= 'z') ||
      (currentCharacter >= 'A' && currentCharacter <= 'Z') ||
      currentCharacter === '_'
    )
  }

  private isDigit(currentCharacter: string) {
    return '0' <= currentCharacter && this.currentCharacter <= '9'
  }

  private readNumber() {
    const position = this.position
    while (this.isDigit(this.currentCharacter)) {
      this.readChar()
    }
    return this.input.substring(position, this.position)
  }

  public extractChainedOperator() {
    const keepCurrentCharacter = this.currentCharacter
    this.readChar()
    return keepCurrentCharacter + this.currentCharacter
  }

  // NOTE:本来はprivateメソッド
  // 挙動がわかりづらいため自分の理解確認のためにユニットテストを書くためにpublicにしています
  public peekChar() {
    if (this.readPosition >= this.input.length) {
      return 0
    } else {
      return this.input[this.readPosition]
    }
  }

  private isPeekCharAssign() {
    return this.peekChar() == '='
  }
}
