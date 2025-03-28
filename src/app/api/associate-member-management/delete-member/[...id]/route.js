import { NextResponse } from 'next/server';
import connectDb from "../../../../../../utils/connectDb";
import AssociateMember from '../../../../../../utils/models/AssociateMember';

export async function DELETE(request, { params }) {
  try {
    await connectDb();

    const { id } = await params;

    const member = await AssociateMember.findByIdAndDelete(id);

    if (!member) {
      return NextResponse.json({
        success: false,
        message: 'Member not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Member deleted successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting member:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete member'
    }, { status: 500 });
  }
}