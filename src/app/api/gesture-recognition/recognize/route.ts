import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@/utils/supabase/server';

const BUCKET_NAME = 'gestures';

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const image = formData.get('image') as File;
    const language = formData.get('language') as string;

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    if (!language || !['ASL', 'MSL'].includes(language)) {
      return NextResponse.json(
        { error: 'Invalid language specified' },
        { status: 400 }
      );
    }

    // Convert the image to a buffer
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate a unique filename with user folder structure
    const fileExtension = image.name.split('.').pop() || 'jpg';
    const filename = `${user.id}/${language.toLowerCase()}/${uuidv4()}.${fileExtension}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filename, buffer, {
        contentType: image.type || 'image/jpeg',
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload image' },
        { status: 500 }
      );
    }

    // Get the public URL for the uploaded file
    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filename);

    // Mock response for development - integrate with AI model for production
    return NextResponse.json({
      word: 'Hello',
      confidence: 0.95,
      imageUrl: publicUrl,
      storagePath: uploadData.path,
    });
  } catch (error) {
    console.error('Error processing gesture recognition:', error);
    return NextResponse.json(
      { error: 'Failed to process gesture recognition' },
      { status: 500 }
    );
  }
}
