import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET(req) {
  try {
    // Get folder ID from query params, fallback to root folder if not provided
    const url = new URL(req.url);
    const requestedFolderId = url.searchParams.get('folderId');
    
    // Hardcoded Google Service Account credentials
    const serviceAccountKey = {
      "type": "service_account",
      "project_id": "rahul-nagar-454910",
      "private_key_id": "1a673f0b897c0f1489166c9c7560f95072093012",
      "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC2+x/rlzgZYS9L\nYZEJCQyMmXCtJTqhOvet/X3ql55F6qukxeNrXIQp9hN9HhX3yCHUu3H9CZD8INES\ndIOhfEB0KaEvIpCGuuHf/GlFyr8v+qZgUqfRh8fw9e81Fn4gH/7jh3vBWgoWAGEP\ndzQMq0TGLqYlVQiYqRtNodjykf/NJ5q2LyE74ClZqWqoA7tRtXuNo0QfKHhNJjS7\nmxdro7zMBqBY3uoiBMmuu0ZV+++GRdQUBfNA7I3RDB/avaGrBmRUcfKhDysSGbRu\n063YihA8phgc5WzY7d88FYA9QpxaGZQlDVwRTrgj8P8RC1NAo91hYytLYiG3LcMO\n2sOWzeZNAgMBAAECggEAEePQlaCVyAlz7ctOulLrqq1v0kXjCxNwVs8DahXD0DMm\n7/e3Ce6kL1QTSLbR0AV9pUZkWSh/x97Pgh3pJrc2uAS/8RNQjROldNhBVKUDd0Xq\n0V0Tck1zs2/gINEfqLVoHsfGxjsu5ELKOpBdguWV1kiGTv0W15IlDLyHsQOsPlr3\nwjAm6X8+0Eyk5OQtXrI1k12dzjpqCSD2qGptIChNItZJgm8p4w1Ex1Knl9zAeJ9U\nUBAcz7Vc9SVzfJaRRw3eCA8hejWarUK1BjVHq2eA1AVxykMVQnzoqujf0zrtb5ur\n+9ZAp//OUHTF66EGwAgSx6sbmDGR+kHpmmf5gOuAMQKBgQD1W6iLa1saO7xPYbQc\nvWN40NF+Fjz0fbWYKJn+xrj4pdrlqzxGV1wwZiRlD5UydyMueczVHTl24R/47EZN\n43Nkp/Yxu+WVZzL3DKd914na7sBAJo8KucDtoVByLrvZqxRQv7VboeobwqfuObFE\nKIYSn556IlfYjO1popHTt8h3xQKBgQC+6twzbIK6tsnrh3jH4ESnzRe5iSQT+soD\n8ByfUrJCvDfSOMkKvgwRqKjSgvn+G6DxBLOKD2V5Uk+R/AcvHiCCbGl5NKBFJbjX\nmJ3b9H0SlYDFBCV1si0yfuuzQkuu3Y/MGGeLM9MHZ3RmYofj3NAcT8lQ68kOLlnY\nUk/usl+U6QKBgQChwzRz9uuxeADHNVtSN2sFlGcKAg9eAiNfliUxXENHa9HN6f9r\nQN1+61jDaGqtQu7nDVaGiyX/wp0ZuG0BnRvPGQ2v7HmI7ukjCCzFQv2YYiBOKx3T\nrHQON3SaU0V2VNyoADzJlQ6MDuI4pcDBdxYt4R7S1yGjnAZKxuvt8hUxIQKBgFAG\nxHytvHKlkigvJhqqUD0CRDKaYMwbMLjL2kOSd3RvzvpIoUTmesqgJvvuuPmh/Slq\nLhPt9jwPm5j2ytAeUcQ5y1BqFdBGSp/csjbz2cWDc3GiFk2qfTWQbB486NqItvD3\nPdfkxk1xOSJ9pLaH5ZgofZt06lcOaMy7XBQTIuuZAoGBAMvk/veuIehVrog9aBWF\nuvbv0kAvIxU7xc5PswuWRgZwRJu1Mbb8ICxFuOufBToCq+KnhIgcU7JnJ7LcDd9y\n7vZm9hQSeiPnym6J8dwhiTKvD1L4xtIf+jHvbS7XULjk2CYwFgBU0n8PJkfcIbdV\n9gl/oHhgJ869EQq1lxY5IEaG\n-----END PRIVATE KEY-----\n",
      "client_email": "sheets-service-account@rahul-nagar-454910.iam.gserviceaccount.com",
      "token_uri": "https://oauth2.googleapis.com/token"
    };

    // Default root folder ID
    const rootFolderId = "1cXQEwyr8n2-ydx9fTP7uN1dsudLEXM41";
    
    // Use requested folder ID or default to root folder
    const currentFolderId = requestedFolderId || rootFolderId;

    // Authenticate with Google Drive API
    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccountKey,
      scopes: ["https://www.googleapis.com/auth/drive"],
    });

    // Initialize Google Drive
    const drive = google.drive({ version: "v3", auth });
    
    // Get folder details to build path information
    const folderPath = await buildFolderPath(drive, currentFolderId, rootFolderId);
    
    // Get the current folder's contents
    const response = await drive.files.list({
      q: `'${currentFolderId}' in parents and trashed=false`,
      fields: "files(id, name, mimeType, createdTime, size, webViewLink)",
      pageSize: 1000,
    });
    
    // Process files and folders in the current directory
    const items = response.data.files.map(file => {
      const isFolder = file.mimeType === "application/vnd.google-apps.folder";
      return {
        id: file.id,
        name: file.name,
        type: isFolder ? "folder" : "file",
        driveFileId: file.id,
        parent: folderPath.pathString,
        parentId: currentFolderId,
        size: file.size || 0,
        createdAt: file.createdTime,
        viewLink: file.webViewLink
      };
    });

    return NextResponse.json({ 
      success: true, 
      files: items,
      folderInfo: {
        id: currentFolderId,
        path: folderPath.pathArray,
        pathString: folderPath.pathString,
        isRoot: currentFolderId === rootFolderId
      }
    });
  } catch (error) {
    console.error("Error fetching files:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

// Helper function to build the folder path information
async function buildFolderPath(drive, folderId, rootFolderId) {
  // Start with default path for root folder
  if (folderId === rootFolderId) {
    return {
      pathArray: ['Private '],
      pathString: 'Private '
    };
  }
  
  try {
    const pathArray = ['Private '];
    let currentId = folderId;
    
    // Loop until we reach the root folder
    while (currentId !== rootFolderId) {
      // Get current folder info
      const folderInfo = await drive.files.get({
        fileId: currentId,
        fields: 'name,parents'
      });
      
      // Add to path
      if (folderInfo.data.name) {
        pathArray.unshift(folderInfo.data.name);
      }
      
      // Move up to parent folder
      if (folderInfo.data.parents && folderInfo.data.parents.length > 0) {
        currentId = folderInfo.data.parents[0];
        
        // Break if we've reached the root folder
        if (currentId === rootFolderId) {
          break;
        }
      } else {
        // No parents found, break
        break;
      }
    }
    
    // Construct path string in correct order
    const pathString = pathArray.join('/');
    
    return {
      pathArray,
      pathString
    };
  } catch (error) {
    console.error("Error building folder path:", error);
    // Return a default path if something goes wrong
    return {
      pathArray: ['Private '],
      pathString: 'Private '
    };
  }
}