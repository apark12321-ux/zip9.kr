
import { Post } from "../types";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Clock, User, Calendar } from "lucide-react";
import { motion } from "motion/react";

interface PostCardProps {
  post: Post;
  onClick: (id: string) => void;
}

export function PostCard({ post, onClick }: PostCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card 
        id={`post-${post.id}`}
        className="overflow-hidden h-full cursor-pointer border-none shadow-sm hover:shadow-xl transition-all duration-300 group"
        onClick={() => onClick(post.id)}
      >
        <div className="relative aspect-[16/9] overflow-hidden">
          <img 
            src={post.image} 
            alt={post.title}
            referrerPolicy="no-referrer"
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-4 left-4">
            <Badge className="bg-indigo-600 hover:bg-indigo-700 border-none px-3 py-1 text-xs font-semibold">
              {post.category}
            </Badge>
          </div>
        </div>
        <CardHeader className="p-6 pb-2">
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
          </div>
          <h3 className="text-xl font-bold leading-tight group-hover:text-indigo-600 transition-colors text-gray-900 line-clamp-2">
            {post.title}
          </h3>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-0">
          <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">
            {post.excerpt}
          </p>
          <div className="mt-4 flex items-center gap-2 pt-4 border-t">
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              <User className="w-3 h-3 text-gray-500" />
            </div>
            <span className="text-xs font-medium text-gray-600">{post.author}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
