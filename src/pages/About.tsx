import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Target, Eye, Award, Users, Printer, Clock, ArrowRight } from 'lucide-react';
import WhyChooseUsSection from '@/components/about/WhyChooseUsSection';

const About = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="gradient-primary py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
            About PrintHub
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Your trusted partner for all printing needs since 2015. We bring your ideas to life with quality prints.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary font-medium text-sm uppercase tracking-wider">Our Story</span>
              <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-6">
                From a Small Shop to India's Trusted Print Partner
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  PrintHub started in 2015 with a simple mission: to make professional printing accessible to everyone. 
                  What began as a small shop in Kolkata has now grown into one of India's most trusted online printing platforms.
                </p>
                <p>
                  Today, we serve over 10,000 happy customers across India, from startups to large enterprises. 
                  Our state-of-the-art printing facility and dedicated team ensure that every order meets our high quality standards.
                </p>
                <p>
                  We believe in the power of print to make lasting impressions. Whether it's a business card that opens doors 
                  or a banner that catches eyes, we're here to help you make your mark.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card rounded-xl border border-border p-6 text-center">
                <h3 className="font-heading text-4xl font-bold text-primary">10K+</h3>
                <p className="text-muted-foreground text-sm">Happy Customers</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-6 text-center">
                <h3 className="font-heading text-4xl font-bold text-primary">50K+</h3>
                <p className="text-muted-foreground text-sm">Orders Delivered</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-6 text-center">
                <h3 className="font-heading text-4xl font-bold text-primary">8+</h3>
                <p className="text-muted-foreground text-sm">Years Experience</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-6 text-center">
                <h3 className="font-heading text-4xl font-bold text-primary">500+</h3>
                <p className="text-muted-foreground text-sm">Corporate Clients</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card rounded-2xl border border-border p-8">
              <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground mb-6">
                <Target className="h-7 w-7" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-foreground mb-4">Our Mission</h3>
              <p className="text-muted-foreground">
                To democratize professional printing by making it affordable, accessible, and hassle-free for 
                businesses and individuals across India. We strive to deliver exceptional quality with every print.
              </p>
            </div>
            <div className="bg-card rounded-2xl border border-border p-8">
              <div className="w-14 h-14 rounded-xl gradient-accent flex items-center justify-center text-accent-foreground mb-6">
                <Eye className="h-7 w-7" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-foreground mb-4">Our Vision</h3>
              <p className="text-muted-foreground">
                To become India's most loved printing platform, known for quality, innovation, and customer 
                satisfaction. We envision a future where every business has access to world-class printing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Our Values</span>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mt-2">
              What Drives Us
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Award className="h-6 w-6" />, title: 'Quality First', desc: 'We never compromise on print quality' },
              { icon: <Users className="h-6 w-6" />, title: 'Customer Focus', desc: 'Your satisfaction is our priority' },
              { icon: <Printer className="h-6 w-6" />, title: 'Innovation', desc: 'Latest technology for best results' },
              { icon: <Clock className="h-6 w-6" />, title: 'Reliability', desc: 'On-time delivery, every time' },
            ].map((value) => (
              <div key={value.title} className="text-center p-6">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                  {value.icon}
                </div>
                <h3 className="font-heading font-semibold text-lg text-foreground mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <WhyChooseUsSection />

      {/* CTA */}
      <section className="py-16 gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl font-bold text-primary-foreground mb-4">
            Ready to Start Your Print Journey?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
            Join thousands of satisfied customers who trust PrintHub for their printing needs.
          </p>
          <Link to="/products">
            <Button variant="accent" size="xl">
              Explore Products
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default About;
