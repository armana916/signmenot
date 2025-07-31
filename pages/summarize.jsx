import { useState } from 'react'
import InterstitialAd from '@/components/InterstitialAd'

export default function SummarizePage() {
  const [showAd, setShowAd] = useState(false)
  const [summary, setSummary] = useState('')

  const handleSummarizeClick = () => setShowAd(true)

  const onAdFinish = async () => {
    setShowAd(false)
    // …your existing summarize API call…
    const res = await fetch('/api/summarize', { method: 'POST', body: /*…*/ })
    const { summary } = await res.json()
    setSummary(summary)
  }

  return (
    <div>
      <button
        onClick={handleSummarizeClick}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Summarize
      </button>

      {showAd && <InterstitialAd onFinish={onAdFinish} />}

      {summary && (
        <section className="mt-6 p-4 bg-gray-100 rounded">
          <h2 className="font-semibold text-lg">Summary</h2>
          <p className="mt-2">{summary}</p>
        </section>
      )}
    </div>
  )
}
