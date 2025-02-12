import { describe, it, expect } from 'vitest'
import { Lexer } from 'src/lexer'
import { TokenType } from 'src/token'

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
        { expectedType: TokenType.LET, expectedLiteral: 'let' },
        { expectedType: TokenType.IDENT, expectedLiteral: 'five' },
        { expectedType: TokenType.ASSIGN, expectedLiteral: '=' },
        { expectedType: TokenType.INT, expectedLiteral: '5' },
        { expectedType: TokenType.SEMICOLON, expectedLiteral: ';' },
        { expectedType: TokenType.LET, expectedLiteral: 'let' },
        { expectedType: TokenType.IDENT, expectedLiteral: 'ten' },
        { expectedType: TokenType.ASSIGN, expectedLiteral: '=' },
        { expectedType: TokenType.INT, expectedLiteral: '10' },
        { expectedType: TokenType.SEMICOLON, expectedLiteral: ';' },
        { expectedType: TokenType.LET, expectedLiteral: 'let' },
        { expectedType: TokenType.IDENT, expectedLiteral: 'add' },
        { expectedType: TokenType.ASSIGN, expectedLiteral: '=' },
        { expectedType: TokenType.FUNCTION, expectedLiteral: 'fn' },
        { expectedType: TokenType.LPAREN, expectedLiteral: '(' },
        { expectedType: TokenType.IDENT, expectedLiteral: 'x' },
        { expectedType: TokenType.COMMA, expectedLiteral: ',' },
        { expectedType: TokenType.IDENT, expectedLiteral: 'y' },
        { expectedType: TokenType.RPAREN, expectedLiteral: ')' },
        { expectedType: TokenType.LBRACE, expectedLiteral: '{' },
        { expectedType: TokenType.IDENT, expectedLiteral: 'x' },
        { expectedType: TokenType.PLUS, expectedLiteral: '+' },
        { expectedType: TokenType.IDENT, expectedLiteral: 'y' },
        { expectedType: TokenType.SEMICOLON, expectedLiteral: ';' },
        { expectedType: TokenType.RBRACE, expectedLiteral: '}' },
        { expectedType: TokenType.SEMICOLON, expectedLiteral: ';' },
        { expectedType: TokenType.LET, expectedLiteral: 'let' },
        { expectedType: TokenType.IDENT, expectedLiteral: 'result' },
        { expectedType: TokenType.ASSIGN, expectedLiteral: '=' },
        { expectedType: TokenType.IDENT, expectedLiteral: 'add' },
        { expectedType: TokenType.LPAREN, expectedLiteral: '(' },
        { expectedType: TokenType.IDENT, expectedLiteral: 'five' },
        { expectedType: TokenType.COMMA, expectedLiteral: ',' },
        { expectedType: TokenType.IDENT, expectedLiteral: 'ten' },
        { expectedType: TokenType.RPAREN, expectedLiteral: ')' },
        { expectedType: TokenType.SEMICOLON, expectedLiteral: ';' },
        { expectedType: TokenType.BANG, expectedLiteral: '!' },
        { expectedType: TokenType.MINUS, expectedLiteral: '-' },
        { expectedType: TokenType.SLASH, expectedLiteral: '/' },
        { expectedType: TokenType.ASTERISK, expectedLiteral: '*' },
        { expectedType: TokenType.INT, expectedLiteral: '5' },
        { expectedType: TokenType.SEMICOLON, expectedLiteral: ';' },
        { expectedType: TokenType.INT, expectedLiteral: '5' },
        { expectedType: TokenType.LT, expectedLiteral: '<' },
        { expectedType: TokenType.INT, expectedLiteral: '10' },
        { expectedType: TokenType.GT, expectedLiteral: '>' },
        { expectedType: TokenType.INT, expectedLiteral: '5' },
        { expectedType: TokenType.SEMICOLON, expectedLiteral: ';' },
        { expectedType: TokenType.IF, expectedLiteral: 'if' },
        { expectedType: TokenType.LPAREN, expectedLiteral: '(' },
        { expectedType: TokenType.INT, expectedLiteral: '5' },
        { expectedType: TokenType.LT, expectedLiteral: '<' },
        { expectedType: TokenType.INT, expectedLiteral: '10' },
        { expectedType: TokenType.RPAREN, expectedLiteral: ')' },
        { expectedType: TokenType.LBRACE, expectedLiteral: '{' },
        { expectedType: TokenType.RETURN, expectedLiteral: 'return' },
        { expectedType: TokenType.TRUE, expectedLiteral: 'true' },
        { expectedType: TokenType.SEMICOLON, expectedLiteral: ';' },
        { expectedType: TokenType.RBRACE, expectedLiteral: '}' },
        { expectedType: TokenType.ELSE, expectedLiteral: 'else' },
        { expectedType: TokenType.LBRACE, expectedLiteral: '{' },
        { expectedType: TokenType.RETURN, expectedLiteral: 'return' },
        { expectedType: TokenType.FALSE, expectedLiteral: 'false' },
        { expectedType: TokenType.SEMICOLON, expectedLiteral: ';' },
        { expectedType: TokenType.RBRACE, expectedLiteral: '}' },
        { expectedType: TokenType.INT, expectedLiteral: '10' },
        { expectedType: TokenType.EQ, expectedLiteral: '==' },
        { expectedType: TokenType.INT, expectedLiteral: '10' },
        { expectedType: TokenType.SEMICOLON, expectedLiteral: ';' },
        { expectedType: TokenType.INT, expectedLiteral: '10' },
        { expectedType: TokenType.NOT_EQ, expectedLiteral: '!=' },
        { expectedType: TokenType.INT, expectedLiteral: '9' },
        { expectedType: TokenType.SEMICOLON, expectedLiteral: ';' },
        { expectedType: TokenType.EOF, expectedLiteral: '' },
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
