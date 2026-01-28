// Script to set OTP 123456 for all users
require('dotenv').config();

// Start the server with pre-configured OTP
const http = require('http');

async function setOTPViaAPI() {
  try {
    const postData = JSON.stringify({
      otp: '123456',
    });

    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/set-otp-all',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    return new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            console.log('\n' + '='.repeat(50));
            console.log('✅ OTP Set Successfully!');
            console.log('='.repeat(50));
            console.log(`📌 OTP: 123456`);
            console.log(`⏱️  Valid for: 24 hours`);
            console.log(`👥 Users affected: ${response.count || 'All users'}`);
            console.log('='.repeat(50) + '\n');
            resolve();
          } catch (e) {
            reject(new Error('Failed to parse response: ' + data));
          }
        });
      });

      req.on('error', (e) => {
        reject(e);
      });

      req.write(postData);
      req.end();
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Wait for server and make request with retry logic
let attempts = 0;
const maxAttempts = 5;

function trySetOTP() {
  attempts++;
  console.log(`Attempt ${attempts}/${maxAttempts}: Connecting to backend server...`);
  
  setOTPViaAPI().catch((err) => {
    if (attempts < maxAttempts) {
      console.log(`  ⏳ Retrying in 1 second...`);
      setTimeout(trySetOTP, 1000);
    } else {
      console.error('❌ Failed after ' + maxAttempts + ' attempts');
      console.log('\n⚠️  Make sure the backend server is running on port 5000');
      console.log('Run in another terminal: cd b:\\future\\backend && npm start');
      process.exit(1);
    }
  });
}

// Start trying to connect
setTimeout(trySetOTP, 1000);
