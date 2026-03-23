const nodemailer = require('nodemailer');

const sendBookingEmail = async (bookingDetails) => {
  const { name, email, dateId, showTime, displayTime, seats, totalPrice, movieName, poster } = bookingDetails;

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('❌ EMAIL_USER or EMAIL_PASS environment variables are missing!');
      return;
  }

  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });


  const mailOptions = {
    from: `"Movie Mokkalu" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Confirmed: ${movieName} tickets for May ${dateId}`,
    html: `
      <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; background-color: #0d0d0d; color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #333;">
        <div style="background-color: #e11d48; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">Booking Confirmed</h1>
          <p style="margin: 5px 0 0; opacity: 0.8;">Get ready for the show!</p>
        </div>
        
        <div style="padding: 30px;">
          <div style="display: flex; gap: 20px; margin-bottom: 30px;">
            <div style="flex: 0 0 120px;">
              <img src="${poster}" alt="${movieName}" style="width: 120px; border-radius: 10px; box-shadow: 0 10px 20px rgba(0,0,0,0.5);">
            </div>
            <div style="flex: 1; padding-left: 20px;">
              <h2 style="margin: 0 0 10px; color: #e11d48; text-transform: uppercase;">${movieName}</h2>
              <p style="margin: 5px 0; color: #999; font-size: 14px;"><strong>DATE:</strong> May ${dateId}, 2026</p>
              <p style="margin: 5px 0; color: #999; font-size: 14px;"><strong>TIME:</strong> ${displayTime}</p>
            </div>
          </div>

          <div style="background-color: #1a1a1a; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; color: #999;">Customer</td>
                <td style="padding: 10px 0; text-align: right; font-weight: bold;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #999;">Seats</td>
                <td style="padding: 10px 0; text-align: right; color: #e11d48; font-weight: bold;">${seats.join(', ')}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #999;">Total Amount</td>
                <td style="padding: 10px 0; text-align: right; font-size: 18px; font-weight: bold;">₹${totalPrice}</td>
              </tr>
            </table>
          </div>

          <div style="text-align: center; border-top: 1px solid #333; padding-top: 30px;">
             <p style="color: #666; font-size: 13px; line-height: 1.6;">
               Please present this email at the cinema counter.<br>
               Location: <strong>Movie Mokkalu Cineplex</strong>
             </p>
          </div>
        </div>
        
        <div style="background-color: #111; padding: 20px; text-align: center; font-size: 11px; color: #444;">
          © 2026 Movie Mokkalu. All rights reserved.
        </div>
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
