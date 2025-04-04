import { NextResponse } from 'next/server';
import connectDb from "../../../../../utils/connectDb";
import GalleryImage from '../../../../../utils/models/GalleryImage';

export async function PUT(request) {
  try {
    await connectDb();
    

   
    
    const data = await request.json();
    
    if (!data.imageId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Image ID is required' 
      }, { status: 400 });
    }
    
    const updateData = {
      title: data.title,
      description: data.description || '',
      category: data.category || 'general'
    };
    
    // Only update imageUrl if provided
    if (data.imageUrl) {
      updateData.imageUrl = data.imageUrl;
    }
    
    const image = await GalleryImage.findByIdAndUpdate(
      data.imageId,
      updateData,
      { new: true }
    )
    
    if (!image) {
      return NextResponse.json({ 
        success: false, 
        error: 'Image not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Image updated successfully',
      image
    });
  } catch (error) {
    console.error('Error updating gallery image:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update image' 
    }, { status: 500 });
  }
}
