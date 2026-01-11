import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Truck, Shield, Clock, Star, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import heroImage from '@/assets/hero-printing.jpg';
import productCards from '@/assets/product-cards.jpg';
import productBanner from '@/assets/product-banner.jpg';
import productFlyers from '@/assets/product-flyers.jpg';
import productTshirts from '@/assets/product-tshirts.jpg';
import productStickers from '@/assets/product-stickers.jpg';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      id: 1,
      image: heroImage,
      title: 'Professional Business Cards',
      subtitle: 'Make a lasting first impression',
      link: '/products?category=business-cards',
      category: 'Business Cards'
    },
    {
      id: 2,
      image: productBanner,
      title: 'Eye-Catching Banners',
      subtitle: 'Perfect for events and promotions',
      link: '/products?category=banners',
      category: 'Banners'
    },
    {
      id: 3,
      image: productFlyers,
      title: 'Marketing Flyers',
      subtitle: 'Spread your message effectively',
      link: '/products?category=flyers',
      category: 'Flyers'
    },
    {
      id: 4,
      image: productTshirts,
      title: 'Custom Merchandise',
      subtitle: 'Branded products for your business',
      link: '/products?category=merchandise',
      category: 'Merchandise'
    },
    {
      id: 5,
      image: productStickers,
      title: 'Custom Stickers',
      subtitle: 'Durable and vibrant designs',
      link: '/products?category=stickers',
      category: 'Stickers'
    }
  ];

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const currentSlideData = heroSlides[currentSlide];

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-green-50 min-h-[600px] flex items-center">
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content - Arc Print Style */}
          <div className="space-y-6 lg:space-y-8">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 border border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">Trusted by 10,000+ Businesses</span>
            </div>

            {/* Dynamic Heading based on current slide */}
            <div>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
                Your Plans Deserve a
                <span className="block text-primary">Perfect Partner</span>
              </h1>
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                Custom Printing Solutions – Crafted for Professionals, Designed by You.
              </p>
              
              {/* Current Category Highlight */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Now Featuring: {currentSlideData.category}</span>
              </div>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Truck className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Free Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Quality Guaranteed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-orange-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">24h Express</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <Star className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Premium Quality</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={currentSlideData.link}>
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-8 py-3 text-base font-semibold">
                  Explore {currentSlideData.category}
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link to="/bulk-orders">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-base font-semibold">
                  Get Bulk Quote
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm text-gray-600 ml-2">4.9/5 from 2,500+ reviews</span>
              </div>
            </div>
          </div>

          {/* Right Content - Image Carousel */}
          <div className="relative">
            {/* Main Carousel Container */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
              {/* Image Slider */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Link to={currentSlideData.link} className="block w-full h-full">
                  <img
                    src={currentSlideData.image}
                    alt={currentSlideData.title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  
                  {/* Overlay Content */}
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <h3 className="font-heading text-xl font-bold mb-1">
                      {currentSlideData.title}
                    </h3>
                    <p className="text-sm opacity-90">
                      {currentSlideData.subtitle}
                    </p>
                  </div>
                </Link>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-800 hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-800 hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Slide Indicators */}
            <div className="flex justify-center gap-2 mt-4">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-primary' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* Thumbnail Preview */}
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={() => setCurrentSlide(index)}
                  className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-colors ${
                    index === currentSlide ? 'border-primary' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Floating Stats Cards - Arc Print Style */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-bold text-lg">10K+</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Happy Customers</p>
                  <p className="text-sm text-gray-500">Across India</p>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 bg-orange-500 text-white rounded-full px-4 py-2 shadow-lg">
              <span className="font-semibold text-sm">Up to 30% OFF</span>
            </div>

            {/* Quality Badge */}
            <div className="absolute top-1/2 -left-8 bg-blue-600 text-white rounded-full px-3 py-2 shadow-lg transform -rotate-12">
              <span className="font-semibold text-xs">Premium Quality</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
