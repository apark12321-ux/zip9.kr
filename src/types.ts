
export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: "청약/분양" | "전월세" | "이사/인테리어" | "대출/금융";
  author: string;
  date: string;
  image: string;
  readTime: string;
  hashtags?: string[];
}

export type Category = Post["category"];
