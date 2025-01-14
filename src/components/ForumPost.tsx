import { MessageCircle, ThumbsUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";

interface ForumPostProps {
  post: {
    id: string;
    title: string;
    content: string;
    category: "beginner" | "expert";
    created_at: string;
    profiles: {
      username: string | null;
    };
    comments: {
      count: number;
    }[];
  };
}

export const ForumPost = ({ post }: ForumPostProps) => {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-lg">{post.title}</h3>
            <Badge variant={post.category === "beginner" ? "secondary" : "default"}>
              {post.category}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{post.content}</p>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>Posted by {post.profiles.username || "Anonymous"}</span>
            <span>{formatDistanceToNow(new Date(post.created_at))} ago</span>
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4" />
              <span>{post.comments[0]?.count || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};