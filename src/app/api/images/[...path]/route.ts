/**
 * Custom Image Handler with Graceful Fallback
 * =============================================
 * Intercepts image requests and handles missing files gracefully
 * instead of returning 400 errors from Next.js Image Optimization
 */

import { NextRequest, NextResponse } from 'next/server';
import { existsSync, readFileSync } from 'fs';
import path from 'path';

// Transparent 1x1 PNG for placeholder/fallback
const PLACEHOLDER_PNG = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
  0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4,
  0x89, 0x00, 0x00, 0x00, 0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
  0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae,
  0x42, 0x60, 0x82,
]);

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    // Reconstruct the requested path
    const filePath = params.path.join('/');
    
    // Security check: prevent directory traversal
    if (filePath.includes('..')) {
      return new NextResponse('Not Found', { status: 404 });
    }

    // Try to resolve the file from public directory
    const fullPath = path.join(process.cwd(), 'public', filePath);
    
    // Check if file exists
    if (!existsSync(fullPath)) {
      // Return placeholder for missing files instead of 404/400
      return new NextResponse(PLACEHOLDER_PNG, {
        status: 200,
        headers: {
          'Content-Type': 'image/png',
          'Content-Length': PLACEHOLDER_PNG.length.toString(),
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    // Serve the actual file if it exists
    const buffer = readFileSync(fullPath);
    const mimeType = getMimeType(filePath);
    
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    // Return placeholder on any error
    return new NextResponse(PLACEHOLDER_PNG, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Length': PLACEHOLDER_PNG.length.toString(),
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }
}

function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.avif': 'image/avif',
    '.svg': 'image/svg+xml',
  };
  return mimeTypes[ext] || 'image/png';
}
