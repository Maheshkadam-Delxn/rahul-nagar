import { NextResponse } from 'next/server';
import User from '../../../../../../utils/models/User';
import connectDb from '../../../../../../utils/connectDb';
import jwt from 'jsonwebtoken';

export async function PATCH(req) {
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

    // Extract the Sub Admin ID and updated data from the request body
    const { subAdminId, updateData } = await req.json();
    if (!subAdminId || !updateData) {
      return NextResponse.json({ error: 'Sub Admin ID and update data are required' }, { status: 400 });
    }

    // Find and update the Sub Admin
    const updatedSubAdmin = await User.findOneAndUpdate(
      { _id: subAdminId, role: 'sub' }, 
      { $set: updateData }, 
      { new: true }
    );

    if (!updatedSubAdmin) {
      return NextResponse.json({ error: 'Sub Admin not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Sub Admin updated successfully',
      updatedSubAdmin
    });

  } catch (error) {
    console.error("Error updating Sub Admin:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
