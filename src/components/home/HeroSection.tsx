import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Truck, Shield, Clock } from 'lucide-react';
import heroImage from '@/assets/hero-printing.jpg';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden gradient-hero">
      {/* Enhanced Background Pattern with Parallax Effect */}
      <div className="absolute inset-0 opacity-30 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-secondary/15 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }} />
        
        {/* Animated Geometric Shapes */}
        <div className="absolute top-32 right-1/4 w-4 h-4 border-2 border-primary/30 rotate-45 animate-spin" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-32 left-1/4 w-6 h-6 border-2 border-accent/30 animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }} />
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-primary/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6 lg:space-y-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Premium Quality Printing</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              <span className="inline-block animate-slide-up">Print Your</span>
              <span className="text-gradient block animate-slide-up" style={{ animationDelay: '0.2s' }}>Vision Into Reality</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg">
              From business cards to banners, we deliver high-quality prints with 
              lightning-fast turnaround. Upload your design and get it printed today!
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/products">
                <Button variant="hero" size="xl">
                  Explore Products
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/bulk-orders">
                <Button variant="outline" size="xl">
                  Bulk Order Quote
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-success" />
                </div>
                <span>Quality Guaranteed</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Truck className="h-4 w-4 text-primary" />
                </div>
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-accent" />
                </div>
                <span>24h Express</span>
              </div>
            </div>
          </div>

          {/* Enhanced Image Section */}
          <div className="relative animate-fade-in" style={{ animationDelay: '0.3s' }}>
            {/* Animated Background Elements */}
            <div className="absolute -inset-4 opacity-30">
              <div className="absolute top-0 left-0 w-20 h-20 bg-primary/30 rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
              <div className="absolute top-10 right-0 w-16 h-16 bg-accent/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute bottom-0 left-10 w-12 h-12 bg-secondary/30 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            {/* Main Image Container with 3D Effect */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-secondary rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
              <div className="relative rounded-2xl overflow-hidden shadow-floating transform transition-all duration-500 hover:scale-105 hover:rotate-1">
                <img
                  src={heroImage}
                  alt="Professional printing services - business cards, brochures, and banners"
                  className="w-full h-auto object-cover transition-transform duration-700 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
                
                {/* Animated Overlay Pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-4 left-4 w-8 h-8 border-2 border-primary rounded-full animate-spin" style={{ animationDuration: '3s' }} />
                  <div className="absolute top-8 right-8 w-6 h-6 border-2 border-accent rounded-full animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }} />
                  <div className="absolute bottom-8 left-8 w-4 h-4 border-2 border-secondary rounded-full animate-spin" style={{ animationDuration: '2s' }} />
                </div>
              </div>
            </div>

            {/* Enhanced Floating Stats Card */}
            <div className="absolute -bottom-6 -left-6 bg-card/95 backdrop-blur-sm rounded-xl p-4 shadow-floating animate-float border border-primary/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center relative overflow-hidden">
                  <span className="text-primary-foreground font-heading font-bold text-lg relative z-10">10K+</span>
                  <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Happy Customers</p>
                  <p className="text-sm text-muted-foreground">Across India</p>
                </div>
              </div>
            </div>

            {/* Enhanced Floating Badge */}
            <div className="absolute -top-4 -right-4 bg-gradient-to-r from-accent to-accent/80 text-accent-foreground rounded-full px-4 py-2 shadow-lg animate-float border-2 border-white/20" style={{ animationDelay: '1s' }}>
              <span className="font-semibold text-sm relative">
                Up to 30% OFF
                <div className="absolute -inset-1 bg-white/20 rounded-full animate-pulse" style={{ animationDuration: '1.5s' }} />
              </span>
            </div>

            {/* New Floating Quality Badge */}
            <div className="absolute top-1/2 -left-8 bg-gradient-to-r from-success to-success/80 text-success-foreground rounded-full px-3 py-2 shadow-lg animate-float transform -rotate-12" style={{ animationDelay: '2s' }}>
              <span className="font-semibold text-xs">Premium Quality</span>
            </div>

            {/* Floating Delivery Badge */}
            <div className="absolute bottom-1/3 -right-8 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-full px-3 py-2 shadow-lg animate-float transform rotate-12" style={{ animationDelay: '2.5s' }}>
              <span className="font-semibold text-xs">24h Delivery</span>
            </div>

            {/* Animated Corner Decorations */}
            <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-primary animate-pulse" />
            <div className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2 border-accent animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="absolute -bottom-2 -left-2 w-4 h-4 border-l-2 border-b-2 border-secondary animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-primary animate-pulse" style={{ animationDelay: '1.5s' }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
