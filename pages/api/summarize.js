import { IncomingForm } from 'formidable';
import fs from 'fs';
import pdfParse from 'pdf-parse';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const form = new IncomingForm();

  form.parse(req, async (err, fields, files) => {
    try {
      let inputText = fields.text?.[0] || '';

      if (files.file?.[0]) {
        const pdfBuffer = fs.readFileSync(files.file[0].filepath);
        const parsed = await pdfParse(pdfBuffer);
        inputText = parsed.text;
      }

      if (!inputText || inputText.trim().length === 0) {
        return res.status(400).json({ error: 'No input provided' });
      }

      const prompt = `
You are a privacy and legal expert. Summarize this legal document in plain English.
Highlight any red flags like data selling, tracking, auto-renewals, or waiving rights.

TEXT:
${inputText}
`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
      });

      const data = await response.json();

      if (data.error) {
        console.error('OpenAI API Error:', data.error);
        return res.status(500).json({ error: data.error.message });
      }

      return res.status(200).json({ summary: data.choices[0].message.content });
    } catch (error) {
      console.error('🔥 Caught API Error:', error);
      return res.status(500).json({ error: 'Something went wrong.' });
    }
  });
}
