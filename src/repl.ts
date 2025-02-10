import { Token } from './token'
import { Lexer } from './lexer'
export class Repl {
  private static readonly PROMPT = '>> '

  public async start(): Promise<void> {
    const reader = Bun.stdin.stream().getReader()
    const decoder = new TextDecoder()

    process.stdout.write(Repl.PROMPT)

    while (true) {
      const { done, value } = await reader.read()
      if (done) break // EOFの場合終了する

      const input = decoder.decode(value).trim()
      if (!input) {
        process.stdout.write(Repl.PROMPT)
        continue
      }
      const lexer = new Lexer(input)
      let token

      while ((token = lexer.nextToken()).type !== Token.EOF) {
        console.log(token)
      }
      process.stdout.write(Repl.PROMPT)
    }
  }
}
