import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, phone, vehicle, service } = await req.json();
    if (!firstName || !lastName || !email || !phone || !service) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const emailSubject = `New Contact Form Submission - ${firstName} ${lastName}`;
    const emailContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .header { background-color: #f97316; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #f97316; }
    .footer { background-color: #f3f4f6; padding: 15px; margin-top: 20px; border-radius: 5px; }
  </style>
</head>
<body>
  <div class="header">
    <h2>New Contact Form Submission</h2>
    <p>Diagnosis & Sensors Website</p>
  </div>
  <div class="content">
    <h3>Customer Details:</h3>
    <div class="field">
      <span class="label">Name:</span> ${firstName} ${lastName}
    </div>
    <div class="field">
      <span class="label">Email:</span> ${email}
    </div>
    <div class="field">
      <span class="label">Phone:</span> ${phone}
    </div>
    <div class="field">
      <span class="label">Vehicle:</span> ${vehicle || 'Not specified'}
    </div>
    <h3>Service Request:</h3>
    <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #f97316; margin: 10px 0;">
      ${service.replace(/\n/g, '<br>')}
    </div>
    <div class="footer">
      <p><strong>Action Required:</strong> Please respond to this customer inquiry within 24 hours.</p>
      <p><strong>Customer Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Customer Phone:</strong> <a href="tel:${phone}">${phone}</a></p>
    </div>
  </div>
</body>
</html>
    `;
    let emailSent = false;
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      try {
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
          }
        });
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: 'sales@diagnosisandsensors.co.zw',
          subject: emailSubject,
          html: emailContent,
          replyTo: email
        };
        await transporter.sendMail(mailOptions);
        emailSent = true;
      } catch (emailError) {
        // Email sending failed, but continue
      }
    }
    return NextResponse.json({ success: true, message: 'Contact form submitted successfully. We will get back to you within 24 hours.', emailSent });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process contact form submission' }, { status: 500 });
  }
} 