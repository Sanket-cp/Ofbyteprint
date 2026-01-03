import { Truck, Palette, Headphones, Shield, Clock, IndianRupee } from 'lucide-react';

const features = [
  {
    icon: <Palette className="h-6 w-6" />,
    title: 'Premium Quality',
    description: 'We use the finest papers and inks to deliver prints that stand out.',
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: 'Express Delivery',
    description: '24-hour express printing available for urgent orders.',
  },
  {
    icon: <IndianRupee className="h-6 w-6" />,
    title: 'Best Prices',
    description: 'Competitive pricing with bulk discounts up to 30% off.',
  },
  {
    icon: <Truck className="h-6 w-6" />,
    title: 'Free Shipping',
    description: 'Free delivery across India on orders above ₹999.',
  },
  {
    icon: <Headphones className="h-6 w-6" />,
    title: 'Dedicated Support',
    description: 'Our team is always ready to help with your queries.',
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: '100% Satisfaction',
    description: 'Not happy? Get a full refund or reprint - no questions asked.',
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Why Choose Us</span>
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-4">
            Printing Made Simple & Reliable
          </h2>
          <p className="text-muted-foreground">
            We've helped thousands of businesses and individuals bring their ideas to life through quality prints.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-elevated transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
