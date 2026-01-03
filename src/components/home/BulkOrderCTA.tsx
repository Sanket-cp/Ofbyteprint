import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Building2, Users, Factory } from 'lucide-react';

const BulkOrderCTA = () => {
  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-primary opacity-95" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZ2LTRoLTJ2NGgyem0tNiA2di00aC00djRoNHptMC02di00aC00djRoNHptLTYgNnYtNGgtMnY0aDJ6bTAtNnYtNGgtMnY0aDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-primary-foreground space-y-6">
            <h2 className="font-heading text-3xl lg:text-5xl font-bold leading-tight">
              Need Bulk Printing?<br />
              <span className="opacity-90">We've Got You Covered!</span>
            </h2>
            <p className="text-lg opacity-90 max-w-lg">
              Get special discounts on large orders. Perfect for businesses, events, 
              and organizations. Our dedicated team will handle your bulk requirements with care.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/bulk-orders">
                <Button variant="accent" size="xl">
                  Request Quote
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <a href="tel:+919876543210">
                <Button variant="outline" size="xl" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                  Call Now
                </Button>
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 border border-primary-foreground/20">
              <Building2 className="h-8 w-8 text-primary-foreground mb-3" />
              <h3 className="font-heading text-3xl font-bold text-primary-foreground">500+</h3>
              <p className="text-primary-foreground/80">Corporate Clients</p>
            </div>
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 border border-primary-foreground/20">
              <Users className="h-8 w-8 text-primary-foreground mb-3" />
              <h3 className="font-heading text-3xl font-bold text-primary-foreground">10K+</h3>
              <p className="text-primary-foreground/80">Orders Delivered</p>
            </div>
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 border border-primary-foreground/20 col-span-2">
              <Factory className="h-8 w-8 text-primary-foreground mb-3" />
              <h3 className="font-heading text-3xl font-bold text-primary-foreground">Up to 30% OFF</h3>
              <p className="text-primary-foreground/80">On bulk orders above 5000 units</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BulkOrderCTA;
