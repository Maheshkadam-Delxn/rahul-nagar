import { NextResponse } from 'next/server';
import User from '../../../../../utils/models/User';
import connectDb from "../../../../../utils/connectDb";

export async function POST(req) {
  try {
    await connectDb();
    
    const { email, password, superSecret } = await req.json();

    // Verify super secret key from environment
    if (superSecret !== process.env.SUPER_ADMIN_SECRET) {
      return NextResponse.json(
        { error: 'Invalid super admin secret' },
        { status: 401 }
      );
    }

    // Check for existing user
    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Create new super admin
    const user = await User.create({ 
      email, 
      password,
      role: 'super'
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}