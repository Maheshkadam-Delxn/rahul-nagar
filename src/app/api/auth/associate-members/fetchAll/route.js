import { NextResponse } from 'next/server';
import User from '../../../../../../utils/models/User';
import connectDb from '../../../../../../utils/connectDb';
import jwt from 'jsonwebtoken';

export async function GET(req) {
  try {
    await connectDb();

    // Get the authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Extract and verify token
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if the user is a super admin
      const superAdmin = await User.findById(decoded.id);
      if (!superAdmin || superAdmin.role !== 'super') {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }

      // Fetch all sub-admins
      const subAdmins = await User.find({ role: 'sub' }).select('-password');

      return NextResponse.json({
        success: true,
        subAdmins,
      });

    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
  } catch (error) {
    console.error("Error fetching sub-admins:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
