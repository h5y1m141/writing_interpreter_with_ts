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
