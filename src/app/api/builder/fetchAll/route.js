import Builder from '../../../../../utils/models/builder';
import connectDb from '../../../../../utils/connectDb';
export async function GET(request) {
  try {
    await connectDb();
    const builders = await Builder.find({}).sort({ createdAt: -1 });
    return Response.json({ success: true, builders });
  } catch (error) {
    console.error('Error fetching builders:', error);
    return Response.json({ error: 'Failed to fetch builders' }, { status: 500 });
  }
}