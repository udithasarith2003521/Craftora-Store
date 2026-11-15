import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { getAdminSessionFromRequest } from '@/lib/auth';

export async function POST(request: Request): Promise<NextResponse> {
  const session = await getAdminSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await request.json()) as HandleUploadBody;

  // If BLOB_READ_WRITE_TOKEN is not configured or mock during local dev testing
  if (!process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN.startsWith('vercel_blob_rw_xxx')) {
    // Return a mock token response if client is in test/demo mode
    if (body.type === 'blob.generate-client-token') {
      return NextResponse.json({
        type: 'blob.generate-client-token',
        clientToken: 'mock-client-token-for-dev',
      });
    }
  }

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        let payloadData: { uploadType?: 'image' | 'file' } = {};
        try {
          if (clientPayload) {
            payloadData = JSON.parse(clientPayload);
          }
        } catch {
          // ignore parsing error
        }

        const isImage = payloadData.uploadType === 'image';

        return {
          allowedContentTypes: isImage
            ? ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
            : [
                'application/zip',
                'application/x-zip-compressed',
                'application/x-rar-compressed',
                'application/vnd.rar',
                'application/pdf',
                'image/vnd.adobe.photoshop',
                'application/octet-stream',
                'application/gzip',
                'application/x-tar',
                'application/x-7z-compressed',
                'video/mp4',
                'audio/mpeg',
                'application/json',
                'text/plain',
              ],
          maximumSizeInBytes: isImage ? 5 * 1024 * 1024 : 500 * 1024 * 1024, // 5MB for images, 500MB for digital files
          tokenPayload: JSON.stringify({
            userId: session.username,
            uploadType: payloadData.uploadType,
          }),
        };
      },
      onUploadCompleted: async () => {
        // Upload completed hook
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
