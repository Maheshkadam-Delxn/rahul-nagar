import connectDb from '../../../../../utils/connectDb';
import Builder from '../../../../../utils/models/builder';

export async function PUT(request) {
  try {
    await connectDb();
    const data = await request.json();
    const { builderId, ...updateData } = data;
    const updatedBuilder = await Builder.findByIdAndUpdate(builderId, updateData, { new: true, runValidators: true });
    if (!updatedBuilder) {
      return Response.json({ error: 'Builder not found' }, { status: 404 });
    }
    return Response.json({ success: true, builder: updatedBuilder });
  } catch (error) {
    console.error('Error updating builder:', error);
    return Response.json({ error: 'Failed to update builder' }, { status: 500 });
  }
}