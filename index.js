require('dotenv').config();
const nodemailer = require('nodemailer');
const cron = require('node-cron');

function sendEmail(to, subject, message) {
  return new Promise((resolve, reject) => {
    console.log('EMAIL_USERNAME: ', process.env.EMAIL_USERNAME);
    console.log('EMAIL_PASSWORD: ', process.env.EMAIL_PASSWORD);
    console.log('EMAIL_SENDER: ', process.env.EMAIL_SENDER);
    console.log('EMAIL_RECEIVER: ', process.env.EMAIL_RECEIVER);
    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.eu',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }});
    const options = {
      from : `${process.env.EMAIL_SENDER} <${process.env.EMAIL_USERNAME}>`, 
      to, 
      subject, 
      text: message
    };
    transporter.sendMail(options, (error, info) => {
      transporter.close();
      if(error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });  
}

async function sendCronEmail() {
  const to = process.env.EMAIL_RECEIVER;
  const subject = 'Cron test';
  const message = 'Test cron on Railway';
  return await sendEmail(to, subject, message);
}

async function main() {
  try {
    const result = await sendCronEmail();
    console.log(result);
  } catch(error) {
    console.log(error);
    process.exit(1);
  }
}

cron.schedule('*/10 * * * *', async () => {
  await main();
});

// main();
