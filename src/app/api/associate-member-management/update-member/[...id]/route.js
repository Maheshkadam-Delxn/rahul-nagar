import { NextResponse } from 'next/server';
import connectDb from "../../../../../../utils/connectDb";
import AssociateMember from '../../../../../../utils/models/AssociateMember';
export async function PUT(request, { params }) {
  try {
    await connectDb();

    const { id } = params;

    const {
      name,
      status,
      image,
      post,
    } = await request.json();

    const member = await AssociateMember.findByIdAndUpdate(
      id,
      {
        name,
        status,
        image,
        post,
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!member) {
      return NextResponse.json({
        success: false,
        message: 'Member not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      member
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating member:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update member'
    }, { status: 500 });
  }
}