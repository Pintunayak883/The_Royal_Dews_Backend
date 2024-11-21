import nodemailer from "nodemailer";

export default async function EmailHandler(req, res) {
  if (req.method === "POST") {
    const { name, email, file, fileName, address, position } = req.body;

    if (!file) {
      return res.status(400).json({ message: "File data missing" });
    }

    try {
      // Validate `file` input
      if (typeof file !== "string") {
        throw new Error("Invalid file format. Expected base64 string.");
      }

      const fileBuffer = Buffer.from(file, "base64");
      console.log("File Buffer Length: ", fileBuffer.length); // Check if the fileBuffer has content

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
        to: email, // Email correctly set ho raha hai?
        subject: "New Career Form Submission",
        text: `Name: ${name}\nEmail: ${email}\nPosition: ${position}\nAddress: ${address}\nUploaded File: ${fileName}`,
        attachments: [
          {
            filename: fileName,
            content: Buffer.from(file, "base64"), // File ko buffer mein convert karen
            encoding: "base64",
          },
        ],
      };

      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: "Email sent successfully!" });
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
