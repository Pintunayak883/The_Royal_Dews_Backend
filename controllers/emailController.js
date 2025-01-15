import nodemailer from "nodemailer";

export default async function EmailHandler(req, res) {
  if (req.method === "POST") {
    const { name, email, subject, text } = req.body;

    // Check if essential fields are missing
    if (!name || !email || !subject || !text) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    try {
      // Nodemailer mein email bhejne ka setup
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
          user: process.env.SMTP_MAIL,
          pass: process.env.SMTP_PASSWORD,
        },
        logger: true, // Enable logs
        debug: true, // Enable debug output
      });

      const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: email, // Receiver email
        subject: subject,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${text}`,
      };

      // If no file is included in the request
      if (!req.body.file) {
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: "Email sent successfully!" });
      }

      // If file is included
      const { file, fileName } = req.body;
      if (typeof file === "string") {
        const fileBuffer = Buffer.from(file, "base64");
        mailOptions.attachments = [
          {
            filename: fileName,
            content: fileBuffer,
            encoding: "base64",
          },
        ];
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: "Email sent with attachment!" });
      } else {
        return res.status(400).json({ message: "Invalid file format." });
      }
    } catch (error) {
      console.error("Error:", error.message);
      res
        .status(500)
        .json({ message: "Error sending email", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
