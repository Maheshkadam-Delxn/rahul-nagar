import { NextResponse } from 'next/server';
import connectDb from "../../../../../utils/connectDb";
import AssociateMember from '../../../../../utils/models/AssociateMember';

export async function POST(request) {
  try {
    await connectDb();

    const { memberIds } = await request.json();

    if (!memberIds || !Array.isArray(memberIds) || memberIds.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No member IDs provided'
      }, { status: 400 });
    }

    const result = await AssociateMember.deleteMany({
      _id: { $in: memberIds }
    });

    return NextResponse.json({
      success: true,
      message: `${result.deletedCount} members deleted successfully`
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting members:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete members'
    }, { status: 500 });
  }
}