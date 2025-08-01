// pages/api/summarize.js

import { IncomingForm } from 'formidable'
import fs from 'fs'
import pdfParse from 'pdf-parse'
import cheerio from 'cheerio'

export const config = {
  api: { bodyParser: false },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' })
  }

  let inputText = ''
  const contentType = req.headers['content-type'] || ''

  try {
    if (contentType.startsWith('application/json')) {
      // JSON payload
      const chunks = []
      for await (const chunk of req) chunks.push(chunk)
      const { text } = JSON.parse(Buffer.concat(chunks).toString())
      inputText = text || ''
    } else if (contentType.startsWith('multipart/form-data')) {
      // Handle URL, text, PDF, or DOCX
      inputText = await new Promise((resolve, reject) => {
        const form = new IncomingForm()
        form.parse(req, async (err, fields, files) => {
          if (err) return reject(err)

          // Normalize fields to strings
          const urlField = fields.url
            ? Array.isArray(fields.url) ? fields.url[0] : fields.url
            : null
          const textField = fields.text
            ? Array.isArray(fields.text) ? fields.text[0] : fields.text
            : null

          // 1) URL scraping
          if (urlField) {
            try {
              const resp = await fetch(urlField)
              const html = await resp.text()
              const $ = cheerio.load(html)
              $('script, style, noscript, header, footer, nav').remove()
              const text = $('body').text().replace(/\s+/g, ' ').trim()
              return resolve(text)
            } catch (e) {
              return reject(e)
            }
          }

          // 2) Plain text field
          if (textField) {
            return resolve(textField)
          }

          // 3) File upload: PDF or DOCX
          if (files.file?.[0]) {
            const { filepath, originalFilename } = files.file[0]
            const buffer = fs.readFileSync(filepath)

            if (originalFilename?.toLowerCase().endsWith('.pdf')) {
              const parsed = await pdfParse(buffer)
              return resolve(parsed.text)
            }

            if (originalFilename?.toLowerCase().endsWith('.docx')) {
              const mammoth = await import('mammoth')
              const { value: docText } = await mammoth.extractRawText({ buffer })
              return resolve(docText)
            }
          }

          // Nothing matched
          resolve('')
        })
      })
    } else {
      return res.status(400).json({ error: 'Unsupported content type' })
    }

    if (!inputText.trim()) {
      return res.status(400).json({ error: 'No input provided' })
    }

    // Build the prompt
    const prompt = `
You are a privacy and legal expert. Summarize this legal document in plain English.
Highlight any red flags like data selling, tracking, auto-renewals, or waiving rights.

TEXT:
${inputText}
`

    // Call OpenAI
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    })

    const data = await openaiRes.json()
    if (data.error) {
      console.error('OpenAI API Error:', data.error)
      return res.status(500).json({ error: data.error.message })
    }

    return res.status(200).json({ summary: data.choices[0].message.content })
  } catch (err) {
    console.error('Error in /api/summarize:', err)
    return res.status(500).json({ error: 'Something went wrong.' })
  }
}
