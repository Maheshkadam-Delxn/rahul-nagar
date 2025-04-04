import { NextResponse } from 'next/server';
import connectDb from "../../../../../utils/connectDb";
import GalleryImage from '../../../../../utils/models/GalleryImage';

export async function POST(request) {
  try {
    await connectDb();
    
  
    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.imageUrl) {
      return NextResponse.json({ 
        success: false, 
        error: 'Title and image URL are required' 
      }, { status: 400 });
    }
    
    const newImage = new GalleryImage({
      title: data.title,
      description: data.description || '',
      imageUrl: data.imageUrl,
      category: data.category || 'general',
      uploadDate: new Date()
    });
    
    await newImage.save();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Image added successfully',
      image: newImage
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding gallery image:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to add image' 
    }, { status: 500 });
  }
}
