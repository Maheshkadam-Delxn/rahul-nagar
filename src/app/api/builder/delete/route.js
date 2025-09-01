import connectDb from '../../../../../utils/connectDb';
import Builder from '../../../../../utils/models/builder';

export async function DELETE(request) {
  try {
    await connectDb();
    const data = await request.json();
    const { builderId } = data;
    const deletedBuilder = await Builder.findByIdAndDelete(builderId);
    if (!deletedBuilder) {
      return Response.json({ error: 'Builder not found' }, { status: 404 });
    }
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting builder:', error);
    return Response.json({ error: 'Failed to delete builder' }, { status: 500 });
  }
}