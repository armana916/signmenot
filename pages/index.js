import Head from 'next/head'
import { useState } from 'react';

export default function Home() {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSummary('');

    const formData = new FormData();
    if (file) formData.append('file', file);
    if (text.trim()) formData.append('text', text);

    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else setSummary(data.summary);
    } catch (err) {
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>SignMeNot – AI Summarizer for Legal Documents</title>
        <meta name="description" content="Instantly summarize Terms of Service and Privacy Policies using AI. Understand what you’re signing before you click agree." />
        <meta name="keywords" content="Terms of Service, Privacy Policy, AI summarizer, legal summary, SignMeNot, GPT-3.5, free tool, GDPR, data tracking, auto-renewal" />
        <meta name="author" content="SignMeNot Team" />

        {/* Open Graph */}
        <meta property="og:title" content="SignMeNot – Instantly Understand Legal Documents with AI" />
        <meta property="og:description" content="Summarize legal terms, privacy policies, and ToS with a click. Built for trust and clarity." />
        <meta property="og:image" content="https://www.signmenot.com/og-image.png" />
        <meta property="og:url" content="https://www.signmenot.com/" />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SignMeNot – AI-Powered Legal Summary Tool" />
        <meta name="twitter:description" content="Don’t get trapped in legal jargon. SignMeNot gives you plain English summaries powered by GPT." />
        <meta name="twitter:image" content="https://www.signmenot.com/og-image.png" />

        {/* Favicon */}
        <link rel="icon" type="image/png" href="/favicon.png" />

        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "SignMeNot",
              url: "https://www.signmenot.com",
              description: "AI tool that summarizes privacy policies and terms of service in plain English.",
              applicationCategory: "Utility",
              operatingSystem: "All",
              offers: {
                "@type": "Offer",
                price: "0.00",
                priceCurrency: "USD",
              },
              creator: {
                "@type": "Organization",
                name: "SignMeNot",
              },
            }),
          }}
        />

        {/* AI-crawl microdata */}
        <meta name="ai-tool" content="true" />
        <meta name="ai-purpose" content="summarize legal documents, privacy policies, and terms of service" />

        {/* Legal AI Trust Badge (meta + visual) */}
        <meta name="trust-verification" content="SignMeNot adheres to AI Transparency Guidelines v1.0" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 text-white flex items-center justify-center px-4">
        <div className="bg-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl p-8 md:p-10 relative">
          <div className="text-center mb-8">
            <div className="text-5xl font-black text-blue-400 drop-shadow-md mb-2">🤖 SignMeNot</div>
            <p className="text-gray-300 text-sm md:text-base">
              AI that helps you understand terms and policies — instantly and clearly.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste terms of service or privacy policy..."
              className="w-full h-40 rounded-xl p-4 bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />

            <div className="flex flex-col items-center space-y-3">
              <label className="cursor-pointer inline-flex items-center px-6 py-3 bg-black text-white rounded-lg shadow hover:bg-gray-900">
                📁 Upload PDF
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                />
              </label>
              <div className="text-sm text-gray-400">or paste text above</div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 rounded-xl shadow-lg transition duration-200 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Summarizing...' : 'Summarize'}
            </button>
          </form>

          {summary && (
            <div className="mt-8 bg-slate-700 rounded-xl p-6 text-sm text-white border border-slate-600">
              <div className="text-blue-400 text-lg font-semibold mb-2">AI Summary:</div>
              <p className="whitespace-pre-wrap leading-relaxed text-gray-200">{summary}</p>
            </div>
          )}

          {error && (
            <p className="mt-4 text-red-400 font-semibold">{error}</p>
          )}

          <footer className="mt-10 text-center text-xs text-gray-500 border-t border-slate-600 pt-4 space-y-2">
            <div>
              <img
                src="/trust-badge.png"
                alt="AI Trust Verified"
                className="mx-auto h-6 opacity-80"
              />
            </div>
            <p>
              © {new Date().getFullYear()} SignMeNot.{" "}
              <a href="https://signmenot.com" className="underline hover:text-white">
                Visit Main Site
              </a>
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}
