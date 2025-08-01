// pages/index.js

import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import InterstitialAd from '../components/InterstitialAd'
import { Analytics } from "@vercel/analytics/next"

export default function Home() {
  // Inputs
  const [input, setInput] = useState('')
  const [file, setFile] = useState(null)

  // UX & result
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Interstitial
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

  // Show ad, then submit
  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSummary('')

    if (!file && !input.trim()) {
      setError('Please paste text/URL or upload a file.')
      return
    }

    const formData = new FormData()
    if (file) {
      formData.append('file', file)
    } else {
      const v = input.trim()
      if (v.startsWith('http')) formData.append('url', v)
      else formData.append('text', v)
    }

    setPendingFormData(formData)
    setShowAd(true)
  }

  const onAdFinish = async () => {
    setShowAd(false)
    setLoading(true)
    setError('')

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
        <title>SignMeNot – AI Summarizer</title>
        <meta name="description" content="Instant AI summaries of Terms, Privacy Policies, PDFs, DOCX, or any URL."/>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 text-white flex items-center justify-center px-4 py-10">
        <div className="bg-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl p-8 md:p-10">

          {/* Header */}
          <header className="text-center mb-8">
            <Image src="/logo.png" alt="SignMeNot Logo" width={200} height={60} objectFit="contain" className="mx-auto mb-2"/>
            <p className="text-gray-300 text-sm">AI that helps you understand terms and policies — instantly and clearly.</p>
          </header>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <textarea
              name="input"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Paste text or enter a URL..."
              className="w-full h-40 rounded-xl p-4 bg-slate-700 text-white border border-slate-600 focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex flex-col items-center">
              <label htmlFor="file-upload" className="cursor-pointer inline-flex items-center px-6 py-3 bg-black text-white rounded-lg shadow hover:bg-gray-900">
                📁 Upload PDF or DOCX
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".pdf,.docx"
                onChange={e => setFile(e.target.files[0])}
                className="hidden"
              />
            </div>

            {error && <p className="text-red-400 font-semibold">{error}</p>}

            <button
              type="submit"
              disabled={loading || (!input.trim() && !file)}
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl text-lg font-semibold disabled:opacity-50 focus:ring-2 focus:ring-blue-500"
            >
              {loading ? 'Summarizing…' : 'Summarize'}
            </button>
          </form>

          {/* Ad Overlay */}
          {showAd && <InterstitialAd onFinish={onAdFinish}/>}

          {/* Summary */}
          {summary && (
            <section className="mt-8 bg-slate-700 rounded-xl p-6 text-sm text-gray-200">
              <h3 className="text-blue-400 font-semibold mb-2">AI Summary:</h3>
              <p className="whitespace-pre-wrap leading-relaxed">{summary}</p>
            </section>
          )}

          {/* FAQ & Footer */}
          <section className="mt-10 text-sm text-gray-300 space-y-4 border-t border-slate-600 pt-6">
            <h3 className="text-white font-semibold">🔎 How It Works</h3>
            <p>Paste text or a URL, or upload a PDF/DOCX. Our AI instantly summarizes legal documents in plain English.</p>
            <h3 className="text-white font-semibold">🧠 FAQ</h3>
            <ul className="list-disc list-inside">
              <li><strong>No data stored:</strong> Everything runs in memory and is deleted after summarization.</li>
              <li><strong>Supported inputs:</strong> Text, URL, PDF, DOCX.</li>
              <li><strong>100% free:</strong> Use as much as you like.</li>
            </ul>
          </section>

          <footer className="mt-10 text-center text-xs text-gray-500 border-t border-slate-600 pt-4">
            © {new Date().getFullYear()} SignMeNot. 
            <a href="/terms" className="ml-2 underline">Terms</a>
            <a href="/privacy" className="ml-2 underline">Privacy</a>
            <a href="mailto:support@signmenot.com" className="ml-2 underline">Contact</a>
          </footer>
        </div>
      </main>
    </>
  )
}
