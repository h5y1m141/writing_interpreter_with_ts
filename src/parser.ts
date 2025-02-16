import { Lexer } from './lexer'
import { Token, TokenType } from './token'
import { Identifier, LetStatement, Program, type Statement } from './ast'

export class Parser {
  private lexer: Lexer
  private currentToken!: Token
  private peekToken!: Token

  constructor(lexer: Lexer) {
    this.lexer = lexer

    // 2つトークンを読み込む。curTokenとpeekTokenの両方をセット
    this.nextToken()
    this.nextToken()
  }

  private nextToken(): void {
    this.currentToken = this.peekToken
    this.peekToken = this.lexer.nextToken()
  }

  public parseProgram(): Program {
    let statements: Statement[] = []

    while (this.currentToken.type !== TokenType.EOF) {
      const statement = this.parseStatement()
      if (statement !== null) {
        statements.push(statement)
      }
      this.nextToken()
    }
    const program = new Program(statements)
    return program
  }

  private parseStatement(): Statement | null {
    switch (this.currentToken.type) {
      case TokenType.LET:
        return this.parseLetStatement()
      default:
        return null
    }
  }

  private parseLetStatement(): LetStatement | null {
    const statement = new LetStatement(
      this.currentToken,
      new Identifier(this.peekToken, '')
    )

    if (!this.expectPeek(TokenType.IDENT)) return null

    statement.name = new Identifier(
      this.currentToken,
      this.currentToken.literal
    )

    if (!this.expectPeek(TokenType.ASSIGN)) return null

    this.nextToken()

    statement.value = new Identifier(
      this.currentToken,
      this.currentToken.literal
    )

    if (!this.expectPeek(TokenType.SEMICOLON)) return null

    return statement
  }

  private expectPeek(tokenType: TokenType) {
    if (this.peekTokenIs(tokenType)) {
      this.nextToken()
      return true
    } else {
      return false
    }
  }

  private curTokenIs(tokenType: TokenType) {
    return this.currentToken.type === tokenType
  }
  private peekTokenIs(tokenType: TokenType) {
    return this.peekToken.type === tokenType
  }
}
