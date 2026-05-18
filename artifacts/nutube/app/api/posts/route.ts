import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/posts';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const limit = parseInt(searchParams.get('limit') || '0', 10);

  let posts = await getAllPosts();
  if (category) posts = posts.filter((p) => p.category === category);
  if (limit > 0) posts = posts.slice(0, limit);

  return NextResponse.json({
    success: true,
    data: posts,
    total: posts.length,
  });
}
