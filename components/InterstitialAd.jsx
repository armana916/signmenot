// components/InterstitialAd.jsx
import { useEffect, useState } from 'react'

export default function InterstitialAd({ onFinish }) {
  const [canClose, setCanClose] = useState(false)

  useEffect(() => {
    // Allow closing after 1 second (to get a viewable impression)
    const timer = setTimeout(() => setCanClose(true), 1000)

    // Try to load the AdSense slot
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {
      // If it errors (e.g. ad blocker), let them close immediately
      setCanClose(true)
    }

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
        {/* AdSense ad slot */}
        <ins
          className="adsbygoogle block"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-8348042440892802"
          data-ad-slot="6731374319"
          data-ad-format="auto"
        ></ins>

        {canClose ? (
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={onFinish}
          >
            Continue to Summary
          </button>
        ) : (
          <p className="mt-4 text-sm text-gray-600">Loading ad…</p>
        )}
      </div>
    </div>
  )
}
