import nodemailer from 'nodemailer';

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM } =
  process.env;

if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD || !SMTP_FROM) {
  console.warn(
    'SMTP env variables are not fully set. sendMail will likely fail.',
  );
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: Number(SMTP_PORT) === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
});

export const sendEmail = async (mailOptions) => {
  const options = {
    from: SMTP_FROM,
    ...mailOptions,
  };

  try {
    const info = await transporter.sendMail(options);
    return info;
  } catch (err) {
    console.error('sendEmail error:', err);
    throw err;
  }
};
