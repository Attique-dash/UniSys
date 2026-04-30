// app/api/sendEmail/route.ts
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, name, role, subject, password } = await request.json();
    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.verify();

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to UniSys!</h1>
          </div>
          <div class="content">
            <p>Hello <strong>${name}</strong>,</p>
            <p>You have been successfully registered in <strong>UniSys</strong> with the following credentials:</p>
            
            <ul>
              <li><strong>Role:</strong> ${role}</li>
              <li><strong>Subject:</strong> ${subject}</li>
              <li><strong>Email:</strong> ${email}</li>
              ${password ? `<li><strong>Temporary Password:</strong> ${password}</li>` : ''}
            </ul>
            
            <p>Please login using your email and the temporary password above. You will be prompted to change your password on first login.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" class="button">Login to UniSys</a>
            </div>
            
            <p>Best regards,<br><strong>UniSys Team</strong></p>
          </div>
          <div class="footer">
            <p>© 2025 UniSys. All rights reserved.</p>
            <p>This is an automated message, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"UniSys Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Welcome to UniSys, ${name}! 🎓`,
      html: htmlContent,
      text: `Hello ${name},\n\nYou have been registered in UniSys with role: ${role} for subject: ${subject}.\n\nEmail: ${email}\n${password ? `Password: ${password}\n\n` : ''}Login at: ${process.env.NEXT_PUBLIC_APP_URL}/login\n\nThank you!\nUniSys Team`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { message: "Failed to send email", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}