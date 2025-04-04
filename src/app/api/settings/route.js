// app/api/settings/route.js
import { NextResponse } from 'next/server';
import connectDb from '../../../../utils/connectDb';
import SiteSetting from '../../../../utils/models/SiteSetting';



// GET handler for fetching site settings
export async function GET() {
  try {
    await connectDb();
    
    // Check authentication
    
    // Fetch settings from MongoDB
    // Typically there's just one settings document
    const settings = await SiteSetting.findOne({}).lean()

    if (!settings) {
      return NextResponse.json({ 
        success: false, 
        message: 'Settings not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      data: settings 
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Server error' 
    }, { status: 500 });
  }
}

// PATCH handler for updating site settings
export async function PATCH(request) {
  try {
    await connectDb();
    
  

    // Parse request body
    const updatedSettings = await request.json();
    
    // Validate settings (implement according to your schema requirements)
    
    // Update settings in MongoDB
    // Using findOneAndUpdate with upsert:true to create if it doesn't exist
    const result = await SiteSetting.findOneAndUpdate(
      {}, // Empty filter to match the single settings document
      { $set: updatedSettings },
      { 
        new: true, // Return updated document
        upsert: true, // Create if doesn't exist
        runValidators: true // Run schema validators
      }
    );

    return NextResponse.json({ 
      success: true, 
      data: result 
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Server error'
    }, { status: 500 });
  }
}