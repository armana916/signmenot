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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 text-white flex items-center justify-center px-4">
      <div className="bg-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl p-8 md:p-10 relative">
        <div className="text-center mb-8">
          <div className="text-5xl font-black text-blue-400 drop-shadow-md mb-2">🤖 SignMeNot</div>
          <p className="text-gray-300 text-sm md:text-base">AI that helps you understand terms and policies — instantly and clearly.</p>
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

        <footer className="mt-10 text-center text-xs text-gray-500 border-t border-slate-600 pt-4">
          © {new Date().getFullYear()} SignMeNot. <a href="https://signmenot.com" className="underline hover:text-white">Visit Main Site</a>
        </footer>
      </div>
    </div>
  );
}
