// pages/summarize.jsx

import { useState } from 'react'

export default function SummarizePage() {
  const [text, setText] = useState('')
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSummarizeClick = async () => {
    if (!text.trim()) {
      setError('Please paste your text first.')
      return
    }

    setError('')
    setLoading(true)
    setSummary('')

    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      if (!res.ok) throw new Error(`Status ${res.status}`)
      const data = await res.json()
      setSummary(data.summary)
    } catch (e) {
      console.error(e)
      setError('Failed to generate summary. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Summarize Your Document</h1>

      <textarea
        className="w-full h-48 p-2 border rounded"
        placeholder="Paste your Terms of Service, Privacy Policy, or other text here…"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {error && <p className="text-red-600 mt-2">{error}</p>}

      <button
        onClick={handleSummarizeClick}
        className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Working…' : 'Summarize'}
      </button>

      {summary && (
        <section className="mt-6 p-4 bg-gray-100 rounded">
          <h2 className="font-semibold text-lg mb-2">AI-Generated Summary</h2>
          <p className="whitespace-pre-wrap">{summary}</p>
        </section>
      )}
    </div>
)
}
