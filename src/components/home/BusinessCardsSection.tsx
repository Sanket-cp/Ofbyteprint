import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Zap, Crown, Sparkles } from 'lucide-react';
import productCards from '@/assets/product-cards.jpg';

const BusinessCardsSection = () => {
  const businessCardTypes = [
    {
      id: 'standard',
      name: 'Standard Business Cards',
      description: 'Professional quality cards for everyday use',
      price: '₹50',
      features: ['350 GSM Paper', 'Matte/Gloss Finish', '24h Delivery'],
      popular: false,
      image: productCards
    },
    {
      id: 'premium',
      name: 'Premium Business Cards',
      description: 'Enhanced quality with special finishes',
      price: '₹120',
      features: ['400 GSM Paper', 'UV Coating', 'Rounded Corners'],
      popular: true,
      image: productCards
    },
    {
      id: 'luxury',
      name: 'Luxury Business Cards',
      description: 'Premium materials with exclusive finishes',
      price: '₹250',
      features: ['Textured Paper', 'Foil Stamping', 'Die Cut'],
      popular: false,
      image: productCards
    },
    {
      id: 'eco',
      name: 'Eco-Friendly Cards',
      description: 'Sustainable printing on recycled paper',
      price: '₹80',
      features: ['Recycled Paper', 'Eco Inks', 'Carbon Neutral'],
      popular: false,
      image: productCards
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 border border-blue-200 mb-4">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Most Popular Category</span>
          </div>
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Professional Business Cards
          </h2>
          <p className="text-lg text-gray-600">
            Make a lasting first impression with our premium business cards. Choose from various finishes and materials.
          </p>
        </div>

        {/* Business Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {businessCardTypes.map((card, index) => (
            <div
              key={card.id}
              className="group relative bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-blue-300 hover:shadow-xl transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Popular Badge */}
              {card.popular && (
                <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  Most Popular
                </div>
              )}

              {/* Image */}
              <div className="aspect-[3/2] overflow-hidden relative">
                <img
                  src={card.image}
                  alt={card.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-heading font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                    {card.name}
                  </h3>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{card.price}</div>
                    <div className="text-xs text-gray-500">per 100 cards</div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {card.description}
                </p>

                {/* Features */}
                <div className="space-y-2 mb-6">
                  {card.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      {feature}
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Link to={`/product/business-cards-${card.id}`}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white group-hover:bg-blue-700 transition-colors">
                    Order Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <Link to="/products?category=business-cards">
            <Button variant="outline" size="lg" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
              View All Business Cards
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BusinessCardsSection;