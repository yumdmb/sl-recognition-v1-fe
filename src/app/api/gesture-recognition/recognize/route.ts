import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;
    const language = formData.get('language') as string;

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
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

    // Generate a unique filename
    const filename = `${uuidv4()}.${image.name.split('.').pop()}`;
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    const filepath = join(uploadDir, filename);

    // Save the file
    await writeFile(filepath, buffer);

    // Mock response for development - integrate with AI model for production
    return NextResponse.json({
      word: "Hello",
      confidence: 0.95,
      imageUrl: `/uploads/${filename}`
    });

  } catch (error) {
    console.error('Error processing gesture recognition:', error);
    return NextResponse.json(
      { error: 'Failed to process gesture recognition' },
      { status: 500 }
    );
  }
} 