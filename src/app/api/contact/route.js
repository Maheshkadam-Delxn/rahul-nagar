import { google } from 'googleapis';
import { NextResponse } from 'next/server';

const { GOOGLE_SHEET_ID, CLIENT_EMAIL, PRIVATE_KEY } = process.env;

const auth = new google.auth.JWT({
  email: CLIENT_EMAIL,
  key: PRIVATE_KEY.replace(/\\n/g, '\n'), // Fix newline encoding issue
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

export async function POST(request) {
  try {
    const { name, phone, email, inquiry, message } = await request.json();

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { message: 'Missing required fields: name, email, and message are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Store form data in Google Sheets
    const sheetData = [
      [new Date().toLocaleString(), name, email, phone || 'Not provided', inquiry || 'Not specified', message],
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: GOOGLE_SHEET_ID,
      range: 'Sheet1!A:F', // Adjust based on your Google Sheet structure
      valueInputOption: 'RAW',
      resource: { values: sheetData },
    });

    return NextResponse.json(
      { success: true, message: 'Your message has been saved to Google Sheets!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while saving your message. Please try again later.' },
      { status: 500 }
    );
  }
}

// CORS preflight request handler
export async function OPTIONS() {
  return NextResponse.json(
    null,
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  );
}
