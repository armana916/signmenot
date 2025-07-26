import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="Summarize any legal document, privacy policy, or terms of service using AI. SignMeNot makes confusing fine print simple." />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <meta name="theme-color" content="#000000" />
        <meta property="og:title" content="SignMeNot – Simplify the Legal Fine Print" />
        <meta property="og:description" content="Upload or paste legal terms. Get a plain-English summary with red flags. Free AI tool to protect your data." />
        <meta property="og:image" content="https://signmenot.com/preview.png" />
        <meta property="og:url" content="https://signmenot.com" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
