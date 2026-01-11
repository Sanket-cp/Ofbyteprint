import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shirt, Coffee, Gift, Heart } from 'lucide-react';
import productTshirts from '@/assets/product-tshirts.jpg';

const MerchandiseSection = () => {
  const merchandiseItems = [
    {
      id: 'tshirts',
      name: 'Custom T-Shirts',
      description: 'Premium quality cotton tees with your design',
      price: '₹150',
      icon: Shirt,
      colors: '20+ Colors',
      image: productTshirts
    },
    {
      id: 'mugs',
      name: 'Printed Mugs',
      description: 'Ceramic mugs perfect for gifts and promotions',
      price: '₹100',
      icon: Coffee,
      colors: 'White/Black',
      image: productTshirts
    },
    {
      id: 'keychains',
      name: 'Custom Keychains',
      description: 'Durable acrylic keychains with your logo',
      price: '₹25',
      icon: Gift,
      colors: 'Any Design',
      image: productTshirts
    },
    {
      id: 'caps',
      name: 'Branded Caps',
      description: 'High-quality caps with embroidered logos',
      price: '₹200',
      icon: Gift,
      colors: '10+ Colors',
      image: productTshirts
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-purple-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 border border-purple-200 mb-4">
            <Heart className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">Custom Merchandise</span>
          </div>
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Personalized Merchandise
          </h2>
          <p className="text-lg text-gray-600">
            Create unique branded merchandise for your business, events, or personal use. High-quality materials and printing.
          </p>
        </div>

        {/* Merchandise Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {merchandiseItems.map((item, index) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-purple-300 hover:shadow-xl transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className="aspect-square overflow-hidden relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                
                {/* Icon Overlay */}
                <div className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-purple-600" />
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-heading font-bold text-lg text-gray-900 group-hover:text-purple-600 transition-colors mb-1">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-500">
                    {item.colors}
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-purple-600">{item.price}</div>
                    <div className="text-xs text-gray-500">per piece</div>
                  </div>
                </div>

                {/* CTA */}
                <Link to={`/product/merchandise-${item.id}`}>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    Customize Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Use Cases */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-12">
          <h3 className="font-heading text-2xl font-bold text-gray-900 text-center mb-8">
            Perfect For
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏢</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Corporate Gifts</h4>
              <p className="text-sm text-gray-600">Employee appreciation and client gifts</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎉</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Events</h4>
              <p className="text-sm text-gray-600">Conferences, weddings, and celebrations</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📈</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Marketing</h4>
              <p className="text-sm text-gray-600">Brand promotion and awareness campaigns</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎁</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Personal</h4>
              <p className="text-sm text-gray-600">Custom gifts for friends and family</p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <Link to="/products?category=merchandise">
            <Button variant="outline" size="lg" className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white">
              View All Merchandise
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MerchandiseSection;