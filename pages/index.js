// pages/index.js

import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import InterstitialAd from '../components/InterstitialAd'

export default function Home() {
  // Input states
  const [text, setText] = useState('')
  const [file, setFile] = useState(null)
  const [docxFile, setDocxFile] = useState(null)
  const [url, setUrl] = useState('')
  const [lengthOption, setLengthOption] = useState('medium')
  const [focusOption, setFocusOption] = useState('general')

  // Result states
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Interstitial ad states
  const [showAd, setShowAd] = useState(false)
  const [pendingFormData, setPendingFormData] = useState(null)

  // Persist last summary
  useEffect(() => {
    const stored = localStorage.getItem('signmenot-summary')
    if (stored) setSummary(stored)
  }, [])

  useEffect(() => {
    if (summary) localStorage.setItem('signmenot-summary', summary)
  }, [summary])

  // Handle form submit → show ad
  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSummary('')

    if (!text.trim() && !file && !docxFile && !url.trim()) {
      setError('Please paste text, upload a file, or enter a URL.')
      return
    }

    const formData = new FormData()
    if (file) formData.append('file', file)
    if (docxFile) formData.append('docx', docxFile)
    if (text.trim()) formData.append('text', text.trim())
    if (url.trim()) formData.append('url', url.trim())
    formData.append('lengthOption', lengthOption)
    formData.append('focusOption', focusOption)

    setPendingFormData(formData)
    setShowAd(true)
  }

  // After ad, call the API
  const onAdFinish = async () => {
    setShowAd(false)
    setLoading(true)
    setError('')
    setSummary('')

    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        body: pendingFormData,
      })
      const data = await res.json()
      if (data.error) setError(data.error)
      else setSummary(data.summary)
    } catch {
      setError('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>SignMeNot – AI Summarizer for Legal Documents</title>
        <meta
          name="description"
          content="Use AI to instantly summarize Privacy Policies and Terms of Service. Spot red flags, understand what you're agreeing to, and protect your data — free and fast."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 text-white flex items-center justify-center px-4 py-10">
        <div className="bg-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl p-8 md:p-10 relative">

          {/* Logo & Tagline */}
          <header className="text-center mb-8">
            <div className="flex justify-center mb-2">
              <Image
                src="/logo.png"
                alt="SignMeNot Logo"
                width={200}
                height={60}
                objectFit="contain"
              />
            </div>
            <h2 className="text-gray-300 text-sm md:text-base">
              AI that helps you understand terms and policies — instantly and clearly.
            </h2>
          </header>

          {/* Summarization Form */}
          <form onSubmit={handleSubmit} className="space-y-5" aria-label="Summarization form">
            <textarea
              name="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste terms of service or privacy policy..."
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

              {/* DOCX upload */}
              <div className="w-full">
                <label className="block mb-1 text-gray-300">
                  Or upload a Word document (.docx):
                </label>
                <input
                  type="file"
                  accept=".docx"
                  onChange={(e) => setDocxFile(e.target.files[0])}
                  className="block w-full text-sm text-gray-200 bg-slate-700 rounded border border-slate-600 p-2"
                />
              </div>

              {/* URL input */}
              <div className="w-full">
                <label htmlFor="url-input" className="block mb-1 text-gray-300">
                  Or enter a webpage URL:
                </label>
                <input
                  id="url-input"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/terms"
                  className="w-full p-2 rounded bg-slate-700 border border-slate-600 text-white"
                />
              </div>

              {/* Summary controls */}
              <div className="flex flex-wrap gap-4 items-center w-full">
                <div>
                  <label className="block mb-1 text-gray-300">Length:</label>
                  <select
                    value={lengthOption}
                    onChange={(e) => setLengthOption(e.target.value)}
                    className="p-2 rounded bg-slate-700 border border-slate-600 text-white"
                  >
                    <option value="short">Short (1–2 sentences)</option>
                    <option value="medium">Medium (1 paragraph)</option>
                    <option value="long">Long (2+ paragraphs)</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-gray-300">Focus:</label>
                  <select
                    value={focusOption}
                    onChange={(e) => setFocusOption(e.target.value)}
                    className="p-2 rounded bg-slate-700 border border-slate-600 text-white"
                  >
                    <option value="general">General summary</option>
                    <option value="data">Highlight data-collection</option>
                    <option value="autoRenewal">Highlight auto-renewal</option>
                    <option value="liability">Highlight liability clauses</option>
                  </select>
                </div>
              </div>
            </div>

            {error && (
              <p className="text-red-400 font-semibold" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={
                loading ||
                (!text.trim() && !file && !docxFile && !url.trim())
              }
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 rounded-xl shadow-lg transition duration-200 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {loading ? 'Summarizing…' : 'Summarize'}
            </button>
          </form>

          {/* Interstitial Ad */}
          {showAd && <InterstitialAd onFinish={onAdFinish} />}

          {/* AI Summary Output */}
          {summary && (
            <section
              className="mt-8 bg-slate-700 rounded-xl p-6 text-sm text-white border border-slate-600"
              role="region"
              aria-live="polite"
            >
              <h3 className="text-blue-400 text-lg font-semibold mb-2">
                AI Summary:
              </h3>
              <p className="whitespace-pre-wrap leading-relaxed text-gray-200">
                {summary}
              </p>
            </section>
          )}

          {/* FAQ & Footer */}
          <section className="mt-10 text-left text-sm text-gray-300 space-y-4 border-t border-slate-600 pt-6">
            <h3 className="text-white font-semibold text-lg">🔎 How It Works</h3>
            <p>
              Paste any Terms of Service or Privacy Policy, upload a PDF or DOCX, or enter a URL. Our AI instantly analyzes the document and provides a clear summary in plain English.
            </p>
            <h3 className="text-white font-semibold text-lg">🧠 FAQ</h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Do you store my data?</strong> – No. Everything runs in memory and is deleted immediately after processing.</li>
              <li><strong>What file types are supported?</strong> – PDF, DOCX, text input, and live webpages.</li>
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
  )
}
