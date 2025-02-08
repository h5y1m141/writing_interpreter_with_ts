import { describe, it, expect } from 'vitest'
import { Lexer } from 'src/lexer'
import type { TokenType } from 'src/token'
import { Token } from 'src/token'

describe('Lexer', () => {
  describe('nextToken', () => {
    it('should tokenize input correctly', () => {
      const input = `let five = 5; let ten = 10;
      let add = fn(x, y) { x + y;
      };
      let result = add(five, ten);
      !-/*5;
      5 < 10 > 5;
      if (5 < 10) {
        return true;
      } else {
        return false;
      }
      10 == 10;
      10 != 9;
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
        { expectedType: Token.BANG, expectedLiteral: '!' },
        { expectedType: Token.MINUS, expectedLiteral: '-' },
        { expectedType: Token.SLASH, expectedLiteral: '/' },
        { expectedType: Token.ASTERISK, expectedLiteral: '*' },
        { expectedType: Token.INT, expectedLiteral: '5' },
        { expectedType: Token.SEMICOLON, expectedLiteral: ';' },
        { expectedType: Token.INT, expectedLiteral: '5' },
        { expectedType: Token.LT, expectedLiteral: '<' },
        { expectedType: Token.INT, expectedLiteral: '10' },
        { expectedType: Token.GT, expectedLiteral: '>' },
        { expectedType: Token.INT, expectedLiteral: '5' },
        { expectedType: Token.SEMICOLON, expectedLiteral: ';' },
        { expectedType: Token.IF, expectedLiteral: 'if' },
        { expectedType: Token.LPAREN, expectedLiteral: '(' },
        { expectedType: Token.INT, expectedLiteral: '5' },
        { expectedType: Token.LT, expectedLiteral: '<' },
        { expectedType: Token.INT, expectedLiteral: '10' },
        { expectedType: Token.RPAREN, expectedLiteral: ')' },
        { expectedType: Token.LBRACE, expectedLiteral: '{' },
        { expectedType: Token.RETURN, expectedLiteral: 'return' },
        { expectedType: Token.TRUE, expectedLiteral: 'true' },
        { expectedType: Token.SEMICOLON, expectedLiteral: ';' },
        { expectedType: Token.RBRACE, expectedLiteral: '}' },
        { expectedType: Token.ELSE, expectedLiteral: 'else' },
        { expectedType: Token.LBRACE, expectedLiteral: '{' },
        { expectedType: Token.RETURN, expectedLiteral: 'return' },
        { expectedType: Token.FALSE, expectedLiteral: 'false' },
        { expectedType: Token.SEMICOLON, expectedLiteral: ';' },
        { expectedType: Token.RBRACE, expectedLiteral: '}' },
        { expectedType: Token.INT, expectedLiteral: '10' },
        { expectedType: Token.EQ, expectedLiteral: '==' },
        { expectedType: Token.INT, expectedLiteral: '10' },
        { expectedType: Token.SEMICOLON, expectedLiteral: ';' },
        { expectedType: Token.INT, expectedLiteral: '10' },
        { expectedType: Token.NOT_EQ, expectedLiteral: '!=' },
        { expectedType: Token.INT, expectedLiteral: '9' },
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
  describe('isLetter', () => {
    const lexer = new Lexer('') // 入力は不要なので空文字でもOK

    it('引数がアルファベットの場合はtrueが得られる', () => {
      expect(lexer.isLetter('a')).toBe(true)
      expect(lexer.isLetter('Z')).toBe(true)
    })
    it('引数がアンダースコアの場合はtrueが得られる', () => {
      expect(lexer.isLetter('_')).toBe(true)
    })
    it('引数が数字の場合はfalseが得られる', () => {
      expect(lexer.isLetter('1')).toBe(false)
    })
    it('引数が記号の場合はfalseが得られる', () => {
      expect(lexer.isLetter('!')).toBe(false)
    })
    it('引数が空文字の場合はfalseが得られる', () => {
      expect(lexer.isLetter(' ')).toBe(false)
    })
  })
  describe('readIdentifier', () => {
    // NOTE: readIdentifierはアルファベットとアンダースコアのみを対象としてる
    const input = 'let five = 5;'
    const lexer = new Lexer(input)

    it('最初の識別子が取得できる', () => {
      const identifier = lexer.readIdentifier()
      expect(identifier).toBe('let')
    })

    it('1つ読み進めた場合は、その次の識別子が取得できる', () => {
      // 最初に "let" を読み込んだ後、現在のポインタは "let" の後にあります。
      // 次に、空白などの不要な文字をスキップし、次の識別子 "five" に到達
      lexer.skipWhitespace()
      const identifier = lexer.readIdentifier()
      expect(identifier).toBe('five')
    })
    it('さらに1つ読み進めた場合は識別子がないため空文字が得られる', () => {
      // この場合は
      // ・ループは一度も実行されない
      // ・その結果、this.input.substring(position, this.position) は同じ位置から切り出されるため、空文字 ("") が返されます。
      lexer.skipWhitespace()
      const identifier = lexer.readIdentifier()
      expect(identifier).toBe('')
    })
  })
  describe('peekChar', () => {
    describe('入力文字列が==の場合', () => {
      const lexer = new Lexer('==')

      it('「=」の文字列が得られる', () => {
        expect(lexer.peekChar()).toBe('=')
      })
    })
    describe('入力文字列が!=の場合', () => {
      const lexer = new Lexer('!=')

      it('「=」の文字列が得られる', () => {
        expect(lexer.peekChar()).toBe('=')
      })
    })
  })
  describe('extractChainedOperator', () => {
    describe('入力文字列が==の場合', () => {
      const lexer = new Lexer('==')

      it('「==」の文字列が得られる', () => {
        expect(lexer.extractChainedOperator()).toBe('==')
      })
    })
    describe('入力文字列が!=の場合', () => {
      const lexer = new Lexer('!=')

      it('「!=」の文字列が得られる', () => {
        expect(lexer.extractChainedOperator()).toBe('!=')
      })
    })
  })
})
