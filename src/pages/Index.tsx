import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Lessons } from "@/components/Lessons";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
        <Lessons />
      )}
    </main>
  );
};

export default Index;