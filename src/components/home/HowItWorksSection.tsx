import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Upload, Settings, Truck, Check } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: <Settings className="h-6 w-6" />,
    title: 'Choose Product',
    description: 'Select your product and customize size, paper, quantity, and finishing options.',
  },
  {
    number: '02',
    icon: <Upload className="h-6 w-6" />,
    title: 'Upload Design',
    description: 'Upload your design file (PDF, PNG, or JPG) or use our design templates.',
  },
  {
    number: '03',
    icon: <Check className="h-6 w-6" />,
    title: 'Review & Pay',
    description: 'Review your order, see live pricing, and complete secure payment.',
  },
  {
    number: '04',
    icon: <Truck className="h-6 w-6" />,
    title: 'Get Delivered',
    description: 'Sit back and relax! Your order will be delivered to your doorstep.',
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Simple Process</span>
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground">
            Get your prints in 4 simple steps. Easy ordering, fast delivery!
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary via-primary to-primary/30" />

          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative text-center group animate-slide-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Step Circle */}
              <div className="relative inline-flex mb-6">
                <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-primary-foreground shadow-glow group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
                <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent text-accent-foreground text-sm font-bold flex items-center justify-center">
                  {step.number}
                </span>
              </div>

              <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link to="/products">
            <Button variant="hero" size="lg">
              Start Your Order
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
