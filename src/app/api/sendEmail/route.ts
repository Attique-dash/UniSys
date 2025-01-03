import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, name, role, subject } = await request.json();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.verify();
    console.log("Transporter verified");

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: `Welcome to UniSys, ${name}!`,
      text: `Hello ${name},\n\nYou have been added to UniSys with the role of ${role} for the subject ${subject}.\n\nThank you!`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);

    return NextResponse.json({ message: "Email sent successfully" });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error sending email:", error.message);
      return NextResponse.json(
        { message: "Failed to send email", error: error.message },
        { status: 500 }
      );
    } else {
      console.error("Unknown error occurred:", error);
      return NextResponse.json(
        { message: "Failed to send email", error: "Unknown error" },
        { status: 500 }
      );
    }
  }
}
