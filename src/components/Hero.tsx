import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
  return (
    <section className="pt-32 pb-24 overflow-hidden">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-2 mb-6 text-sm font-semibold tracking-wider text-primary uppercase rounded-full bg-primary/10 animate-fade-in">
            Your Journey to Financial Freedom
          </span>
          <h1 className="mb-8 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl animate-fade-up [--animation-delay:200ms]">
            Learn to invest
            <span className="block text-primary">confidently</span>
          </h1>
          <p className="max-w-xl mx-auto mb-10 text-lg text-muted-foreground animate-fade-up [--animation-delay:400ms]">
            Master investing basics through bite-sized lessons. Join thousands of beginners on their journey to financial independence.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up [--animation-delay:600ms]">
            <Button size="lg" className="glass-button w-full sm:w-auto">
              Start Learning Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              View Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};