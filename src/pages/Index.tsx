import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Lessons } from "@/components/Lessons";
import { Forum } from "@/components/Forum";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <main className="min-h-screen">
      <Header />
      {!isAuthenticated ? (
        <>
          <Hero />
          <Features />
        </>
      ) : (
        <div className="pt-16">
          <Lessons />
          <Forum />
        </div>
      )}
    </main>
  );
};

export default Index;