// api/deploy.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
  
  if (!VERCEL_TOKEN) {
    return res.status(500).json({ error: 'Vercel API Token belum diatur di Environment Variables.' });
  }

  const { projectName, htmlContent } = req.body;

  // Cek apakah nama project diisi
  if (!projectName || projectName.trim() === '') {
    return res.status(400).json({ error: 'Nama project wajib diisi!' });
  }

  if (!htmlContent) {
    return res.status(400).json({ error: 'Konten HTML kosong!' });
  }

  // Sanitasi nama project agar sesuai dengan standar URL Vercel (huruf kecil, tanpa spasi)
  const sanitizedProjectName = projectName
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-') // Ganti karakter selain huruf/angka dengan hyphen
    .replace(/-+/g, '-');        // Hilangkan hyphen ganda

  try {
    const response = await fetch('https://api.vercel.com/v13/deployments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: sanitizedProjectName,
        files: [
          {
            file: 'index.html',
            data: htmlContent
          }
        ],
        target: 'production'
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Gagal deploy ke Vercel');
    }

    return res.status(200).json({
      success: true,
      url: `https://${data.url}`,
      deploymentId: data.id
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
