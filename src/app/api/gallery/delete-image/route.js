import { NextResponse } from 'next/server';
import connectDb from "../../../../../utils/connectDb";
import GalleryImage from '../../../../../utils/models/GalleryImage';

export async function DELETE(request) {
  try {
    await connectDb();
    
    const data = await request.json();
    
    if (!data.imageId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Image ID is required' 
      }, { status: 400 });
    }
    
    const deletedImage = await GalleryImage.findByIdAndDelete(data.imageId);
    
    if (!deletedImage) {
      return NextResponse.json({ 
        success: false, 
        error: 'Image not found' 
      }, { status: 404 });
    }
    
    // Note: This doesn't delete the image from Cloudinary
    // You might want to add Cloudinary deletion logic here
    
    return NextResponse.json({ 
      success: true, 
      message: 'Image deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete image' 
    }, { status: 500 });
  }
}