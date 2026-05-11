import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import firebaseConfig from "./firebase-applet-config.json" assert { type: "json" };
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
if (!getApps().length) {
  initializeApp({
    projectId: firebaseConfig.projectId,
  });
}

const db = getFirestore(firebaseConfig.firestoreDatabaseId);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Blog Studio API Endpoint
  app.post("/api/posts", async (req, res) => {
    const apiKey = req.headers["x-api-key"];
    const serverApiKey = process.env.BLOG_STUDIO_API_KEY;

    if (!serverApiKey) {
      console.warn("BLOG_STUDIO_API_KEY not set in environment.");
    }

    if (serverApiKey && apiKey !== serverApiKey) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { slug, title, category, summary, content } = req.body;

    if (!title || !content?.body) {
      return res.status(400).json({ error: "Missing required fields: title and content.body" });
    }

    // Generate a SEO-friendly slug from title if slug is not provided
    const generateSlug = (title: string) => {
      return title
        .toLowerCase()
        .replace(/[^a-z0-9가-힣\s-]/g, "") // Remove special characters except Korean
        .trim()
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .substring(0, 100); // Limit length
    };

    const postId = slug || generateSlug(title) || `post-${Date.now()}`;
    
    // Simple category mapping or fallback
    const validCategories = ["청약/분양", "전월세", "이사/인테리어", "대출/금융"];
    let finalCategory = category;
    if (!validCategories.includes(category)) {
      // Try to map or fallback to first one
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
      console.log(`Post ${postId} created successfully.`);
      res.json({ success: true, id: postId });
    } catch (error) {
      console.error("Error saving post to Firestore:", error);
      res.status(500).json({ error: "Failed to save post" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
