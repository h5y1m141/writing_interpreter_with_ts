import { describe, it, expect } from 'vitest'
import { Lexer } from '../src/lexer'
import { Parser } from '../src/parser'
import { LetStatement, Program } from '../src/ast'
import type {
  ExpressionStatement,
  Identifier,
  ReturnStatement,
  Statement,
} from '../src/ast'
import { TokenType } from 'src/token'

const checkParseErrors = (parser: Parser) => {
  const errors = parser.getErrors()
  if (errors.length === 0) return

  errors.forEach((error) => {
    console.error(`Parser error: "${error}"`)
  })

  throw new Error(`Parse failed with ${errors.length} error(s)`)
}
describe('Parser', () => {
  describe('let', () => {
    const input = `
    let x = 5;
    let y = 10;
    let foobar = 838383;`
    const lexer = new Lexer(input)
    const parser = new Parser(lexer)
    const program: Program | null = parser.parseProgram()
    checkParseErrors(parser)

    it('program not to be null', () => {
      expect(program).not.toBeNull()
    })
    it('program statements length valid', () => {
      expect(program!.statements.length).toBe(3)
    })
    it('parses let statements correctly', () => {
      const tests = [
        { expectedIdentifier: 'x' },
        { expectedIdentifier: 'y' },
        { expectedIdentifier: 'foobar' },
      ]
      for (let i = 0; i < tests.length; i++) {
        const statement = program!.statements[i]
        expect(testLetStatement(statement, tests[i].expectedIdentifier)).toBe(
          true
        )
      }
    })
    it('should parse let statements into correct AST structure', () => {
      const expectedResults = [
        {
          token: { type: TokenType.LET, literal: 'let' },
          name: {
            token: { type: TokenType.IDENT, literal: 'x' },
            value: 'x',
          },
          value: {
            token: { type: TokenType.INT, literal: '5' },
            value: '5',
          },
        },
        {
          token: { type: TokenType.LET, literal: 'let' },
          name: {
            token: { type: TokenType.IDENT, literal: 'y' },
            value: 'y',
          },
          value: {
            token: { type: TokenType.INT, literal: '10' },
            value: '10',
          },
        },
        {
          token: { type: TokenType.LET, literal: 'let' },
          name: {
            token: { type: TokenType.IDENT, literal: 'foobar' },
            value: 'foobar',
          },
          value: {
            token: { type: TokenType.INT, literal: '838383' },
            value: '838383',
          },
        },
      ]
      expectedResults.forEach((expectedResult, index) => {
        const statement = program.statements[index] as LetStatement
        const expected = expectedResult
        expect(statement.token).toEqual(expected.token)
        expect(statement.name.token).toEqual(expected.name.token)
        expect(statement.name.value).toEqual(expected.name.value)
        expect(statement.value!.token).toEqual(expected.value.token)
      })
    })
  })

  describe('return', () => {
    const input = `return 5;
return true;
return foobar;`
    const lexer = new Lexer(input)
    const parser = new Parser(lexer)
    const program: Program | null = parser.parseProgram()
    checkParseErrors(parser)
    it('should parse return statements into correct AST structure', () => {
      const expectedResults = [
        {
          token: { type: TokenType.RETURN, literal: 'return' },
          returnValue: {
            token: { type: TokenType.INT, literal: '5' },
            value: 5,
          },
        },
        {
          token: { type: TokenType.RETURN, literal: 'return' },
          returnValue: {
            token: { type: TokenType.TRUE, literal: 'true' },
            value: true,
          },
        },
        {
          token: { type: TokenType.RETURN, literal: 'return' },
          returnValue: {
            token: { type: TokenType.IDENT, literal: 'foobar' },
            value: 'foobar',
          },
        },
      ]

      expectedResults.forEach((expectedResult, index) => {
        const statement = program.statements[index] as ReturnStatement
        const expected = expectedResult
        expect(statement.token).toEqual(expected.token)
        expect(statement.returnValue).toEqual(expected.returnValue)
      })
    })
  })
  describe('expression', () => {
    const input = 'foobar;'
    const lexer = new Lexer(input)
    const parser = new Parser(lexer)
    const program: Program | null = parser.parseProgram()
    checkParseErrors(parser)
    it('should parse expression statements into correct AST structure', () => {
      const expectedResults = [
        {
          token: { type: TokenType.IDENT, literal: 'foobar' },
          expression: {
            token: { type: TokenType.IDENT, literal: 'foobar' },
            value: 'foobar',
          },
        },
      ]
      expectedResults.forEach((expectedResult, index) => {
        const statement = program.statements[index] as ExpressionStatement
        const expected = expectedResult
        expect(statement.token).toEqual(expected.token)

        const identifier = statement.expression as Identifier
        expect(identifier.token).toEqual(expected.expression.token)
        expect(identifier.value).toEqual(expected.expression.value)
      })
    })
  })
})

export function testLetStatement(statement: Statement, name: string): boolean {
  if (statement.tokenLiteral() !== 'let') {
    console.error(
      `statement.tokenLiteral() not 'let'. got=${statement.tokenLiteral()}`
    )
    return false
  }

  if (!(statement instanceof LetStatement)) {
    console.error(
      `statement is not an instance of LetStatement. got=${statement.constructor.name}`
    )
    return false
  }

  if (statement.name.value !== name) {
    console.error(
      `statement.name.value not '${name}'. got=${statement.name.value}`
    )
    return false
  }

  if (statement.name.tokenLiteral() !== name) {
    console.error(
      `statement.name.tokenLiteral() not '${name}'. got=${statement.name.tokenLiteral()}`
    )
    return false
  }

  return true
}
