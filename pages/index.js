import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function Home() {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('signmenot-summary');
    if (stored) setSummary(stored);
  }, []);

  useEffect(() => {
    if (summary) localStorage.setItem('signmenot-summary', summary);
  }, [summary]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSummary('');

    if (!text.trim() && !file) {
      setError('Please paste text or upload a PDF file.');
      setLoading(false);
      return;
    }

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
        <meta name="description" content="Use AI to instantly summarize Privacy Policies and Terms of Service. Spot red flags, understand what you're agreeing to, and protect your data — free and fast." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="icon" href="/favicon.png" />
        <link rel="canonical" href="https://www.signmenot.com/" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 text-white flex items-center justify-center px-4 py-10">
        <div className="bg-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl p-8 md:p-10 relative">

          <header className="text-center mb-8">
            <h1 className="text-5xl font-black text-blue-400 drop-shadow-md mb-2">
              🤖 SignMeNot
            </h1>
            <h2 className="text-gray-300 text-sm md:text-base">
              AI that helps you understand terms and policies — instantly and clearly.
            </h2>
          </header>

          <form onSubmit={handleSubmit} className="space-y-5" aria-label="Summarization form">
            <label htmlFor="tos-textarea" className="sr-only">Paste your terms or privacy policy</label>
            <textarea
              id="tos-textarea"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste terms of service or privacy policy..."
              aria-label="Terms input"
              className="w-full h-40 rounded-xl p-4 bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />

            <div className="flex flex-col items-center space-y-3">
              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-flex items-center px-6 py-3 bg-black text-white rounded-lg shadow hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                📁 Upload PDF
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
              />
              <div className="text-sm text-gray-400">or paste text above</div>
            </div>

            <button
              type="submit"
              aria-disabled={loading || (!text && !file)}
              disabled={loading || (!text && !file)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 rounded-xl shadow-lg transition duration-200 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {loading ? 'Summarizing…' : 'Summarize'}
            </button>
          </form>

          {summary && (
            <section className="mt-8 bg-slate-700 rounded-xl p-6 text-sm text-white border border-slate-600" role="region" aria-live="polite">
              <h3 className="text-blue-400 text-lg font-semibold mb-2">AI Summary:</h3>
              <p className="whitespace-pre-wrap leading-relaxed text-gray-200">{summary}</p>
            </section>
          )}

          {error && (
            <p className="mt-4 text-red-400 font-semibold" role="alert">{error}</p>
          )}

          <section className="mt-10 text-left text-sm text-gray-300 space-y-4 border-t border-slate-600 pt-6">
            <h3 className="text-white font-semibold text-lg">🔎 How It Works</h3>
            <p>Paste any Terms of Service or Privacy Policy, or upload a PDF. Our AI instantly analyzes the document and provides a clear summary in plain English.</p>

            <h3 className="text-white font-semibold text-lg">🧠 FAQ</h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Do you store my data?</strong> – No. Everything runs in memory and is deleted immediately after processing.</li>
              <li><strong>What file types are supported?</strong> – Only PDFs for now. Text input also works.</li>
              <li><strong>Is it free?</strong> – Yes, 100% free.</li>
            </ul>
          </section>

          <footer className="mt-10 text-center text-xs text-gray-500 border-t border-slate-600 pt-4">
            © {new Date().getFullYear()} SignMeNot.
            <a href="/terms" className="ml-2 underline hover:text-white">Terms</a>
            <a href="/privacy" className="ml-2 underline hover:text-white">Privacy</a>
            <a href="mailto:support@signmenot.com" className="ml-2 underline hover:text-white">Contact</a>
          </footer>
        </div>
      </main>
    </>
  );
}
