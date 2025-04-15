import { NextResponse } from 'next/server';
import connectDb from "../../../../../../utils/connectDb.js"
import Advertisement from "../../../../../../utils/models/AdvertisementSchema.js"

export async function GET() {
  try {
    await connectDb();

    const ads = await Advertisement.find({}).sort({ postedDate: -1 });

    return NextResponse.json({
      success: true,
      advertisements: ads
    });
  } catch (error) {
    console.error('Error fetching advertisements:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch advertisements'
    }, { status: 500 });
  }
}
