import { NextResponse } from 'next/server';
import connectDb from "../../../../../../utils/connectDb.js"
import Advertisement from "../../../../../../utils/models/AdvertisementSchema.js"

export async function PUT(request) {
  try {
    await connectDb();

    const data = await request.json();

    if (!data.adId) {
      return NextResponse.json({
        success: false,
        error: 'Advertisement ID is required'
      }, { status: 400 });
    }

    const updateData = {
      title: data.title,
      description: data.description || '',
      redirectUrl: data.redirectUrl || ''
    };

    if (data.imageUrl) {
      updateData.imageUrl = data.imageUrl;
    }

    const updatedAd = await Advertisement.findByIdAndUpdate(
      data.adId,
      updateData,
      { new: true }
    );

    if (!updatedAd) {
      return NextResponse.json({
        success: false,
        error: 'Advertisement not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Advertisement updated successfully',
      advertisement: updatedAd
    });
  } catch (error) {
    console.error('Error updating advertisement:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update advertisement'
    }, { status: 500 });
  }
}
