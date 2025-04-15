import { NextResponse } from 'next/server';
import connectDb from "../../../../../../utils/connectDb.js"
import Advertisement from "../../../../../../utils/models/AdvertisementSchema.js"

export async function POST(request) {
    try {
      await connectDb();
  
      const data = await request.json();
  
      // Validate required fields
      if (!data.title || !data.imageUrl || !data.cloudinaryId || !data.createdBy) {
        return NextResponse.json({
          success: false,
          error: 'Title, image URL, Cloudinary ID, and createdBy are required'
        }, { status: 400 });
      }
  
      // Create new advertisement object with additional fields
      const newAd = new Advertisement({
        title: data.title,
        description: data.description || '',
        imageUrl: data.imageUrl,
        cloudinaryId: data.cloudinaryId,  // Cloudinary ID added
        createdBy: data.createdBy,  // CreatedBy added
        redirectUrl: data.redirectUrl || '',
        postedDate: new Date()
      });
  
      await newAd.save();
  
      return NextResponse.json({
        success: true,
        message: 'Advertisement added successfully',
        advertisement: newAd
      }, { status: 201 });
    } catch (error) {
      console.error('Error adding advertisement:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to add advertisement'
      }, { status: 500 });
    }
  }
