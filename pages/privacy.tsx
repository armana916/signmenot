// pages/privacy.js

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy – SignMeNot</title>
        <meta name="robots" content="noindex" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 text-white flex items-start justify-center px-4 py-10">
        <div className="bg-slate-800 rounded-3xl shadow-2xl w-full max-w-3xl p-8 md:p-10">

          {/* Header */}
          <header className="text-center mb-8">
            <div className="mx-auto mb-4 w-48 h-16 relative">
              <Image
                src="/logo.png"
                alt="SignMeNot Logo"
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
            <p className="text-gray-300 text-sm md:text-base">
              AI that helps you understand terms and policies — instantly and clearly.
            </p>
          </header>

          {/* Privacy Content */}
          <article className="prose prose-invert max-w-none">
            <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
            <p className="text-gray-400 mb-6">Last updated: July 2025</p>

            <p className="mb-4">
              SignMeNot does not collect, store, or share your personal data. All uploaded or pasted content is processed temporarily for summarization and not retained.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">1. Data Processing</h2>
            <p className="mb-4">
              We use AI APIs to generate summaries. Your data is not stored after processing.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">2. Analytics</h2>
            <p className="mb-4">
              We may use privacy-friendly analytics like Vercel Analytics or Plausible.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">3. Contact</h2>
            <p className="mb-4">
              For questions, email us at{' '}
              <a href="mailto:contact@signmenot.com" className="underline hover:text-white">
                contact@signmenot.com
              </a>
            </p>
          </article>

          {/* Back Link */}
          <div className="mt-8">
            <Link href="/" className="inline-block text-blue-400 hover:text-blue-300 underline">
              ← Back to Home
            </Link>
          </div>

          {/* Footer */}
          <footer className="mt-12 text-center text-xs text-gray-500 border-t border-slate-600 pt-6">
            © {new Date().getFullYear()} SignMeNot.
            <Link href="/terms" className="ml-4 underline hover:text-white">Terms</Link>
            <Link href="/privacy" className="ml-4 underline hover:text-white">Privacy</Link>
            <a href="mailto:support@signmenot.com" className="ml-4 underline hover:text-white">Contact</a>
          </footer>
        </div>
      </main>
    </>
  )
}
