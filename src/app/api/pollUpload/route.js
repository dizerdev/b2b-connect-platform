import { pollUpload } from 'lib/uploadthingService';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const fileKey = url.searchParams.get('fileKey');

    const data = await pollUpload(fileKey);
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
