import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Accessing secrets from environment variables (Set these in Vercel Dashboard)
// For Firebase Admin, we usually need a Service Account JSON.
// However, if we just use the Project ID and it's already configured in Google Cloud, sometimes it works.
// On Vercel, it's best to paste the Service Account JSON into an env var.

const firebaseConfig = {
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  firestoreDatabaseId: process.env.VITE_FIREBASE_DATABASE_ID
};

if (!getApps().length) {
  // If we have a service account key, we should use it. 
  // For now, let's assume valid ADC or provide a fallback.
  initializeApp({
    projectId: firebaseConfig.projectId,
  });
}

const db = getFirestore(firebaseConfig.firestoreDatabaseId || "(default)");

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = req.headers["x-api-key"];
  const serverApiKey = process.env.BLOG_STUDIO_API_KEY;

  if (serverApiKey && apiKey !== serverApiKey) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { slug, title, category, summary, content } = req.body;

  if (!title || !content?.body) {
    return res.status(400).json({ error: "Missing required fields: title and content.body" });
  }

  const generateSlug = (t: string) => {
    return t
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .substring(0, 100);
  };

  const postId = slug || generateSlug(title) || `post-${Date.now()}`;
  const validCategories = ["청약/분양", "전월세", "이사/인테리어", "대출/금융"];
  let finalCategory = category;
  if (!validCategories.includes(category)) {
    finalCategory = "청약/분양";
  }

  const newPost = {
    id: postId,
    title,
    excerpt: summary || "",
    content: content.body,
    category: finalCategory,
    author: "Blog Studio",
    date: new Date().toISOString().split('T')[0],
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800",
    readTime: "5분"
  };

  try {
    await db.collection("posts").doc(postId).set(newPost);
    return res.json({ success: true, id: postId });
  } catch (error) {
    console.error("Error saving post to Firestore:", error);
    return res.status(500).json({ error: "Failed to save post" });
  }
}
