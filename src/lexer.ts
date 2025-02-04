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
        // 現時点では未対応の文字は ILLEGAL とする
        token = this.newToken(Token.ILLEGAL, this.currentCharacter)
        break
    }
    this.readChar()
    return token
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
}
