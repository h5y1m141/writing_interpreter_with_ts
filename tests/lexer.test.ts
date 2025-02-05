import { describe, it, expect } from 'vitest'
import { Lexer } from 'src/lexer'
import type { TokenType } from 'src/token'
import { Token } from 'src/token'

describe('Lexer', () => {
  it('should tokenize input correctly', () => {
    const input = `let five = 5; let ten = 10;
    let add = fn(x, y) { x + y;
    };
    let result = add(five, ten);
    `
    const tests: { expectedType: TokenType; expectedLiteral: string }[] = [
      { expectedType: Token.LET, expectedLiteral: 'let' },
      { expectedType: Token.IDENT, expectedLiteral: 'five' },
      { expectedType: Token.ASSIGN, expectedLiteral: '=' },
      { expectedType: Token.INT, expectedLiteral: '5' },
      { expectedType: Token.SEMICOLON, expectedLiteral: ';' },
      { expectedType: Token.LET, expectedLiteral: 'let' },
      { expectedType: Token.IDENT, expectedLiteral: 'ten' },
      { expectedType: Token.ASSIGN, expectedLiteral: '=' },
      { expectedType: Token.INT, expectedLiteral: '10' },
      { expectedType: Token.SEMICOLON, expectedLiteral: ';' },
      { expectedType: Token.LET, expectedLiteral: 'let' },
      { expectedType: Token.IDENT, expectedLiteral: 'add' },
      { expectedType: Token.ASSIGN, expectedLiteral: '=' },
      { expectedType: Token.FUNCTION, expectedLiteral: 'fn' },
      { expectedType: Token.LPAREN, expectedLiteral: '(' },
      { expectedType: Token.IDENT, expectedLiteral: 'x' },
      { expectedType: Token.COMMA, expectedLiteral: ',' },
      { expectedType: Token.IDENT, expectedLiteral: 'y' },
      { expectedType: Token.RPAREN, expectedLiteral: ')' },
      { expectedType: Token.LBRACE, expectedLiteral: '{' },
      { expectedType: Token.IDENT, expectedLiteral: 'x' },
      { expectedType: Token.PLUS, expectedLiteral: '+' },
      { expectedType: Token.IDENT, expectedLiteral: 'y' },
      { expectedType: Token.SEMICOLON, expectedLiteral: ';' },
      { expectedType: Token.RBRACE, expectedLiteral: '}' },
      { expectedType: Token.SEMICOLON, expectedLiteral: ';' },
      { expectedType: Token.LET, expectedLiteral: 'let' },
      { expectedType: Token.IDENT, expectedLiteral: 'result' },
      { expectedType: Token.ASSIGN, expectedLiteral: '=' },
      { expectedType: Token.IDENT, expectedLiteral: 'add' },
      { expectedType: Token.LPAREN, expectedLiteral: '(' },
      { expectedType: Token.IDENT, expectedLiteral: 'five' },
      { expectedType: Token.COMMA, expectedLiteral: ',' },
      { expectedType: Token.IDENT, expectedLiteral: 'ten' },
      { expectedType: Token.RPAREN, expectedLiteral: ')' },
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
