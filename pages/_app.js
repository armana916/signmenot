<link rel="icon" type="image/png" href="/favicon.png" />
import { GoogleAnalytics } from "nextjs-google-analytics";
<GoogleAnalytics trackPageViews gaMeasurementId="G-2HJJZ64RYC" />

import Head from 'next/head';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>SignMeNot – Instantly Summarize Terms of Service</title>
        <meta name="description" content="Upload PDFs or paste terms to get instant AI summaries. Understand Terms of Service in plain English with SignMeNot." />
        <meta name="keywords" content="AI terms of service summarizer, summarize terms, privacy policy analyzer, SignMeNot" />
        <meta name="author" content="SignMeNot Team" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
