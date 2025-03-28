import { NextResponse } from 'next/server';
import connectDb from "../../../../../utils/connectDb";
import AssociateMember from '../../../../../utils/models/AssociateMember';

export async function POST(request) {
  try {
    await connectDb();

    const {
      name,
      status,
      image,
      post,
    } = await request.json();

    const existingMember = await AssociateMember.findOne({ name });
    if (existingMember) {
      return NextResponse.json({
        success: false,
        message: 'A member with this Name is already Exists'
      }, { status: 400 });
    }

    // Create new member
    const member = await AssociateMember.create({
      name,
      status,
      image,
      post,
    });

    return NextResponse.json({
      success: true,
      member: {
        _id: member._id,
        name: member.name,
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding member:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to add member'
    }, { status: 500 });
  }
}