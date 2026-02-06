import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <img
          src="/assets/generated/imazu-hero.dim_1600x600.png"
          alt="Premium Watches"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-6 px-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
              Timeless Elegance
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our curated collection of premium watches crafted for those who appreciate fine craftsmanship
            </p>
            <Button size="lg" onClick={() => navigate({ to: '/catalog' })} className="text-lg px-8">
              Browse Collection
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      <section className="container px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <span className="text-3xl">⌚</span>
            </div>
            <h3 className="text-xl font-semibold">Premium Quality</h3>
            <p className="text-muted-foreground">
              Each timepiece is carefully selected for its exceptional quality and craftsmanship
            </p>
          </div>
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <span className="text-3xl">🚚</span>
            </div>
            <h3 className="text-xl font-semibold">Fast Delivery</h3>
            <p className="text-muted-foreground">
              Quick and secure delivery to your doorstep across Pakistan
            </p>
          </div>
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <span className="text-3xl">💳</span>
            </div>
            <h3 className="text-xl font-semibold">Flexible Payment</h3>
            <p className="text-muted-foreground">
              Cash on delivery or convenient online payment options available
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
