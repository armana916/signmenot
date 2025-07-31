// pages/index.jsx  (or pages/summarize.jsx)

import { useState } from 'react'
import InterstitialAd from '../components/InterstitialAd'  // ← added import

export default function SummarizePage() {
  const [showAd, setShowAd] = useState(false)
  const [pendingFormData, setPendingFormData] = useState(null)
  const [summary, setSummary] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Intercept form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    const form = e.currentTarget
    const formData = new FormData(form)

    // Simple validation: need text or file
    if (!formData.get('text')?.trim() && !formData.get('file')?.name) {
      setError('Please paste text or upload a PDF first.')
      return
    }

    setPendingFormData(formData)
    setShowAd(true)
  }

  // Called when "Continue to Summary" is clicked in the ad
  const onAdFinish = async () => {
    setShowAd(false)
    setLoading(true)
    setSummary('')
    setError('')

    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        body: pendingFormData, // multipart/form-data automatically
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to get summary')
      }
      setSummary(data.summary)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Summarize Your Document</h1>

      <form onSubmit={handleSubmit}>
        <textarea
          name="text"
          className="w-full h-40 p-2 border rounded"
          placeholder="Paste your Terms of Service or Privacy Policy here…"
        />

        <div className="my-4">
          <label className="block mb-1">Or upload a PDF:</label>
          <input
            type="file"
            name="file"
            accept="application/pdf"
            className="block"
          />
        </div>

        {error && <p className="text-red-600 mb-2">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 rounded-xl shadow-lg transition duration-200 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {loading ? 'Working…' : 'Summarize'}
        </button>
      </form>

      {/* Interstitial Ad Overlay */}
      {showAd && <InterstitialAd onFinish={onAdFinish} />}

      {/* Loading state (optional, since ad is up) */}
      {loading && !showAd && <p className="mt-4">Generating summary…</p>}

      {/* Display result */}
      {summary && (
        <section className="mt-6 p-4 bg-gray-100 rounded">
          <h2 className="text-xl font-semibold mb-2">AI-Generated Summary</h2>
          <p className="whitespace-pre-wrap">{summary}</p>
        </section>
      )}
    </div>
)
}
