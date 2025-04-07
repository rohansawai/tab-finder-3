import { NextRequest, NextResponse } from 'next/server';

// Use environment variables instead of hardcoded values
const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY || '';
const HUGGING_FACE_ENDPOINT = process.env.HUGGING_FACE_ENDPOINT || 'https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2';

export async function POST(request: NextRequest) {
  try {
    // Check if API key is available
    if (!HUGGING_FACE_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const { text } = await request.json();
    
    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const response = await fetch(HUGGING_FACE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`
      },
      body: JSON.stringify({ inputs: text })
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `API request failed: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ embedding: data[0] });
  } catch (error) {
    console.error('Error in embedding API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 