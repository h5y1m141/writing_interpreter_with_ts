import { Lexer } from './lexer'
import { Token, TokenType } from './token'
import {
  Identifier,
  BooleanLiteral,
  IntegerLiteral,
  LetStatement,
  Program,
  ReturnStatement,
  ExpressionStatement,
  type Statement,
  PrefixExpression,
  InfixExpression,
  CallExpression,
  IfExpression,
} from './ast'
import { BlockStatement, type Expression } from './ast'

// 書籍ではLOWESTのみ明示的に値を設定していたが後述する
// precedence < this.peekPrecedence()
// の比較処理でここの値を参照する構造のため明示的に全ての値を設定しています
export enum Precedence {
  LOWEST = 0,
  EQUALS = 1, // ==, !=
  LESSGREATER = 2, // >, <
  SUM = 3, // +, -
  PRODUCT = 4, // *, /
  PREFIX = 5, // -X, !X
  CALL = 6, // 関数呼び出し
}

export const precedences: Partial<Record<TokenType, Precedence>> = {
  [TokenType.EQ]: Precedence.EQUALS,
  [TokenType.NOT_EQ]: Precedence.EQUALS,
  [TokenType.LT]: Precedence.LESSGREATER,
  [TokenType.GT]: Precedence.LESSGREATER,
  [TokenType.PLUS]: Precedence.SUM,
  [TokenType.MINUS]: Precedence.SUM,
  [TokenType.SLASH]: Precedence.PRODUCT,
  [TokenType.ASTERISK]: Precedence.PRODUCT,
  [TokenType.LPAREN]: Precedence.CALL,
}

export class Parser {
  private lexer: Lexer
  private currentToken!: Token
  private peekToken!: Token
  private errors: string[] = [] // エラーメッセージを保持するための
  // 前置構文解析関数（prefixParseFunction）
  private prefixParseFunctions: Map<TokenType, () => Expression> = new Map()
  // 中置構文解析関数（infixParseFunction）
  private infixParseFunctions: Map<
    TokenType,
    (left: Expression) => Expression
  > = new Map()
  // 次のトークン (peekToken) の優先順位を取得する関数
  private peekPrecedence(): Precedence {
    return precedences[this.peekToken.type] ?? Precedence.LOWEST
  }
  constructor(lexer: Lexer) {
    this.lexer = lexer

    // 2つトークンを読み込む。curTokenとpeekTokenの両方をセット
    this.nextToken()
    this.nextToken()

    this.registerPrefix(TokenType.IDENT, this.parseIdentifier.bind(this))
    this.registerPrefix(TokenType.INT, this.parseIntegerLiteral.bind(this))
    this.registerPrefix(TokenType.BANG, this.parsePrefixExpression.bind(this))
    this.registerPrefix(TokenType.MINUS, this.parsePrefixExpression.bind(this))
    this.registerPrefix(TokenType.TRUE, this.parseBoolean.bind(this))
    this.registerPrefix(TokenType.FALSE, this.parseBoolean.bind(this))
    this.registerPrefix(
      TokenType.LPAREN,
      this.parseGroupedExpression.bind(this)
    )
    this.registerPrefix(TokenType.IF, this.parseIfExpression.bind(this))

    this.registerInfix(TokenType.PLUS, this.parseInfixExpression.bind(this))
    this.registerInfix(TokenType.MINUS, this.parseInfixExpression.bind(this))
    this.registerInfix(TokenType.SLASH, this.parseInfixExpression.bind(this))
    this.registerInfix(TokenType.ASTERISK, this.parseInfixExpression.bind(this))
    this.registerInfix(TokenType.EQ, this.parseInfixExpression.bind(this))
    this.registerInfix(TokenType.NOT_EQ, this.parseInfixExpression.bind(this))
    this.registerInfix(TokenType.LT, this.parseInfixExpression.bind(this))
    this.registerInfix(TokenType.GT, this.parseInfixExpression.bind(this))

    this.registerInfix(TokenType.LPAREN, this.parseCallExpression.bind(this))
  }

  private registerPrefix(tokenType: TokenType, fn: () => Expression) {
    this.prefixParseFunctions.set(tokenType, fn)
  }

  private registerInfix(
    tokenType: TokenType,
    fn: (left: Expression) => Expression
  ) {
    this.infixParseFunctions.set(tokenType, fn)
  }

  private parseIdentifier(): Expression {
    return new Identifier(this.currentToken, this.currentToken.literal)
  }
  private parseIntegerLiteral(): Expression {
    return new IntegerLiteral(
      this.currentToken,
      parseInt(this.currentToken.literal, 10)
    )
  }
  private parseBoolean(): Expression {
    return new BooleanLiteral(
      this.currentToken,
      this.currentToken.type === TokenType.TRUE
    )
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
      case TokenType.RETURN:
        return this.parseReturnStatement()
      default:
        return this.parseExpressionStatement()
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

  private parseReturnStatement(): ReturnStatement | null {
    const statement = new ReturnStatement(
      this.currentToken,
      new Identifier(this.peekToken, '')
    )

    this.nextToken()

    statement.returnValue = this.parseExpression(Precedence.LOWEST)

    if (!this.expectPeek(TokenType.SEMICOLON)) return null

    return statement
  }

  private parseExpressionStatement(): ExpressionStatement {
    const statement = new ExpressionStatement(this.currentToken)
    statement.expression = this.parseExpression(Precedence.LOWEST)

    if (this.peekTokenIs(TokenType.SEMICOLON)) {
      this.nextToken()
    }
    return statement
  }

  private expectPeek(tokenType: TokenType) {
    if (this.peekTokenIs(tokenType)) {
      this.nextToken()
      return true
    } else {
      this.peekError(tokenType)
      return false
    }
  }

  private curTokenIs(tokenType: TokenType) {
    return this.currentToken.type === tokenType
  }

  private peekTokenIs(tokenType: TokenType) {
    return this.peekToken.type === tokenType
  }

  private peekError(expectedType: TokenType): void {
    const msg = `expected next token to be ${expectedType}, got ${this.peekToken.type} instead`
    this.errors.push(msg)
  }

  public getErrors(): string[] {
    return this.errors
  }

  private parseExpression(precedence: Precedence): Expression {
    const prefix = this.prefixParseFunctions.get(this.currentToken.type)
    if (!prefix) {
      this.errors.push(
        `no prefix parse function for ${this.currentToken.type} found`
      )
      return new Identifier(this.currentToken, '') // 仮のダミー
    }
    let leftExpression = prefix()

    while (
      !this.peekTokenIs(TokenType.SEMICOLON) &&
      precedence < this.peekPrecedence()
    ) {
      const infix = this.infixParseFunctions.get(this.peekToken.type)
      if (!infix) return leftExpression

      this.nextToken()
      leftExpression = infix(leftExpression)
    }
    return leftExpression
  }

  private parsePrefixExpression(): Expression {
    const expression = new PrefixExpression(
      this.currentToken,
      this.currentToken.literal
    )
    this.nextToken()
    expression.right = this.parseExpression(Precedence.PREFIX)
    return expression
  }
  private parseInfixExpression(left: Expression): Expression {
    const expression = new InfixExpression(
      this.currentToken,
      left,
      this.currentToken.literal
    )
    const precedence = this.currentPrecedence()
    this.nextToken()
    expression.right = this.parseExpression(precedence)
    return expression
  }
  private currentPrecedence() {
    return precedences[this.currentToken.type] ?? Precedence.LOWEST
  }
  private parseGroupedExpression(): Expression {
    this.nextToken()
    const expression = this.parseExpression(Precedence.LOWEST)

    if (!this.expectPeek(TokenType.RPAREN)) {
      return new Identifier(this.currentToken, '') // 仮のダミー
    }
    return expression
  }
  private parseCallExpression(func: Expression): Expression {
    const args = this.parseCallArguments()
    return new CallExpression(this.currentToken, func, args)
  }
  private parseCallArguments(): Expression[] {
    const args: Expression[] = []

    if (this.peekTokenIs(TokenType.RPAREN)) {
      this.nextToken()
      return args
    }
    this.nextToken()
    args.push(this.parseExpression(Precedence.LOWEST))
    while (this.peekTokenIs(TokenType.COMMA)) {
      this.nextToken()
      this.nextToken()
      args.push(this.parseExpression(Precedence.LOWEST))
    }

    if (!this.expectPeek(TokenType.RPAREN)) {
      return [] // 仮のダミー
    }
    return args
  }
  private parseIfExpression(): Expression {
    const expression = new IfExpression(this.currentToken)

    // '(' が次に来ることを期待
    if (!this.expectPeek(TokenType.LPAREN)) {
      return new Identifier(this.currentToken, '') // 仮のダミー
    }
    this.nextToken() // '('をスキップして次のトークンへ
    expression.condition = this.parseExpression(Precedence.LOWEST)

    // ')' が次に来ることを期待
    if (!this.expectPeek(TokenType.RPAREN)) {
      return new Identifier(this.currentToken, '') // 仮のダミー
    }

    // '{' が次に来ることを期待
    if (!this.expectPeek(TokenType.LBRACE)) {
      return new Identifier(this.currentToken, '') // 仮のダミー
    }
    expression.consequence = this.parseBlockStatement()

    // else部分が存在するかチェック
    if (this.peekTokenIs(TokenType.ELSE)) {
      this.nextToken()
      if (!this.expectPeek(TokenType.LBRACE)) {
        return new Identifier(this.currentToken, '') // 仮のダミー
      }
      expression.alternative = this.parseBlockStatement()
    }
    return expression
  }
  private parseBlockStatement(): BlockStatement {
    const block = new BlockStatement(this.currentToken)
    block.statements = []

    this.nextToken()

    // '}'が来るまでステートメントを解析し続ける
    while (
      !this.curTokenIs(TokenType.RBRACE) &&
      !this.curTokenIs(TokenType.EOF)
    ) {
      const statement = this.parseStatement()
      if (statement !== null) {
        block.statements.push(statement)
      }
      this.nextToken()
    }
    return block
  }
}
