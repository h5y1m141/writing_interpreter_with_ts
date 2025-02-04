import { describe, it, expect } from 'vitest'
import { Lexer } from 'src/lexer'
import type { TokenType } from 'src/token'
import { Token } from 'src/token'

describe('Lexer', () => {
  it('should tokenize input correctly', () => {
    const input = `=+(){},;`
    const tests: { expectedType: TokenType; expectedLiteral: string }[] = [
      { expectedType: Token.ASSIGN, expectedLiteral: '=' },
      { expectedType: Token.PLUS, expectedLiteral: '+' },
      { expectedType: Token.LPAREN, expectedLiteral: '(' },
      { expectedType: Token.RPAREN, expectedLiteral: ')' },
      { expectedType: Token.LBRACE, expectedLiteral: '{' },
      { expectedType: Token.RBRACE, expectedLiteral: '}' },
      { expectedType: Token.COMMA, expectedLiteral: ',' },
      { expectedType: Token.SEMICOLON, expectedLiteral: ';' },
      { expectedType: Token.EOF, expectedLiteral: '' },
    ]
    const lexer = new Lexer(input)

    tests.forEach((test, index) => {
      const token = lexer.nextToken()
      expect(token.type).toBe(test.expectedType)
      expect(token.literal).toBe(test.expectedLiteral)
    })
  })
})
