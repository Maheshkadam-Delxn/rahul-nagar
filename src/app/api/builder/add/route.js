import connectDb from '../../../../../utils/connectDb';
import Builder from '../../../../../utils/models/builder';

export async function POST(request) {
  try {
    await connectDb();
    const data = await request.json();
    const newBuilder = new Builder(data);
    await newBuilder.save();
    return Response.json({ success: true, builder: newBuilder });
  } catch (error) {
    console.error('Error adding builder:', error);
    return Response.json({ error: 'Failed to add builder' }, { status: 500 });
  }
}