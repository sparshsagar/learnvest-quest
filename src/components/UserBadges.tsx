import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type UserBadge = {
  id: string;
  name: string;
  description: string;
  earned_at: string;
};

export const UserBadges = ({ userId }: { userId: string }) => {
  const { data: badges = [], isLoading } = useQuery({
    queryKey: ["user-badges", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_badges")
        .select(`
          id,
          earned_at,
          badges (
            name,
            description
          )
        `)
        .eq("user_id", userId);

      if (error) throw error;

      return data.map((badge: any) => ({
        id: badge.id,
        name: badge.badges.name,
        description: badge.badges.description,
        earned_at: new Date(badge.earned_at).toLocaleDateString(),
      }));
    },
    enabled: !!userId,
  });

  if (isLoading) {
    return <div>Loading badges...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Your Badges
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {badges.length === 0 ? (
            <p className="text-sm text-muted-foreground">Complete lessons to earn badges!</p>
          ) : (
            badges.map((badge) => (
              <div key={badge.id} className="flex items-start gap-2">
                <Badge variant="secondary" className="mt-1">
                  <Trophy className="h-3 w-3 mr-1" />
                </Badge>
                <div>
                  <h4 className="text-sm font-medium">{badge.name}</h4>
                  <p className="text-xs text-muted-foreground">{badge.description}</p>
                  <p className="text-xs text-muted-foreground">Earned: {badge.earned_at}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};