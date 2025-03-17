const express = require('express');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json()); // To parse JSON request bodies

app.post('/send-email-pdf', async (req, res) => {
    try {
        const { details, recipient } = req.body;

        // Generate PDF
        const doc = new PDFDocument();
        doc.text(details);
        doc.pipe(fs.createWriteStream('registration.pdf'));
        doc.end();

        // Email setup
        let transporter = nodemailer.createTransport({
            service: 'gmail', // or your email service
            auth: {
                user: 'aidoobenjamin162@gmail.com', // Replace with your email
                pass: '0277448689a', // Replace with your password or app password
            },
        });

        let mailOptions = {
            from: 'your_email@gmail.com',
            to: recipient,
            subject: 'Registration Details',
            text: 'Please find the registration details in the attached PDF.',
            attachments: [
                {
                    filename: 'registration.pdf',
                    path: './registration.pdf',
                },
            ],
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.json({ message: 'Email with PDF sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});