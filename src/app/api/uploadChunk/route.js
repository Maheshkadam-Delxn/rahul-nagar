import { google } from "googleapis";
import { NextResponse } from "next/server";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Upload-Start, X-Upload-Length, X-Upload-Url, X-Upload-MimeType, X-Upload-FileName, X-Upload-FolderId',
};

export async function PUT(req) {
  try {
    const uploadUrl = req.headers.get("X-Upload-Url");
    const start = parseInt(req.headers.get("X-Upload-Start"), 10);
    const totalLength = parseInt(req.headers.get("X-Upload-Length"), 10);
    const mimeType = req.headers.get("X-Upload-MimeType");
    const fileName = req.headers.get("X-Upload-FileName");
    const folderId = req.headers.get("X-Upload-FolderId");

    if (!uploadUrl || isNaN(start) || isNaN(totalLength) || !mimeType || !fileName || !folderId) {
      const response = NextResponse.json(
        { success: false, error: "Missing required headers" },
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

    const chunkBuffer = Buffer.from(await req.arrayBuffer());
    const contentRange = `bytes ${start}-${start + chunkBuffer.length - 1}/${totalLength}`;

    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Range": contentRange,
        "Content-Type": "application/octet-stream",
      },
      body: chunkBuffer,
    });

    let fileId = null;
    if (uploadRes.status === 200 || uploadRes.status === 201) {
      // Upload complete, get fileId from response
      const fileMetadata = await uploadRes.json();
      fileId = fileMetadata.id;
      if (!fileId) {
        throw new Error("Failed to retrieve fileId from Google Drive");
      }

      // Set public read permissions
      const drive = google.drive({ version: "v3", auth });
      await drive.permissions.create({
        fileId,
        requestBody: {
          role: "reader",
          type: "anyone",
        },
      });
    } else if (uploadRes.status === 308) {
      // Resume incomplete, more chunks needed
      const response = NextResponse.json({ success: true }, { status: 308 });
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    } else {
      const errorBody = await uploadRes.text();
      console.error("Chunk upload error:", errorBody);
      throw new Error(`Chunk upload failed: ${uploadRes.statusText}`);
    }

    const response = NextResponse.json({ success: true, fileId });
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  } catch (err) {
    console.error("Chunk upload error:", err);
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