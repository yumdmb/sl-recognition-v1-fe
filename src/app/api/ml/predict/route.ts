import { NextRequest, NextResponse } from 'next/server';

// EC2 ML API URL (server-side, no CORS/mixed content issues)
const ML_API_URL = process.env.ML_API_URL || 'http://54.169.39.128';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Forward the request to EC2 ML API
    const response = await fetch(`${ML_API_URL}/predict-image/`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ML API error:', errorText);
      return NextResponse.json(
        { error: 'ML API request failed', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error calling ML API:', error);
    return NextResponse.json(
      { error: 'Failed to connect to ML API' },
      { status: 500 }
    );
  }
}
