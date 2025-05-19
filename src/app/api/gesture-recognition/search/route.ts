import { NextRequest, NextResponse } from 'next/server';

type GestureDatabase = {
  [key: string]: {
    [key: string]: string;
  };
};

// Mock database of gesture images
const mockGestureDatabase: GestureDatabase = {
  ASL: {
    "hello": "/gestures/asl/hello.jpg",
    "thank you": "/gestures/asl/thank-you.jpg",
    "please": "/gestures/asl/please.jpg",
    "goodbye": "/gestures/asl/goodbye.jpg",
    "yes": "/gestures/asl/yes.jpg",
    "no": "/gestures/asl/no.jpg",
  },
  MSL: {
    "hello": "/gestures/msl/hello.jpg",
    "thank you": "/gestures/msl/thank-you.jpg",
    "please": "/gestures/msl/please.jpg",
    "goodbye": "/gestures/msl/goodbye.jpg",
    "yes": "/gestures/msl/yes.jpg",
    "no": "/gestures/msl/no.jpg",
  }
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const word = searchParams.get('word')?.toLowerCase();
    const language = searchParams.get('language');

    if (!word) {
      return NextResponse.json(
        { error: 'No word provided' },
        { status: 400 }
      );
    }

    if (!language || !['ASL', 'MSL'].includes(language)) {
      return NextResponse.json(
        { error: 'Invalid language specified' },
        { status: 400 }
      );
    }

    // Search for the word in our mock database
    const imageUrl = mockGestureDatabase[language][word];

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Gesture not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      word,
      language,
      imageUrl
    });

  } catch (error) {
    console.error('Error searching for gesture:', error);
    return NextResponse.json(
      { error: 'Failed to search for gesture' },
      { status: 500 }
    );
  }
} 