import { Shield, Truck, Clock, Award, Users, Headphones, CheckCircle, Star } from 'lucide-react';

const WhyChooseUsSection = () => {
  const reasons = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Quality Guaranteed',
      description: '100% satisfaction promise with premium materials and advanced printing technology.',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: <Truck className="h-8 w-8" />,
      title: 'Fast & Free Delivery',
      description: 'Free shipping on orders above ₹999. Express delivery available in 24 hours.',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: 'Quick Turnaround',
      description: 'Most orders processed within 24 hours. Rush orders available for urgent needs.',
      color: 'bg-orange-100 text-orange-600'
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: 'Industry Experience',
      description: '8+ years of printing expertise serving 10,000+ happy customers across India.',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Trusted by Businesses',
      description: 'From startups to Fortune 500 companies, businesses trust us for their printing needs.',
      color: 'bg-indigo-100 text-indigo-600'
    },
    {
      icon: <Headphones className="h-8 w-8" />,
      title: '24/7 Customer Support',
      description: 'Dedicated support team available round the clock to help with your queries.',
      color: 'bg-pink-100 text-pink-600'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Happy Customers', icon: <Users className="h-5 w-5" /> },
    { number: '50,000+', label: 'Orders Delivered', icon: <CheckCircle className="h-5 w-5" /> },
    { number: '4.9/5', label: 'Customer Rating', icon: <Star className="h-5 w-5" /> },
    { number: '24h', label: 'Express Delivery', icon: <Clock className="h-5 w-5" /> }
  ];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Award className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Why Choose PrintHub</span>
          </div>
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            India's Most Trusted Printing Partner
          </h2>
          <p className="text-lg text-gray-600">
            We've built our reputation on quality, reliability, and exceptional customer service. 
            Here's why thousands of businesses choose PrintHub for their printing needs.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 text-primary">
                {stat.icon}
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Reasons Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-16 h-16 rounded-2xl ${reason.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {reason.icon}
              </div>
              <h3 className="font-heading text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                {reason.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Testimonial */}
        <div className="mt-16 bg-white rounded-2xl border border-gray-200 p-8 lg:p-12 text-center shadow-lg">
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <blockquote className="text-xl lg:text-2xl font-medium text-gray-900 mb-6 italic">
            "PrintHub has been our go-to printing partner for 3 years. Their quality is consistently excellent, 
            and their customer service is outstanding. Highly recommended!"
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-primary font-semibold">RK</span>
            </div>
            <div className="text-left">
              <div className="font-semibold text-gray-900">Rajesh Kumar</div>
              <div className="text-sm text-gray-600">CEO, TechStart Solutions</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;