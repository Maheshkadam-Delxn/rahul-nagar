import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token missing' },
        { status: 401 }
      );
    }

    // Verify token - replace with your actual secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // In a real app, you would fetch user from database here
    const user = {
      id: decoded.userId,
      name: decoded.name || 'Admin User',
      role: decoded.role || 'admin'
    };

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }
}