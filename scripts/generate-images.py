#!/usr/bin/env python3
"""Generate AI images for whitepapers using fal.ai API."""

import json
import os
import time
import urllib.request

FAL_KEY = "9525b57b-0db4-41de-a5c5-411df45680a8:520137647c92e73792d11f562245a829"
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'public', 'whitepapers', 'images')

PROMPTS = {
    # Cover images (landscape, dramatic)
    'cover-state-of-ai': 'Abstract futuristic data visualization, flowing neural network streams, glowing purple and indigo data points connected by light beams, dark void background, cinematic, ultra detailed, digital art masterpiece',
    'cover-agent-architecture': 'Abstract architectural blueprint of AI neural pathways, geometric nodes connected by luminous purple circuits, dark space background, technical precision, futuristic, digital art masterpiece',
    'cover-ai-governance': 'Abstract balanced scales made of light and data streams, symmetrical geometric patterns, purple and blue energy flows, dark background, ethereal, digital art masterpiece',

    # Section images (square, abstract)
    'section-healthcare': 'Abstract medical AI visualization, DNA helix intertwined with circuit patterns, soft purple glow, dark background, minimalist, digital art',
    'section-finance': 'Abstract financial data streams, ascending graph patterns made of light particles, purple and gold accents, dark background, minimalist, digital art',
    'section-legal': 'Abstract document intelligence, pages transforming into luminous data patterns, purple light beams, dark background, minimalist, digital art',
    'section-ecommerce': 'Abstract e-commerce AI, shopping interface fragments floating in digital space, purple neon accents, dark background, minimalist, digital art',
    'section-agents': 'Abstract AI agent network, multiple luminous orbs connected by energy streams, orchestrated movement, purple and indigo, dark background, digital art',
    'section-governance': 'Abstract governance framework, interlocking geometric shields and checkmarks made of light, purple energy, dark background, minimalist, digital art',
}

def generate_image(prompt_key, prompt):
    """Generate an image using fal.ai API."""
    print(f'  Generating: {prompt_key}...')

    # Determine size based on type
    is_cover = 'cover' in prompt_key
    image_size = 'landscape_16_9' if is_cover else 'square_hd'

    data = json.dumps({
        'prompt': f'{prompt}, dark background #050510, futuristic, minimal, purple #7c5cfc and blue #818cf8 color palette',
        'negative_prompt': 'text, watermark, blurry, low quality, letters, words, writing, logo, signature',
        'image_size': image_size,
        'num_inference_steps': 28,
        'guidance_scale': 7.5,
        'num_images': 1,
    }).encode('utf-8')

    # Submit to queue
    req = urllib.request.Request(
        'https://queue.fal.run/fal-ai/fast-sdxl',
        data=data,
        headers={
            'Authorization': f'Key {FAL_KEY}',
            'Content-Type': 'application/json',
        },
        method='POST'
    )

    try:
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode())
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        print(f'    Error: {e.code} - {error_body[:200]}')
        return None

    # Check if queued (status URL) or immediate result
    if 'request_id' in result:
        request_id = result['request_id']
        status_url = result.get('response_url', f'https://queue.fal.run/fal-ai/fast-sdxl/requests/{request_id}')

        # Poll for completion
        for attempt in range(30):
            time.sleep(2)
            status_req = urllib.request.Request(
                status_url,
                headers={'Authorization': f'Key {FAL_KEY}'},
            )
            try:
                with urllib.request.urlopen(status_req) as resp:
                    status_data = json.loads(resp.read().decode())
                    if 'images' in status_data:
                        result = status_data
                        break
                    elif status_data.get('status') == 'COMPLETED':
                        result = status_data
                        break
            except:
                continue
        else:
            print(f'    Timeout waiting for {prompt_key}')
            return None

    # Download the image
    if 'images' in result and len(result['images']) > 0:
        image_url = result['images'][0]['url']
        output_path = os.path.join(OUTPUT_DIR, f'{prompt_key}.png')

        urllib.request.urlretrieve(image_url, output_path)
        file_size = os.path.getsize(output_path)
        print(f'    Saved: {output_path} ({file_size // 1024}KB)')
        return output_path
    else:
        print(f'    No images in response: {json.dumps(result)[:200]}')
        return None


if __name__ == '__main__':
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print('Generating whitepaper images with fal.ai...\n')

    results = {}
    for key, prompt in PROMPTS.items():
        path = generate_image(key, prompt)
        results[key] = path
        time.sleep(1)  # Rate limiting

    print(f'\nDone! Generated {sum(1 for v in results.values() if v)} / {len(PROMPTS)} images')
