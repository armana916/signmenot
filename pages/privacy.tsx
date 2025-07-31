import Head from 'next/head';

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy – SignMeNot</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div className="min-h-screen px-6 py-10 bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
          <p className="mb-4">Last updated: July 2025</p>
          <p className="mb-4">
            SignMeNot does not collect, store, or share your personal data. All uploaded or pasted content is processed temporarily for summarization and not retained.
          </p>
          <h2 className="text-xl font-semibold mt-6 mb-2">1. Data Processing</h2>
          <p className="mb-4">We use AI APIs to generate summaries. Your data is not stored after processing.</p>
          <h2 className="text-xl font-semibold mt-6 mb-2">2. Analytics</h2>
          <p className="mb-4">We may use privacy-friendly analytics like Vercel Analytics or Plausible.</p>
          <h2 className="text-xl font-semibold mt-6 mb-2">3. Contact</h2>
          <p className="mb-4">For questions, email us at contact@signmenot.com</p>
        </div>
      </div>
    </>
  );
}
