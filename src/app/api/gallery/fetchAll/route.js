import { NextResponse } from 'next/server';
import connectDb from "../../../../../utils/connectDb";
import GalleryImage from '../../../../../utils/models/GalleryImage';

export async function GET(request) {
  try {
    await connectDb();
    
    // Get all images, sorted by upload date (newest first)
    const images = await GalleryImage.find({})
    return NextResponse.json({ 
      success: true, 
      images 
    });
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch gallery images' 
    }, { status: 500 });
  }
}