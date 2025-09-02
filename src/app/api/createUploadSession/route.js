import { google } from "googleapis";
import { NextResponse } from "next/server";

// Add CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function POST(req) {
  try {
    // Parse multipart form data to get file and metadata
    const formData = await req.formData();
    const file = formData.get("file");
    const fileName = formData.get("fileName");
    const mimeType = formData.get("mimeType");
    const folderId = formData.get("folderId") || process.env.GOOGLE_DRIVE_FOLDER_ID;

    if (!file || !fileName || !mimeType) {
      const response = NextResponse.json(
        { success: false, error: "Missing required fields: file, fileName, or mimeType" },
        { status: 400 }
      );
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    }

    const serviceAccountKey = {
      // Your service account key (same as before)
      "type": "service_account",
      "project_id": "rahul-nagar-454910",
      "private_key_id": "1a673f0b897c0f1489166c9c7560f95072093012",
      "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC2+x/rlzgZYS9L\nYZEJCQyMmXCtJTqhOvet/X3ql55F6qukxeNrXIQp9hN9HhX3yCHUu3H9CZD8INES\ndIOhfEB0KaEvIpCGuuHf/GlFyr8v+qZgUqfRh8fw9e81Fn4gH/7jh3vBWgoWAGEP\ndzQMq0TGLqYlVQiYqRtNodjykf/NJ5q2LyE74ClZqWqoA7tRtXuNo0QfKHhNJjS7\nmxdro7zMBqBY3uoiBMmuu0ZV+++GRdQUBfNA7I3RDB/avaGrBmRUcfKhDysSGbRu\n063YihA8phgc5WzY7d88FYA9QpxaGZQlDVwRTrgj8P8RC1NAo91hYytLYiG3LcMO\n2sOWzeZNAgMBAAECggEAEePQlaCVyAlz7ctOulLrqq1v0kXjCxNwVs8DahXD0DMm\n7/e3Ce6kL1QTSLbR0AV9pUZkWSh/x97Pgh3pJrc2uAS/8RNQjROldNhBVKUDd0Xq\n0V0Tck1zs2/gINEfqLVoHsfGxjsu5ELKOpBdguWV1kiGTv0W15IlDLyHsQOsPlr3\nwjAm6X8+0Eyk5OQtXrI1k12dzjpqCSD2qGptIChNItZJgm8p4w1Ex1Knl9zAeJ9U\nUBAcz7Vc9SVzfJaRRw3eCA8hejWarUK1BjVHq2eA1AVxykMVQnzoqujf0zrtb5ur\n+9ZAp//OUHTF66EGwAgSx6sbmDGR+kHpmmf5gOuAMQKBgQD1W6iLa1saO7xPYbQc\nvWN40NF+Fjz0fbWYKJn+xrj4pdrlqzxGV1wwZiRlD5UydyMueczVHTl24R/47EZN\n43Nkp/Yxu+WVZzL3DKd914na7sBAJo8KucDtoVByLrvZqxRQv7VboeobwqfuObFE\nKIYSn556IlfYjO1popHTt8h3xQKBgQC+6twzbIK6tsnrh3jH4ESnzRe5iSQT+soD\n8ByfUrJCvDfSOMkKvgwRqKjSgvn+G6DxBLOKD2V5Uk+R/AcvHiCCbGl5NKBFJbjX\nmJ3b9H0SlYDFBCV1si0yfuuzQkuu3Y/MGGeLM9MHZ3RmYofj3NAcT8lQ68kOLlnY\nUk/usl+U6QKBgQChwzRz9uuxeADHNVtSN2sFlGcKAg9eAiNfliUxXENHa9HN6f9r\nQN1+61jDaGqtQu7nDVaGiyX/wp0ZuG0BnRvPGQ2v7HmI7ukjCCzFQv2YYiBOKx3T\nrHQON3SaU0V2VNyoADzJlQ6MDuI4pcDBdxYt4R7S1yGjnAZKxuvt8hUxIQKBgFAG\nxHytvHKlkigvJhqqUD0CRDKaYMwbMLjL2kOSd3RvzvpIoUTmesqgJvvuuPmh/Slq\nLhPt9jwPm5j2ytAeUcQ5y1BqFdBGSp/csjbz2cWDc3GiFk2qfTWQbB486NqItvD3\nPdfkxk1xOSJ9pLaH5ZgofZt06lcOaMy7XBQTIuuZAoGBAMvk/veuIehVrog9aBWF\nuvbv0kAvIxU7xc5PswuWRgZwRJu1Mbb8ICxFuOufBToCq+KnhIgcU7JnJ7LcDd9y\n7vZm9hQSeiPnym6J8dwhiTKvD1L4xtIf+jHvbS7XULjk2CYwFgBU0n8PJkfcIbdV\n9gl/oHhgJ869EQq1lxY5IEaG\n-----END PRIVATE KEY-----\n",
      "client_email": "sheets-service-account@rahul-nagar-454910.iam.gserviceaccount.com",
      "token_uri": "https://oauth2.googleapis.com/token"
    };

    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccountKey,
      scopes: ["https://www.googleapis.com/auth/drive.file"],
    });

    const token = await auth.getAccessToken();

    // Step 1: Create resumable upload session
    const sessionRes = await fetch(
      "https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json; charset=UTF-8",
          "X-Upload-Content-Type": mimeType,
        },
        body: JSON.stringify({
          name: fileName,
          parents: [folderId],
        }),
      }
    );

    if (!sessionRes.ok) {
      const errorBody = await sessionRes.text();
      console.error("Google API error:", errorBody);
      throw new Error(`Failed to create session: ${sessionRes.statusText}`);
    }

    const uploadUrl = sessionRes.headers.get("location");
    if (!uploadUrl) {
      throw new Error("No resumable upload URL returned from Google Drive");
    }

    // Step 2: Upload the file to Google Drive
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": mimeType,
        "Content-Length": fileBuffer.length,
      },
      body: fileBuffer,
    });

    if (!uploadRes.ok) {
      const errorBody = await uploadRes.text();
      console.error("Google Drive upload error:", errorBody);
      throw new Error(`Failed to upload file: ${uploadRes.statusText}`);
    }

    const fileMetadata = await uploadRes.json();
    const fileId = fileMetadata.id;
    if (!fileId) {
      throw new Error("Failed to retrieve fileId from Google Drive");
    }

    // Step 3: Set public read permissions
    const drive = google.drive({ version: "v3", auth });
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    const response = NextResponse.json({ success: true, fileId });
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;

  } catch (err) {
    console.error("Upload error:", err);
    const response = NextResponse.json({ success: false, error: err.message }, { status: 500 });
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  }
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}