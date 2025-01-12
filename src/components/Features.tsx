import { BookOpen, Trophy, Users } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Bite-sized Lessons",
    description: "Learn complex investing concepts through simple, digestible lessons designed for beginners."
  },
  {
    icon: Trophy,
    title: "Gamification",
    description: "Earn points and badges as you progress through lessons and master new concepts."
  },
  {
    icon: Users,
    title: "Community",
    description: "Join a community of learners, share experiences, and grow together."
  }
];

export const Features = () => {
  return (
    <section id="features" className="py-24 bg-secondary/50">
      <div className="container px-4 mx-auto">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Everything you need to start investing
          </h2>
          <p className="text-lg text-muted-foreground">
            Our platform provides all the tools and knowledge you need to begin your investment journey.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass-card rounded-xl p-8 transition-all duration-300 hover:translate-y-[-4px]"
              style={{
                animationDelay: `${index * 200}ms`,
              }}
            >
              <feature.icon className="h-12 w-12 text-primary mb-6" />
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};