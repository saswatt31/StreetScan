import { NextRequest, NextResponse } from 'next/server'

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const backendForm = new FormData()
    backendForm.append('file', file)

    const response = await fetch(`${FASTAPI_URL}/detect`, {
      method: 'POST',
      body: backendForm,
    })

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`)
    }

    // FastAPI returns JSON with base64 image inside
    const data = await response.json()

    console.log('Keys from FastAPI:', Object.keys(data))
    console.log('Image prefix:', data.annotated_image_base64?.slice(0, 40))

    return NextResponse.json({
      detections: data.detections ?? [],
      annotated_image_base64: data.annotated_image_base64 ?? null,
      pothole_count: data.pothole_count ?? 0,
    })

  } catch (error) {
    console.error('Detection route error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Detection failed' },
      { status: 500 }
    )
  }
}
