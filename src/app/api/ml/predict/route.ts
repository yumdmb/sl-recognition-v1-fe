import { NextRequest, NextResponse } from 'next/server';

// EC2 ML API URLs (server-side, no CORS/mixed content issues)
const ASL_API_URL = process.env.ML_API_URL;
const MSL_API_URL = process.env.MSL_API_URL; 

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const language = formData.get('language')?.toString() || 'ASL';
    
    // Select API URL based on language
    const apiUrl = language === 'MSL' ? MSL_API_URL : ASL_API_URL;
    
    // Forward the request to appropriate EC2 ML API
    const response = await fetch(`${apiUrl}/predict-image/`, {
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
