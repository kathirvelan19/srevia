export default async function handler(req, res) {
  // Set CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { name, email, phone, subject, message } = req.body || {};

    const apiKey = (process.env.VITE_RESEND_API_KEY || process.env.MAIL_API_KEY || process.env.RESEND_API_KEY || '').trim();
    const mailFrom = process.env.MAIL_FROM || 'SREVIA HERBS <onboarding@resend.dev>';

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: mailFrom,
        to: ['kathirvelankvr@gmail.com'],
        subject: `New Customer Inquiry from ${name || 'Customer'}: ${subject || 'Product Inquiry'}`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #242824; max-width: 600px; margin: 0 auto; border: 1px solid #A8B9A3; border-radius: 12px; padding: 24px; background-color: #FCFBF7;">
            <div style="background-color: #1F3D2E; color: #FCFBF7; padding: 16px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
              <h2 style="margin: 0; color: #B89B5E;">SREVIA HERBS — New Contact Message</h2>
            </div>
            <p><strong>Customer Name:</strong> ${name || 'N/A'}</p>
            <p><strong>Email:</strong> ${email || 'N/A'}</p>
            <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
            <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
            <hr style="border: 0; border-top: 1px solid #A8B9A3; margin: 16px 0;" />
            <p style="font-weight: bold; color: #1F3D2E;">Message Content:</p>
            <div style="background-color: #F4F0E7; padding: 16px; border-radius: 8px; font-size: 14px; line-height: 1.6;">
              ${(message || '').replace(/\n/g, '<br/>')}
            </div>
          </div>
        `
      })
    });

    const data = await response.json();

    if (response.ok) {
      return res.status(200).json({ success: true, id: data.id });
    } else {
      return res.status(500).json({ success: false, error: data.message || 'Resend API error' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
