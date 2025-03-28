import { NextResponse } from 'next/server';
import connectDb from "../../../../../utils/connectDb";
import AssociateMember from '../../../../../utils/models/AssociateMember';

export async function GET(request) {
  try {
    await connectDb();

    const members = await AssociateMember.find().select('-password');

    return NextResponse.json({
      success: true,
      members
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch members'
    }, { status: 500 });
  }
}