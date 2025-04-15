// import { google } from 'googleapis';
// import { NextResponse } from 'next/server';
// import nodemailer from 'nodemailer';

// // Google Sheets setup
// const GOOGLE_SHEET_ID = '1BmJYnSKSPUnlimPMK9Hh_hvbLifP80xP3aLcv2uB-Z8';
// const CLIENT_EMAIL = 'sheets-service-account@rahul-nagar-454910.iam.gserviceaccount.com';
// const PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC2+x/rlzgZYS9L\nYZEJCQyMmXCtJTqhOvet/X3ql55F6qukxeNrXIQp9hN9HhX3yCHUu3H9CZD8INES\ndIOhfEB0KaEvIpCGuuHf/GlFyr8v+qZgUqfRh8fw9e81Fn4gH/7jh3vBWgoWAGEP\ndzQMq0TGLqYlVQiYqRtNodjykf/NJ5q2LyE74ClZqWqoA7tRtXuNo0QfKHhNJjS7\nmxdro7zMBqBY3uoiBMmuu0ZV+++GRdQUBfNA7I3RDB/avaGrBmRUcfKhDysSGbRu\n063YihA8phgc5WzY7d88FYA9QpxaGZQlDVwRTrgj8P8RC1NAo91hYytLYiG3LcMO\n2sOWzeZNAgMBAAECggEAEePQlaCVyAlz7ctOulLrqq1v0kXjCxNwVs8DahXD0DMm\n7/e3Ce6kL1QTSLbR0AV9pUZkWSh/x97Pgh3pJrc2uAS/8RNQjROldNhBVKUDd0Xq\n0V0Tck1zs2/gINEfqLVoHsfGxjsu5ELKOpBdguWV1kiGTv0W15IlDLyHsQOsPlr3\nwjAm6X8+0Eyk5OQtXrI1k12dzjpqCSD2qGptIChNItZJgm8p4w1Ex1Knl9zAeJ9U\nUBAcz7Vc9SVzfJaRRw3eCA8hejWarUK1BjVHq2eA1AVxykMVQnzoqujf0zrtb5ur\n+9ZAp//OUHTF66EGwAgSx6sbmDGR+kHpmmf5gOuAMQKBgQD1W6iLa1saO7xPYbQc\nvWN40NF+Fjz0fbWYKJn+xrj4pdrlqzxGV1wwZiRlD5UydyMueczVHTl24R/47EZN\n43Nkp/Yxu+WVZzL3DKd914na7sBAJo8KucDtoVByLrvZqxRQv7VboeobwqfuObFE\nKIYSn556IlfYjO1popHTt8h3xQKBgQC+6twzbIK6tsnrh3jH4ESnzRe5iSQT+soD\n8ByfUrJCvDfSOMkKvgwRqKjSgvn+G6DxBLOKD2V5Uk+R/AcvHiCCbGl5NKBFJbjX\nmJ3b9H0SlYDFBCV1si0yfuuzQkuu3Y/MGGeLM9MHZ3RmYofj3NAcT8lQ68kOLlnY\nUk/usl+U6QKBgQChwzRz9uuxeADHNVtSN2sFlGcKAg9eAiNfliUxXENHa9HN6f9r\nQN1+61jDaGqtQu7nDVaGiyX/wp0ZuG0BnRvPGQ2v7HmI7ukjCCzFQv2YYiBOKx3T\nrHQON3SaU0V2VNyoADzJlQ6MDuI4pcDBdxYt4R7S1yGjnAZKxuvt8hUxIQKBgFAG\nxHytvHKlkigvJhqqUD0CRDKaYMwbMLjL2kOSd3RvzvpIoUTmesqgJvvuuPmh/Slq\nLhPt9jwPm5j2ytAeUcQ5y1BqFdBGSp/csjbz2cWDc3GiFk2qfTWQbB486NqItvD3\nPdfkxk1xOSJ9pLaH5ZgofZt06lcOaMy7XBQTIuuZAoGBAMvk/veuIehVrog9aBWF\nuvbv0kAvIxU7xc5PswuWRgZwRJu1Mbb8ICxFuOufBToCq+KnhIgcU7JnJ7LcDd9y\n7vZm9hQSeiPnym6J8dwhiTKvD1L4xtIf+jHvbS7XULjk2CYwFgBU0n8PJkfcIbdV\n9gl/oHhgJ869EQq1lxY5IEaG\n-----END PRIVATE KEY-----\n".replace(/\\n/g, '\n'), // Fix newline encoding issue`.replace(/\\n/g, '\n');

// const auth = new google.auth.JWT({
//   email: CLIENT_EMAIL,
//   key: PRIVATE_KEY,
//   scopes: ['https://www.googleapis.com/auth/spreadsheets'],
// });

// const sheets = google.sheets({ version: 'v4', auth });

// // Nodemailer setup
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'rahulnagarassociation1@gmail.com', // Replace with your Gmail
//     pass: 'vnsu iadk yorr cdnt',   // Replace with your App Password (not Gmail password)
//   },
// });

// export async function POST(request) {
//   try {
//     const { name, phone, email, inquiry, message } = await request.json();

//     // Basic validation
//     if (!name || !email || !message) {
//       return NextResponse.json(
//         { message: 'Missing required fields: name, email, and message are required' },
//         { status: 400 }
//       );
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return NextResponse.json(
//         { message: 'Please enter a valid email address' },
//         { status: 400 }
//       );
//     }

//     // Append to Google Sheet
//     const sheetData = [
//       [new Date().toLocaleString(), name, email, phone || 'Not provided', inquiry || 'Not specified', message],
//     ];

//     await sheets.spreadsheets.values.append({
//       spreadsheetId: "1BmJYnSKSPUnlimPMK9Hh_hvbLifP80xP3aLcv2uB-Z8",
//       range: 'Sheet1!A:F', // Adjust based on your Google Sheet structure
//       valueInputOption: 'RAW',
//       resource: { values: sheetData },
//     });

//     // Send email notification
//     await transporter.sendMail({
//       from: '"Rahul Nagar Building Management" <rahulnagarassociation1@gmail.com>',
//       to: 'rahulnagarassociation1@gmail.com',
//       subject: 'New Inquiry Received for Redevelopment- Rahul Nagar Building Management',
//       html: `<!DOCTYPE html>
//       <html lang="en">
//       <head>
//           <meta charset="UTF-8">
//           <title>New Inquiry Notification for Redevelopment</title>
//           <style>
//               body {
//                   font-family: Arial, sans-serif;
//                   line-height: 1.6;
//                   color: #333;
//                   max-width: 600px;
//                   margin: 0 auto;
//                   padding: 20px;
//               }
//               .header {
//                   background-color: #2c3e50;
//                   color: white;
//                   padding: 20px;
//                   text-align: center;
//                   border-radius: 5px 5px 0 0;
//               }
//               .logo {
//                   font-size: 24px;
//                   font-weight: bold;
//                   margin-bottom: 10px;
//               }
//               .content {
//                   padding: 20px;
//                   background-color: #f9f9f9;
//                   border-left: 1px solid #ddd;
//                   border-right: 1px solid #ddd;
//               }
//               .inquiry-details {
//                   background-color: white;
//                   padding: 15px;
//                   border-radius: 5px;
//                   margin-top: 20px;
//                   border: 1px solid #eee;
//               }
//               .field {
//                   margin-bottom: 10px;
//               }
//               .label {
//                   font-weight: bold;
//                   color: #2c3e50;
//               }
//               .value {
//                   margin-left: 10px;
//               }
//               .message-box {
//                   background-color: #f5f5f5;
//                   padding: 15px;
//                   border-radius: 5px;
//                   margin-top: 10px;
//                   border-left: 3px solid #2c3e50;
//               }
//               .footer {
//                   background-color: #ecf0f1;
//                   padding: 15px;
//                   text-align: center;
//                   font-size: 14px;
//                   color: #7f8c8d;
//                   border-radius: 0 0 5px 5px;
//                   border: 1px solid #ddd;
//                   border-top: none;
//               }
//               .cta-button {
//                   display: inline-block;
//                   background-color: #3498db;
//                   color: white;
//                   text-decoration: none;
//                   padding: 10px 20px;
//                   border-radius: 5px;
//                   margin-top: 15px;
//                   font-weight: bold;
//               }
//           </style>
//       </head>
//       <body>
//           <div class="header">
//               <div class="logo">Rahul Nagar</div>
             
//           </div>
          
//           <div class="content">
//               <h2>New Inquiry Received</h2>
//               <p>A new inquiry has been submitted through your website. Please find the details below:</p>
              
//               <div class="inquiry-details">
//                   <div class="field">
//                       <span class="label">Date:</span>
//                       <span class="value">${new Date().toLocaleString()}</span>
//                   </div>
//                   <div class="field">
//                       <span class="label">Name:</span>
//                       <span class="value">${name}</span>
//                   </div>
//                   <div class="field">
//                       <span class="label">Email:</span>
//                       <span class="value">${email}</span>
//                   </div>
//                   <div class="field">
//                       <span class="label">Phone:</span>
//                       <span class="value">${phone || 'Not provided'}</span>
//                   </div>
//                   <div class="field">
//                       <span class="label">Inquiry Type:</span>
//                       <span class="value">${inquiry || 'Not specified'}</span>
//                   </div>
//                   <div class="field">
//                       <span class="label">Message:</span>
//                       <div class="message-box">${message}</div>
//                   </div>
//               </div>
              
//               <div style="text-align: center; margin-top: 25px;">
//                   <a href="https://docs.google.com/spreadsheets/d/10meH9FPNeqhZXHvJzbiDmbr-_KsEGUsHcAdOM0Ghwqo" class="cta-button">View in Google Sheets</a>
//               </div>
//           </div>
          
//           <div class="footer">
//               <p>This is an automated notification from <strong>rahulnagar.in</strong></p>
//               <p>© 2025 Rahul Nagar Building Management System. All rights reserved.</p>
//           </div>
//       </body>
//       </html>`,
//       text: `A new inquiry has been submitted:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\nInquiry: ${inquiry || 'Not specified'}\nMessage: ${message}\n\nCheck your Google Sheet: https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}`,
//     });

//     return NextResponse.json(
//       { success: true, message: 'Saved to Google Sheets and email sent!' },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('Error:', error);
//     return NextResponse.json(
//       { success: false, message: 'Something went wrong. Please try again.' },
//       { status: 500 }
//     );
//   }
// }

// export async function OPTIONS() {
//   return NextResponse.json(null, {
//     status: 200,
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Methods': 'POST, OPTIONS',
//       'Access-Control-Allow-Headers': 'Content-Type',
//     },
//   });
// }
import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Google Sheets setup
const GOOGLE_SHEET_ID = '1BmJYnSKSPUnlimPMK9Hh_hvbLifP80xP3aLcv2uB-Z8';
const CLIENT_EMAIL = 'sheets-service-account@rahul-nagar-454910.iam.gserviceaccount.com';
const PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC2+x/rlzgZYS9L\nYZEJCQyMmXCtJTqhOvet/X3ql55F6qukxeNrXIQp9hN9HhX3yCHUu3H9CZD8INES\ndIOhfEB0KaEvIpCGuuHf/GlFyr8v+qZgUqfRh8fw9e81Fn4gH/7jh3vBWgoWAGEP\ndzQMq0TGLqYlVQiYqRtNodjykf/NJ5q2LyE74ClZqWqoA7tRtXuNo0QfKHhNJjS7\nmxdro7zMBqBY3uoiBMmuu0ZV+++GRdQUBfNA7I3RDB/avaGrBmRUcfKhDysSGbRu\n063YihA8phgc5WzY7d88FYA9QpxaGZQlDVwRTrgj8P8RC1NAo91hYytLYiG3LcMO\n2sOWzeZNAgMBAAECggEAEePQlaCVyAlz7ctOulLrqq1v0kXjCxNwVs8DahXD0DMm\n7/e3Ce6kL1QTSLbR0AV9pUZkWSh/x97Pgh3pJrc2uAS/8RNQjROldNhBVKUDd0Xq\n0V0Tck1zs2/gINEfqLVoHsfGxjsu5ELKOpBdguWV1kiGTv0W15IlDLyHsQOsPlr3\nwjAm6X8+0Eyk5OQtXrI1k12dzjpqCSD2qGptIChNItZJgm8p4w1Ex1Knl9zAeJ9U\nUBAcz7Vc9SVzfJaRRw3eCA8hejWarUK1BjVHq2eA1AVxykMVQnzoqujf0zrtb5ur\n+9ZAp//OUHTF66EGwAgSx6sbmDGR+kHpmmf5gOuAMQKBgQD1W6iLa1saO7xPYbQc\nvWN40NF+Fjz0fbWYKJn+xrj4pdrlqzxGV1wwZiRlD5UydyMueczVHTl24R/47EZN\n43Nkp/Yxu+WVZzL3DKd914na7sBAJo8KucDtoVByLrvZqxRQv7VboeobwqfuObFE\nKIYSn556IlfYjO1popHTt8h3xQKBgQC+6twzbIK6tsnrh3jH4ESnzRe5iSQT+soD\n8ByfUrJCvDfSOMkKvgwRqKjSgvn+G6DxBLOKD2V5Uk+R/AcvHiCCbGl5NKBFJbjX\nmJ3b9H0SlYDFBCV1si0yfuuzQkuu3Y/MGGeLM9MHZ3RmYofj3NAcT8lQ68kOLlnY\nUk/usl+U6QKBgQChwzRz9uuxeADHNVtSN2sFlGcKAg9eAiNfliUxXENHa9HN6f9r\nQN1+61jDaGqtQu7nDVaGiyX/wp0ZuG0BnRvPGQ2v7HmI7ukjCCzFQv2YYiBOKx3T\nrHQON3SaU0V2VNyoADzJlQ6MDuI4pcDBdxYt4R7S1yGjnAZKxuvt8hUxIQKBgFAG\nxHytvHKlkigvJhqqUD0CRDKaYMwbMLjL2kOSd3RvzvpIoUTmesqgJvvuuPmh/Slq\nLhPt9jwPm5j2ytAeUcQ5y1BqFdBGSp/csjbz2cWDc3GiFk2qfTWQbB486NqItvD3\nPdfkxk1xOSJ9pLaH5ZgofZt06lcOaMy7XBQTIuuZAoGBAMvk/veuIehVrog9aBWF\nuvbv0kAvIxU7xc5PswuWRgZwRJu1Mbb8ICxFuOufBToCq+KnhIgcU7JnJ7LcDd9y\n7vZm9hQSeiPnym6J8dwhiTKvD1L4xtIf+jHvbS7XULjk2CYwFgBU0n8PJkfcIbdV\n9gl/oHhgJ869EQq1lxY5IEaG\n-----END PRIVATE KEY-----\n".replace(/\\n/g, '\n'), // Fix newline encoding issue`.replace(/\\n/g, '\n');

const auth = new google.auth.JWT({
  email: CLIENT_EMAIL,
  key: PRIVATE_KEY,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rahulnagarassociation1@gmail.com', // Replace with your Gmail
    pass: 'vnsu iadk yorr cdnt',   // Replace with your App Password (not Gmail password)
  },
});

export async function POST(request) {
  try {
    const { name, phone, email, website, message } = await request.json();

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { message: 'Missing required fields: name, email, and message are required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Append to Google Sheet (Now including website field)
    const sheetData = [
      [new Date().toLocaleString(), name, email, phone || 'Not provided', website || 'Not provided', message],
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: "1BmJYnSKSPUnlimPMK9Hh_hvbLifP80xP3aLcv2uB-Z8",
      range: 'Sheet1!A:F', // Adjust based on your Google Sheet structure
      valueInputOption: 'RAW',
      resource: { values: sheetData },
    });

    // Send email notification (Now including website field)
    await transporter.sendMail({
      from: '"Rahul Nagar Building Management" <rahulnagarassociation1@gmail.com>',
      to: 'rahulnagarassociation1@gmail.com',
      subject: 'New Inquiry Received for Redevelopment- Rahul Nagar Building Management',
      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <title>New Inquiry Notification for Redevelopment</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
              }
              .header {
                  background-color: #2c3e50;
                  color: white;
                  padding: 20px;
                  text-align: center;
                  border-radius: 5px 5px 0 0;
              }
              .logo {
                  font-size: 24px;
                  font-weight: bold;
                  margin-bottom: 10px;
              }
              .content {
                  padding: 20px;
                  background-color: #f9f9f9;
                  border-left: 1px solid #ddd;
                  border-right: 1px solid #ddd;
              }
              .inquiry-details {
                  background-color: white;
                  padding: 15px;
                  border-radius: 5px;
                  margin-top: 20px;
                  border: 1px solid #eee;
              }
              .field {
                  margin-bottom: 10px;
              }
              .label {
                  font-weight: bold;
                  color: #2c3e50;
              }
              .value {
                  margin-left: 10px;
              }
              .message-box {
                  background-color: #f5f5f5;
                  padding: 15px;
                  border-radius: 5px;
                  margin-top: 10px;
                  border-left: 3px solid #2c3e50;
              }
              .footer {
                  background-color: #ecf0f1;
                  padding: 15px;
                  text-align: center;
                  font-size: 14px;
                  color: #7f8c8d;
                  border-radius: 0 0 5px 5px;
                  border: 1px solid #ddd;
                  border-top: none;
              }
              .cta-button {
                  display: inline-block;
                  background-color: #3498db;
                  color: white;
                  text-decoration: none;
                  padding: 10px 20px;
                  border-radius: 5px;
                  margin-top: 15px;
                  font-weight: bold;
              }
          </style>
      </head>
      <body>
          <div class="header">
              <div class="logo">Rahul Nagar</div>
             
          </div>
          
          <div class="content">
              <h2>New Inquiry Received</h2>
              <p>A new inquiry has been submitted through your website. Please find the details below:</p>
              
              <div class="inquiry-details">
                  <div class="field">
                      <span class="label">Date:</span>
                      <span class="value">${new Date().toLocaleString()}</span>
                  </div>
                  <div class="field">
                      <span class="label">Name:</span>
                      <span class="value">${name}</span>
                  </div>
                  <div class="field">
                      <span class="label">Email:</span>
                      <span class="value">${email}</span>
                  </div>
                  <div class="field">
                      <span class="label">Phone:</span>
                      <span class="value">${phone || 'Not provided'}</span>
                  </div>
                  <div class="field">
                      <span class="label">Website:</span>
                      <span class="value">${website || 'Not provided'}</span>
                  </div>
                  <div class="field">
                      <span class="label">Message:</span>
                      <div class="message-box">${message}</div>
                  </div>
              </div>
              
              <div style="text-align: center; margin-top: 25px;">
                  <a href="https://docs.google.com/spreadsheets/d/10meH9FPNeqhZXHvJzbiDmbr-_KsEGUsHcAdOM0Ghwqo" class="cta-button">View in Google Sheets</a>
              </div>
          </div>
          
          <div class="footer">
              <p>This is an automated notification from <strong>rahulnagar.in</strong></p>
              <p>© 2025 Rahul Nagar Building Management System. All rights reserved.</p>
          </div>
      </body>
      </html>`,
      text: `A new inquiry has been submitted:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\nWebsite: ${website || 'Not provided'}\nMessage: ${message}\n\nCheck your Google Sheet: https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}`,
    });

    return NextResponse.json(
      { success: true, message: 'Saved to Google Sheets and email sent!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}