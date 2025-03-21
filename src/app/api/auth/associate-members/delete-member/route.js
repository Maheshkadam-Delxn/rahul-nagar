import { NextResponse } from 'next/server';
import User from '../../../../../../utils/models/User';
import connectDb from '../../../../../../utils/connectDb';
import jwt from 'jsonwebtoken';

export async function DELETE(req) {
  try {
    await connectDb();

    // Get the authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Extract and verify token
    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Check if the requester is a Super Admin
    const superAdmin = await User.findById(decoded.id);
    if (!superAdmin || superAdmin.role !== 'super') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Extract the Sub Admin ID from the request body
    const { subAdminId } = await req.json();
    if (!subAdminId) {
      return NextResponse.json({ error: 'Sub Admin ID is required' }, { status: 400 });
    }

    // Find and delete the Sub Admin
    const subAdmin = await User.findOneAndDelete({ _id: subAdminId, role: 'sub' });
    if (!subAdmin) {
      return NextResponse.json({ error: 'Sub Admin not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Sub Admin deleted successfully' });

  } catch (error) {
    console.error("Error deleting Sub Admin:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
