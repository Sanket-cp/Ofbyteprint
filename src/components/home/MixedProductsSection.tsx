import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Zap, Crown, Sparkles, Truck, Shield } from 'lucide-react';
import productCards from '@/assets/product-cards.jpg';
import productBanner from '@/assets/product-banner.jpg';
import productFlyers from '@/assets/product-flyers.jpg';
import productTshirts from '@/assets/product-tshirts.jpg';
import productStickers from '@/assets/product-stickers.jpg';

const MixedProductsSection = () => {
  const mixedProducts = [
    // Business Cards
    {
      id: 'business-cards-premium',
      name: 'Premium Business Cards',
      category: 'Business Cards',
      description: 'Professional quality cards with premium finishes',
      price: '₹120',
      originalPrice: '₹150',
      features: ['400 GSM Paper', 'UV Coating', 'Rounded Corners'],
      popular: true,
      image: productCards,
      categoryLink: '/products?category=business-cards'
    },
    // Banners
    {
      id: 'flex-banners',
      name: 'Flex Banners',
      category: 'Banners',
      description: 'Durable outdoor banners for all weather conditions',
      price: '₹200',
      originalPrice: '₹250',
      features: ['Weather Resistant', 'UV Protected', 'Tear Resistant'],
      popular: false,
      image: productBanner,
      categoryLink: '/products?category=banners'
    },
    // T-Shirts
    {
      id: 'custom-tshirts',
      name: 'Custom T-Shirts',
      category: 'Merchandise',
      description: 'Premium quality cotton tees with your design',
      price: '₹150',
      originalPrice: '₹200',
      features: ['100% Cotton', '20+ Colors', 'DTG Printing'],
      popular: false,
      image: productTshirts,
      categoryLink: '/products?category=merchandise'
    },
    // Flyers
    {
      id: 'paper-flyers',
      name: 'Paper Flyers',
      category: 'Flyers',
      description: 'High-quality flyers for marketing and promotions',
      price: '₹30',
      originalPrice: '₹40',
      features: ['300 GSM Paper', 'Full Color', 'Matte Finish'],
      popular: false,
      image: productFlyers,
      categoryLink: '/products?category=flyers'
    },
    // Stickers
    {
      id: 'vinyl-stickers',
      name: 'Vinyl Stickers',
      category: 'Stickers',
      description: 'Durable vinyl stickers for indoor and outdoor use',
      price: '₹25',
      originalPrice: '₹35',
      features: ['Waterproof', 'UV Resistant', 'Die Cut'],
      popular: false,
      image: productStickers,
      categoryLink: '/products?category=stickers'
    },
    // More Business Cards
    {
      id: 'luxury-business-cards',
      name: 'Luxury Business Cards',
      category: 'Business Cards',
      description: 'Premium materials with exclusive finishes',
      price: '₹250',
      originalPrice: '₹300',
      features: ['Textured Paper', 'Foil Stamping', 'Die Cut'],
      popular: false,
      image: productCards,
      categoryLink: '/products?category=business-cards'
    },
    // Mugs
    {
      id: 'printed-mugs',
      name: 'Printed Mugs',
      category: 'Merchandise',
      description: 'Ceramic mugs perfect for gifts and promotions',
      price: '₹100',
      originalPrice: '₹130',
      features: ['Ceramic Material', 'Dishwasher Safe', 'Full Color'],
      popular: true,
      image: productTshirts,
      categoryLink: '/products?category=merchandise'
    },
    // Vinyl Banners
    {
      id: 'vinyl-banners',
      name: 'Vinyl Banners',
      category: 'Banners',
      description: 'Premium quality vinyl for long-lasting displays',
      price: '₹350',
      originalPrice: '₹400',
      features: ['Premium Vinyl', 'Fade Resistant', 'Easy Installation'],
      popular: false,
      image: productBanner,
      categoryLink: '/products?category=banners'
    },
    // Brochures
    {
      id: 'brochures',
      name: 'Brochures',
      category: 'Flyers',
      description: 'Professional tri-fold brochures for your business',
      price: '₹80',
      originalPrice: '₹100',
      features: ['350 GSM Paper', 'Tri-fold Design', 'Gloss Finish'],
      popular: false,
      image: productFlyers,
      categoryLink: '/products?category=flyers'
    },
    // Keychains
    {
      id: 'custom-keychains',
      name: 'Custom Keychains',
      category: 'Merchandise',
      description: 'Durable acrylic keychains with your logo',
      price: '₹25',
      originalPrice: '₹35',
      features: ['Acrylic Material', 'Custom Shape', 'Full Color'],
      popular: false,
      image: productTshirts,
      categoryLink: '/products?category=merchandise'
    },
    // Paper Stickers
    {
      id: 'paper-stickers',
      name: 'Paper Stickers',
      category: 'Stickers',
      description: 'High-quality paper stickers for indoor use',
      price: '₹15',
      originalPrice: '₹25',
      features: ['Premium Paper', 'Matte Finish', 'Custom Shapes'],
      popular: false,
      image: productStickers,
      categoryLink: '/products?category=stickers'
    },
    // Standard Business Cards
    {
      id: 'standard-business-cards',
      name: 'Standard Business Cards',
      category: 'Business Cards',
      description: 'Professional quality cards for everyday use',
      price: '₹50',
      originalPrice: '₹70',
      features: ['350 GSM Paper', 'Matte/Gloss Finish', '24h Delivery'],
      popular: false,
      image: productCards,
      categoryLink: '/products?category=business-cards'
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Featured Products</span>
          </div>
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Popular Printing Products
          </h2>
          <p className="text-lg text-muted-foreground">
            Discover our most popular printing products across all categories. High quality, competitive prices, fast delivery.
          </p>
        </div>

        {/* Mixed Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {mixedProducts.map((product, index) => (
            <div
              key={product.id}
              className="group relative bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 hover:shadow-xl transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Popular Badge */}
              {product.popular && (
                <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  Popular
                </div>
              )}

              {/* Category Badge */}
              <div className="absolute top-4 right-4 z-10 bg-primary/90 text-primary-foreground px-2 py-1 rounded-md text-xs font-medium">
                {product.category}
              </div>

              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden relative">
                <Link to={product.categoryLink}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-heading font-bold text-lg text-foreground group-hover:text-primary transition-colors mb-1 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                      {product.description}
                    </p>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl font-bold text-primary">{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">{product.originalPrice}</span>
                  )}
                  <div className="ml-auto flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-muted-foreground">4.{Math.floor(Math.random() * 3) + 6}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-1 mb-4">
                  {product.features.slice(0, 2).map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="w-1 h-1 bg-primary rounded-full"></div>
                      {feature}
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex gap-2">
                  <Link to={`/product/${product.id}`} className="flex-1">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm">
                      Order Now
                    </Button>
                  </Link>
                  <Link to={product.categoryLink}>
                    <Button variant="outline" size="sm" className="px-3">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Features */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="text-center p-6 bg-card rounded-xl border border-border">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Truck className="w-6 h-6 text-primary" />
            </div>
            <h4 className="font-semibold text-foreground mb-2">Free Delivery</h4>
            <p className="text-sm text-muted-foreground">On orders above ₹999</p>
          </div>
          <div className="text-center p-6 bg-card rounded-xl border border-border">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h4 className="font-semibold text-foreground mb-2">Quality Guaranteed</h4>
            <p className="text-sm text-muted-foreground">100% satisfaction promise</p>
          </div>
          <div className="text-center p-6 bg-card rounded-xl border border-border sm:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h4 className="font-semibold text-foreground mb-2">Fast Turnaround</h4>
            <p className="text-sm text-muted-foreground">24h express available</p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <Link to="/products">
            <Button variant="outline" size="lg" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              View All Products
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MixedProductsSection;