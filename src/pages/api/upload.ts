// pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import formidable from 'formidable';
import fs from 'fs';
import FormData from 'form-data';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const form = formidable({});
    const [fields, files] = await form.parse(req);
    const file = files.file?.[0];

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileData = fs.readFileSync(file.filepath);

    const formData = new FormData();
    formData.append('file', fileData, {
      filename: file.originalFilename || 'file',
      contentType: file.mimetype || 'application/octet-stream'
    });
    formData.append('doctype', 'Epawn Subscriber');
    formData.append('docname', 'payment_receipt');
    formData.append('is_private', '0');

    const response = await axios.post(
      'https://staging.chevroncemcs.com/api/method/upload_file',
      formData,
      {
        auth: {
          username: 'd5ea6c1a0aaeb82',
          password: '0476216f7e4e8ca'
        },
        headers: {
          ...formData.getHeaders()
        },
      }
    );

    res.status(200).json({ file_url: response.data.message.file_url });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ 
      error: 'Failed to upload file',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}