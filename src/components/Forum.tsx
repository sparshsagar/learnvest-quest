import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { MessageCircle, Plus } from "lucide-react";
import { CreatePostDialog } from "./CreatePostDialog";
import { ForumPost } from "./ForumPost";
import { Skeleton } from "./ui/skeleton";

export const Forum = () => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  const { data: posts, isLoading } = useQuery({
    queryKey: ["forum-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("forum_posts")
        .select(`
          *,
          profiles:profiles(username),
          comments:post_comments(count)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Community Forum</h2>
        <Button onClick={() => setIsCreatePostOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="beginner">Beginner</TabsTrigger>
          <TabsTrigger value="expert">Expert</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-4">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="p-4 border rounded-lg space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))
          ) : posts?.map((post) => (
            <ForumPost key={post.id} post={post} />
          ))}
        </TabsContent>

        <TabsContent value="beginner" className="space-y-4 mt-4">
          {isLoading ? (
            <Skeleton className="h-32" />
          ) : (
            posts
              ?.filter((post) => post.category === "beginner")
              .map((post) => <ForumPost key={post.id} post={post} />)
          )}
        </TabsContent>

        <TabsContent value="expert" className="space-y-4 mt-4">
          {isLoading ? (
            <Skeleton className="h-32" />
          ) : (
            posts
              ?.filter((post) => post.category === "expert")
              .map((post) => <ForumPost key={post.id} post={post} />)
          )}
        </TabsContent>
      </Tabs>

      <CreatePostDialog
        open={isCreatePostOpen}
        onOpenChange={setIsCreatePostOpen}
      />
    </div>
  );
};