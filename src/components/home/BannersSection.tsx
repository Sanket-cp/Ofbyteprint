import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Ruler, Zap, Shield, Clock } from 'lucide-react';
import productBanner from '@/assets/product-banner.jpg';

const BannersSection = () => {
  const bannerTypes = [
    {
      id: 'flex',
      name: 'Flex Banners',
      description: 'Durable outdoor banners for all weather conditions',
      price: '₹200',
      size: '3x6 ft',
      features: ['Weather Resistant', 'UV Protected', 'Tear Resistant'],
      image: productBanner
    },
    {
      id: 'vinyl',
      name: 'Vinyl Banners',
      description: 'Premium quality vinyl for long-lasting displays',
      price: '₹350',
      size: '4x8 ft',
      features: ['Premium Vinyl', 'Fade Resistant', 'Easy Installation'],
      image: productBanner
    },
    {
      id: 'mesh',
      name: 'Mesh Banners',
      description: 'Wind-resistant mesh material for outdoor use',
      price: '₹280',
      size: '3x6 ft',
      features: ['Wind Resistant', 'Lightweight', 'High Visibility'],
      image: productBanner
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-green-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 border border-green-200 mb-4">
            <Ruler className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">Large Format Printing</span>
          </div>
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Eye-Catching Banners & Signage
          </h2>
          <p className="text-lg text-gray-600">
            Make your message visible with our high-quality banners. Perfect for events, promotions, and advertising.
          </p>
        </div>

        {/* Banners Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {bannerTypes.map((banner, index) => (
            <div
              key={banner.id}
              className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-green-300 hover:shadow-xl transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={banner.image}
                  alt={banner.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                
                {/* Size Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                  {banner.size}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-heading font-bold text-xl text-gray-900 group-hover:text-green-600 transition-colors mb-1">
                      {banner.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {banner.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{banner.price}</div>
                    <div className="text-xs text-gray-500">per sq ft</div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2 mb-6">
                  {banner.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      {feature}
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Link to={`/product/banner-${banner.id}`}>
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    Get Quote
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Features Row */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="text-center p-6 bg-white rounded-xl border border-gray-200">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Fast Turnaround</h4>
            <p className="text-sm text-gray-600">Same day printing available</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl border border-gray-200">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Weather Proof</h4>
            <p className="text-sm text-gray-600">Suitable for outdoor use</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl border border-gray-200">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Ruler className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Custom Sizes</h4>
            <p className="text-sm text-gray-600">Any size up to 20x10 ft</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl border border-gray-200">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Free Installation</h4>
            <p className="text-sm text-gray-600">Setup service included</p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <Link to="/products?category=banners">
            <Button variant="outline" size="lg" className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white">
              Explore All Banners
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BannersSection;