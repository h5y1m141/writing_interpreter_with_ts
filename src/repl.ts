import { Token } from './token'
import { Lexer } from './lexer'
export class Repl {
  private static readonly PROMPT = '>> '

  public async start(): Promise<void> {
    // MEMO: Bun.stdin.stream().getReaderについて
    // const reader = Bun.stdin.stream().getReader()
    // const { done, value } = await reader.read()
    // という処理の場合
    // ・value は Uint8Array で、標準入力からのデータが入っている。
    // 例えば入力がhelloの場合取得されるデータは以下のようになる
    // {
    //   done: false,
    //   value: Uint8Array(5) [104, 101, 108, 108, 111] // "hello" の UTF-8 バイナリ表現
    // }
    const reader = Bun.stdin.stream().getReader()
    const decoder = new TextDecoder()

    process.stdout.write(Repl.PROMPT)

    while (true) {
      const { done, value } = await reader.read()
      if (done) break // EOFの場合終了する

      // Uint8Array で取得した バイナリデータを文字列に変換
      const input = decoder.decode(value).trim()
      if (!input) {
        process.stdout.write(Repl.PROMPT)
        continue
      }
      const lexer = new Lexer(input)
      let token

      while ((token = lexer.nextToken()).type !== Token.EOF) {
        // Lexer の処理ではトークンの情報を1行ずつ表示したいため、console.log() を利用
        // こうすることで自動で改行されて見やすくなる。
        // ※ process.stdout.writeだとプロンプトとトークンがつながってしまい視認性悪い
        console.log(token)
      }
      process.stdout.write(Repl.PROMPT)
    }
  }
}
