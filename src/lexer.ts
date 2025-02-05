import type { TokenType } from 'src/token'
import { Token } from 'src/token'

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
        token = this.newToken(Token.ASSIGN, this.currentCharacter)
        break
      case ';':
        token = this.newToken(Token.SEMICOLON, this.currentCharacter)
        break
      case '(':
        token = this.newToken(Token.LPAREN, this.currentCharacter)
        break
      case ')':
        token = this.newToken(Token.RPAREN, this.currentCharacter)
        break
      case ',':
        token = this.newToken(Token.COMMA, this.currentCharacter)
        break
      case '+':
        token = this.newToken(Token.PLUS, this.currentCharacter)
        break
      case '{':
        token = this.newToken(Token.LBRACE, this.currentCharacter)
        break
      case '}':
        token = this.newToken(Token.RBRACE, this.currentCharacter)
        break
      case '\0':
        token = this.newToken(Token.EOF, '')
        break
      default:
        if (this.isLetter(this.currentCharacter)) {
          const literal = this.readIdentifier()
          // 識別子がキーワードであるかどうかは lookupIdent() で判定
          return new Token(Token.lookupIdent(literal), literal)
        } else if (this.isDigit(this.currentCharacter)) {
          const type = Token.INT
          const literal = this.readNumber()
          return new Token(type, literal)
        } else {
          token = this.newToken(Token.ILLEGAL, this.currentCharacter)
        }
        break
    }
    this.readChar()
    return token
  }

  private skipWhitespace() {
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
}
