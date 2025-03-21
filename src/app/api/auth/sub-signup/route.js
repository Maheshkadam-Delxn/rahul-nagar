import { NextResponse } from 'next/server';
import User from '../../../../../utils/models/User';
import connectDb from "../../../../../utils/connectDb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDb();

    // Get the request headers (for token)
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized: No token provided' },
        { status: 401 }
      );
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid token' },
        { status: 401 }
      );
    }

    // Only Super Admins can create Sub Admins
    if (decoded.role !== 'super') {
      return NextResponse.json(
        { error: 'Forbidden: Only Super Admins can create Sub Admins' },
        { status: 403 }
      );
    }

    // Get Sub Admin details from request
    const { email, password } = await req.json();

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Create new Sub Admin
    const subAdmin = await User.create({
      email,
      password,
      role: 'sub'  // Ensure the role is set to 'sub'
    });

    return NextResponse.json({
      success: true,
      message: 'Sub Admin created successfully',
      user: {
        id: subAdmin._id,
        email: subAdmin.email,
        role: subAdmin.role
      }
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
