const nodemailer = require('nodemailer');

const sendBookingEmail = async (bookingDetails) => {
  const { name, email, dateId, showTime, seats, totalPrice } = bookingDetails;

  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail', // You can change this to your preferred email service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Movie Mukkalu" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Booking Confirmed - Movie Mukkalu',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
        <h2 style="color: #e11d48; text-align: center;">Booking Confirmed!</h2>
        <p>Dear <strong>${name}</strong>,</p>
        <p>Thank you for booking with Movie Mukkalu. Your tickets have been confirmed.</p>
        <hr />
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px;">
          <p><strong>Show Date:</strong> March ${dateId}, 2026</p>
          <p><strong>Show Time:</strong> ${showTime}</p>
          <p><strong>Seats Reserved:</strong> ${seats.join(', ')}</p>
          <p><strong>Total Paid:</strong> ₹${totalPrice}</p>
        </div>
        <hr />
        <p style="text-align: center; color: #666; font-size: 12px;">
          Please show this email at the theater entrance. Enjoy the movie!
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Booking confirmation email sent to ${email}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = { sendBookingEmail };
