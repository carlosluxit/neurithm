import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    const falKey = process.env.FAL_KEY
    if (!falKey || falKey === 'your_fal_key') {
      return NextResponse.json({ error: 'Fal AI key not configured' }, { status: 503 })
    }

    const response = await fetch('https://queue.fal.run/fal-ai/fast-sdxl', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${falKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: `${prompt}, dark background, futuristic, minimal, purple and blue color palette, digital art, abstract`,
        negative_prompt: 'text, watermark, blurry, low quality',
        image_size: 'landscape_16_9',
        num_inference_steps: 25,
        guidance_scale: 7.5,
        num_images: 1,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Fal AI error:', error)
      return NextResponse.json({ error: 'Image generation failed' }, { status: 500 })
    }

    const data = await response.json()
    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
