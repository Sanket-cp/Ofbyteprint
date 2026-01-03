import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Zap } from 'lucide-react';
import { products } from '@/data/products';

import productCards from '@/assets/product-cards.jpg';
import productBanner from '@/assets/product-banner.jpg';
import productFlyers from '@/assets/product-flyers.jpg';
import productTshirts from '@/assets/product-tshirts.jpg';

const imageMap: Record<string, string> = {
  'visiting-cards-standard': productCards,
  'visiting-cards-premium': productCards,
  'flex-banners': productBanner,
  'vinyl-banners': productBanner,
  'paper-flyers': productFlyers,
  'brochures': productFlyers,
  'custom-tshirts': productTshirts,
  'printed-mugs': productTshirts,
};

const PopularProductsSection = () => {
  const popularProducts = products.slice(0, 4);

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Best Sellers</span>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mt-2">
              Popular Products
            </h2>
          </div>
          <Link to="/products">
            <Button variant="outline" className="group">
              View All Products
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularProducts.map((product, index) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 hover:shadow-elevated transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Enhanced Image with Animations */}
              <div className="relative aspect-[4/3] overflow-hidden">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-2 right-2 w-3 h-3 bg-primary/40 rounded-full animate-pulse" style={{ animationDelay: `${index * 0.2}s` }} />
                  <div className="absolute bottom-2 left-2 w-2 h-2 bg-accent/40 rounded-full animate-pulse" style={{ animationDelay: `${index * 0.3}s` }} />
                </div>

                <div className="relative group/image">
                  <img
                    src={imageMap[product.id] || productCards}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700 group-hover:brightness-110"
                  />
                  
                  {/* Animated Border Effect */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/30 transition-all duration-500 rounded-lg" />
                  
                  {/* Floating Animation Dots */}
                  <div className="absolute top-4 left-4 w-1 h-1 bg-white/60 rounded-full animate-bounce-slow opacity-0 group-hover:opacity-100 transition-opacity" style={{ animationDelay: '0s' }} />
                  <div className="absolute top-6 right-6 w-1 h-1 bg-white/60 rounded-full animate-bounce-slow opacity-0 group-hover:opacity-100 transition-opacity" style={{ animationDelay: '0.5s' }} />
                  <div className="absolute bottom-4 left-6 w-1 h-1 bg-white/60 rounded-full animate-bounce-slow opacity-0 group-hover:opacity-100 transition-opacity" style={{ animationDelay: '1s' }} />
                </div>
                
                {/* Enhanced Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {index === 0 && (
                    <span className="px-2 py-1 bg-gradient-to-r from-accent to-accent/80 text-accent-foreground text-xs font-semibold rounded-full flex items-center gap-1 animate-glow">
                      <Zap className="w-3 h-3" />
                      Best Seller
                    </span>
                  )}
                  {index === 1 && (
                    <span className="px-2 py-1 bg-gradient-to-r from-success to-success/80 text-success-foreground text-xs font-semibold rounded-full animate-pulse">
                      New
                    </span>
                  )}
                </div>

                {/* Enhanced Quick View Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="px-6 py-3 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-full font-medium text-sm shadow-lg border border-white/20 backdrop-blur-sm">
                      View Details
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-heading font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {product.description}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < 4 ? 'fill-accent text-accent' : 'text-muted-foreground'}`} />
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">4.{Math.floor(Math.random() * 3) + 6} ({Math.floor(Math.random() * 200) + 50}+ reviews)</span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <p className="font-heading font-bold text-lg text-primary">
                    ₹{product.basePrice}
                    <span className="text-xs font-normal text-muted-foreground"> onwards</span>
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularProductsSection;
