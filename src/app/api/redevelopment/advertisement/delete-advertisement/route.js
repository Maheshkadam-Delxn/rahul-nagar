import { NextResponse } from 'next/server';
import connectDb from "../../../../../../utils/connectDb.js"
import Advertisement from "../../../../../../utils/models/AdvertisementSchema.js"

export async function DELETE(request) {
  try {
    await connectDb();

    const data = await request.json();

    if (!data.adId) {
      return NextResponse.json({
        success: false,
        error: 'Advertisement ID is required'
      }, { status: 400 });
    }

    const deletedAd = await Advertisement.findByIdAndDelete(data.adId);

    if (!deletedAd) {
      return NextResponse.json({
        success: false,
        error: 'Advertisement not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Advertisement deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting advertisement:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete advertisement'
    }, { status: 500 });
  }
}
