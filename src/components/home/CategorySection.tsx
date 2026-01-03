import { Link } from 'react-router-dom';
import { categories } from '@/data/products';
import { CreditCard, Flag, Image, FileText, Shirt, Tag, Frame, Sparkles } from 'lucide-react';

import productCards from '@/assets/product-cards.jpg';
import productBanner from '@/assets/product-banner.jpg';
import productFlyers from '@/assets/product-flyers.jpg';
import productTshirts from '@/assets/product-tshirts.jpg';
import productStickers from '@/assets/product-stickers.jpg';

const iconMap: Record<string, React.ReactNode> = {
  CreditCard: <CreditCard className="h-6 w-6" />,
  Flag: <Flag className="h-6 w-6" />,
  Image: <Image className="h-6 w-6" />,
  FileText: <FileText className="h-6 w-6" />,
  Shirt: <Shirt className="h-6 w-6" />,
  Tag: <Tag className="h-6 w-6" />,
  Frame: <Frame className="h-6 w-6" />,
  Sparkles: <Sparkles className="h-6 w-6" />,
};

const imageMap: Record<string, string> = {
  'business-cards': productCards,
  'banners': productBanner,
  'posters': productFlyers,
  'flyers': productFlyers,
  'merchandise': productTshirts,
  'stickers': productStickers,
  'photo-frames': productCards,
  'custom': productTshirts,
};

const CategorySection = () => {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Our Products</span>
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-4">
            Everything You Need to Print
          </h2>
          <p className="text-muted-foreground">
            From professional business cards to large format banners, we've got all your printing needs covered.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={`/products?category=${category.id}`}
              className="group relative overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-floating animate-fade-in transform hover:scale-105"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Animated Background Elements */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-2 right-2 w-2 h-2 bg-primary/40 rounded-full animate-pulse" style={{ animationDelay: `${index * 0.15}s` }} />
                <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-accent/40 rounded-full animate-pulse" style={{ animationDelay: `${index * 0.25}s` }} />
              </div>

              {/* Enhanced Image */}
              <div className="aspect-square overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                <img
                  src={imageMap[category.id] || productCards}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700 group-hover:brightness-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                
                {/* Floating Animation Elements */}
                <div className="absolute top-4 left-4 w-1 h-1 bg-white/60 rounded-full animate-bounce-slow opacity-0 group-hover:opacity-100 transition-opacity" style={{ animationDelay: '0s' }} />
                <div className="absolute top-6 right-8 w-0.5 h-0.5 bg-white/60 rounded-full animate-bounce-slow opacity-0 group-hover:opacity-100 transition-opacity" style={{ animationDelay: '0.3s' }} />
              </div>

              {/* Enhanced Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 transform group-hover:translate-y-0 transition-transform duration-300">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary-foreground backdrop-blur-sm border border-white/20 group-hover:bg-primary/30 transition-colors duration-300">
                    {iconMap[category.icon]}
                  </div>
                </div>
                <h3 className="font-heading font-semibold text-lg text-primary-foreground group-hover:text-primary transition-colors duration-300">
                  {category.name}
                </h3>
                <p className="text-primary-foreground/70 text-sm line-clamp-1 group-hover:text-primary-foreground/90 transition-colors duration-300">
                  {category.description}
                </p>
              </div>

              {/* Enhanced Hover Arrow */}
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gradient-to-r from-primary to-primary/90 text-primary-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300 shadow-lg border border-white/20">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {/* Corner Decorations */}
              <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
