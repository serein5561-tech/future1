const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendOTP = async (phoneNumber) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Send OTP via SMS
    await client.messages.create({
      body: `Your Future Viz OTP is: ${otp}. Valid for 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    return otp;
  } catch (error) {
    console.error(`Error sending OTP: ${error.message}`);
    throw error;
  }
};

module.exports = { sendOTP };
