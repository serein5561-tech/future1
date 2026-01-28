// Simple in-memory OTP storage for testing
const otpStore = {};

// Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP
const sendOTPToPhone = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Store OTP in memory (for testing)
    otpStore[phoneNumber] = {
      otp,
      expiry: Date.now() + 10 * 60 * 1000, // 10 minutes
    };

    // Try to send via Twilio (optional - works without real credentials)
    try {
      if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_ACCOUNT_SID.startsWith('AC')) {
        const twilio = require('twilio');
        const client = twilio(
          process.env.TWILIO_ACCOUNT_SID,
          process.env.TWILIO_AUTH_TOKEN
        );
        await client.messages.create({
          body: `Your Future Viz OTP is: ${otp}. Valid for 10 minutes.`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phoneNumber,
        });
        console.log(`📱 SMS sent to ${phoneNumber}`);
      }
    } catch (twilioError) {
      console.log(`⚠️  Twilio SMS failed - showing OTP in console instead`);
    }

    // Always log OTP for testing
    console.log(`\n${'='.repeat(50)}`);
    console.log(`📨 OTP for ${phoneNumber}: ${otp}`);
    console.log(`⏱️  Valid for 10 minutes`);
    console.log(`💡 Or use test OTP: 123456`);
    console.log(`${'='.repeat(50)}\n`);

    res.json({ message: 'OTP sent successfully', otp: process.env.NODE_ENV !== 'production' ? otp : undefined });
  } catch (error) {
    console.error('Error sending OTP:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// Verify OTP and Login
const verifyOTP = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({ message: 'Phone number and OTP are required' });
    }

    // Check OTP validity
    const storedOTP = otpStore[phoneNumber];
    
    // Allow test OTP 123456 for testing purposes
    const isTestOTP = otp === '123456';
    
    if (!isTestOTP && (!storedOTP || storedOTP.otp !== otp || storedOTP.expiry < Date.now())) {
      console.log(`❌ OTP Verification Failed for ${phoneNumber}`);
      console.log(`   Received OTP: ${otp}`);
      console.log(`   Stored OTP: ${storedOTP?.otp || 'none'}`);
      console.log(`   Expired: ${storedOTP?.expiry < Date.now()}`);
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Generate JWT token
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { userId: `user_${phoneNumber}_${Date.now()}`, phoneNumber },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Clean up
    delete otpStore[phoneNumber];

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: `user_${phoneNumber}_${Date.now()}`,
        phoneNumber,
        name: '',
        careerGoal: '',
      },
    });
  } catch (error) {
    console.error('Error verifying OTP:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    res.json({
      id: req.user.userId,
      phoneNumber: req.user.phoneNumber,
      name: '',
      age: null,
      careerGoal: '',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { name, age, careerGoal } = req.body;
    res.json({
      id: req.user.userId,
      phoneNumber: req.user.phoneNumber,
      name,
      age,
      careerGoal,
      updatedAt: new Date(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Set OTP for all users (testing/admin function)
const setOTPForAllUsers = async (req, res) => {
  try {
    const { otp, phoneNumbers } = req.body;

    if (!otp) {
      return res.status(400).json({ message: 'OTP is required' });
    }

    // If specific phone numbers provided, set OTP only for those
    if (phoneNumbers && Array.isArray(phoneNumbers) && phoneNumbers.length > 0) {
      phoneNumbers.forEach(phoneNumber => {
        otpStore[phoneNumber] = {
          otp,
          expiry: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        };
      });
      console.log(`✅ OTP ${otp} set for ${phoneNumbers.length} phone numbers`);
      return res.json({
        message: `OTP ${otp} set successfully for ${phoneNumbers.length} phone numbers`,
        count: phoneNumbers.length,
      });
    }

    // Otherwise, set OTP for ALL in-memory store (all currently active users)
    const allPhoneNumbers = Object.keys(otpStore);
    allPhoneNumbers.forEach(phoneNumber => {
      otpStore[phoneNumber] = {
        otp,
        expiry: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      };
    });

    console.log(`\n${'='.repeat(50)}`);
    console.log(`✅ OTP ${otp} set for all ${allPhoneNumbers.length} users`);
    console.log(`Valid for 24 hours`);
    console.log(`${'='.repeat(50)}\n`);

    res.json({
      message: `OTP ${otp} set successfully for all users`,
      otp,
      count: allPhoneNumbers.length,
      affectedUsers: allPhoneNumbers,
    });
  } catch (error) {
    console.error('Error setting OTP:', error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendOTPToPhone,
  verifyOTP,
  getUserProfile,
  updateUserProfile,
  setOTPForAllUsers,
};
