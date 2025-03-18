import type { Token } from './token'

export type Node = {
  tokenLiteral: () => string // デバッグとテストのために利用
}

export type Statement = Node & {
  statementNode: () => void
}

export interface Expression extends Node {
  expressionNode: () => void
  token: Token
}

export class Program {
  public statements: Statement[]

  constructor(statements: Statement[]) {
    this.statements = statements
  }

  tokenLiteral(): string {
    return this.statements.length > 0 ? this.statements[0].tokenLiteral() : ''
  }
}

export class Identifier implements Expression {
  public token: Token
  public value: string

  constructor(token: Token, value: string) {
    this.token = token
    this.value = value
  }

  tokenLiteral(): string {
    return this.token.literal
  }
  toString(): string {
    return this.value
  }
  expressionNode() {
    console.log('expressionNode')
  }
}

export class IntegerLiteral implements Expression {
  public token: Token
  public value: number

  constructor(token: Token, value: number) {
    this.token = token
    this.value = value
  }

  tokenLiteral(): string {
    return this.token.literal
  }
  toString(): string {
    return this.value.toString()
  }
  expressionNode() {
    console.log('expressionNode')
  }
}

export class BooleanLiteral implements Expression {
  public token: Token
  public value: boolean

  constructor(token: Token, value: boolean) {
    this.token = token
    this.value = value
  }

  tokenLiteral(): string {
    return this.token.literal
  }
  toString(): string {
    return this.value.toString()
  }
  expressionNode() {
    console.log('expressionNode')
  }
}

export class LetStatement implements Statement {
  public token: Token
  public name: Identifier
  public value: Expression | null

  constructor(token: Token, name: Identifier, value: Expression | null = null) {
    this.token = token
    this.name = name
    this.value = value
  }

  tokenLiteral(): string {
    return this.token.literal
  }
  toString(): string {
    let out = `${this.tokenLiteral()} ${this.name.toString()} = `
    if (this.value) {
      out += this.value.toString()
    }
    out += ';'
    return out
  }
  expressionNode() {
    console.log('expressionNode')
  }
  statementNode() {
    console.log('statementNode')
  }
}

export class ReturnStatement implements Statement {
  public token: Token
  public returnValue: Expression

  constructor(token: Token, returnValue: Expression) {
    this.token = token
    this.returnValue = returnValue
  }

  tokenLiteral(): string {
    return this.token.literal
  }

  expressionNode() {
    console.log('expressionNode')
  }
  statementNode() {
    console.log('statementNode')
  }
  toString(): string {
    return `${this.tokenLiteral()} ${this.returnValue.toString()};`
  }
}

export class ExpressionStatement implements Statement {
  public token: Token
  public expression: Expression | null

  constructor(token: Token, expression: Expression | null = null) {
    this.token = token
    this.expression = expression
  }

  tokenLiteral(): string {
    return this.token.literal
  }
  statementNode() {
    console.log('statementNode')
  }
}

export class PrefixExpression implements Statement {
  public token: Token
  public operator: string
  public right: Expression | null

  constructor(token: Token, operator: string, right: Expression | null = null) {
    this.token = token
    this.operator = operator
    this.right = right
  }
  tokenLiteral(): string {
    return this.token.literal
  }
  expressionNode() {
    console.log('expressionNode')
  }
  statementNode() {
    console.log('statementNode')
  }
}

export class InfixExpression implements Statement {
  public token: Token
  public left: Expression | null
  public operator: string
  public right: Expression | null

  constructor(
    token: Token,
    left: Expression | null,
    operator: string,
    right: Expression | null = null
  ) {
    this.token = token
    this.left = left
    this.operator = operator
    this.right = right
  }
  tokenLiteral(): string {
    return this.token.literal
  }
  expressionNode() {
    console.log('expressionNode')
  }
  statementNode() {
    console.log('statementNode')
  }
}
