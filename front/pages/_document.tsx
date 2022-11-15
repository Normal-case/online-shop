import Document, { DocumentContext, DocumentInitialProps, NextScript, Html, Main, Head } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx)

    return initialProps
  }

  render() {
    return (
        <Html>
            <Head>
                <link href="https://hangeul.pstatic.net/hangeul_static/css/nanum-square-neo.css" rel="stylesheet" /> {/* Naver 나눔스퀘어네오 */}
                <link href="https://fonts.googleapis.com/css2?family=Comfortaa&display=swap" rel="stylesheet" /> {/* goole Comrotaa font */}
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
  }
}

export default MyDocument