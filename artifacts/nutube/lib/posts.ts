import 'server-only';
import fs from 'fs';
import path from 'path';

export interface Post {
  slug: string;
  title: string;
  subtitle?: string;
  category: string;
  categoryLabel?: string;
  publishedAt: string;
  updatedAt?: string;
  summary?: string;
  body: string;
  tags?: string[];
  thumbnail?: string;
  author?: string;
}

const POSTS_DIR = path.join(process.cwd(), 'data', 'posts');

function readPostFile(filePath: string): Post | null {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);
    if (!data.slug || !data.title) return null;
    return data as Post;
  } catch {
    return null;
  }
}

export async function getAllPosts(): Promise<Post[]> {
  try {
    if (!fs.existsSync(POSTS_DIR)) return [];
    const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.json'));
    const posts = files
      .map((f) => readPostFile(path.join(POSTS_DIR, f)))
      .filter((p): p is Post => p !== null);
    return posts.sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''));
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const file = path.join(POSTS_DIR, `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  return readPostFile(file);
}

export async function getPostsByCategory(category: string): Promise<Post[]> {
  const all = await getAllPosts();
  return all.filter((p) => p.category === category);
}

export async function getRelatedPosts(slug: string, category: string, limit = 3): Promise<Post[]> {
  const all = await getAllPosts();
  return all.filter((p) => p.slug !== slug && p.category === category).slice(0, limit);
}
