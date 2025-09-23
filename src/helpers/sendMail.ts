import nodemailer from 'nodemailer';
import ApiError from '../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import config from '../config';

export async function sendEmail(email: string, subject: string, text: string) {
  try {
    const transporter = nodemailer.createTransport({
      host: config.email.host,
      port: Number(config.email.port),
      secure: false,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });

    const info = await transporter.sendMail({
      from: `"NSN" ${config.email.from}`,
      to: email,
      subject: subject,
      text: text,
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body, html {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            padding: 25px 30px;
            border: 1px solid #dddddd;
            border-radius: 8px;
          }
          .header {
            font-size: 18px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 20px;
            text-align: left; /* Left aligned */
          }
          .content {
            font-size: 16px;
            line-height: 1.6;
            color: #555555;
            text-align: left; /* Left aligned */
          }
          .footer {
            font-size: 12px;
            color: #999999;
            margin-top: 30px;
            text-align: left; /* Left aligned */
          }
          @media (max-width: 600px) {
            .container {
              padding: 20px;
            }
            .header {
              font-size: 16px;
            }
            .content {
              font-size: 15px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">${subject}</div>
          <div class="content">
            <p>${text}</p>
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} NSN. All rights reserved.
          </div>
        </div>
      </body>
      </html>
      `,
    });

    return info;
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Error sending email'
    );
  }
}
