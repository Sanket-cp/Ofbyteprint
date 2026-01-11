import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/SEO';
import { categories } from '@/data/products';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/utils/priceCalculator';
import { Filter, Grid, List, ArrowRight, Loader2, Star } from 'lucide-react';
import ApiService from '@/services/api';
import { toast } from 'sonner';

import productCards from '@/assets/product-cards.jpg';
import productBanner from '@/assets/product-banner.jpg';
import productFlyers from '@/assets/product-flyers.jpg';
import productTshirts from '@/assets/product-tshirts.jpg';
import productStickers from '@/assets/product-stickers.jpg';

const imageMap: Record<string, string> = {
  'vc-standard': productCards,
  'banner-flex': productBanner,
  'poster-a3': productFlyers,
  'flyer-standard': productFlyers,
  'tshirt-custom': productTshirts,
  'sticker-die-cut': productStickers,
  // Category mappings
  'business-cards': productCards,
  'banners': productBanner,
  'posters': productFlyers,
  'flyers': productFlyers,
  'merchandise': productTshirts,
  'stickers': productStickers,
  'photo-frames': productCards,
  'custom': productTshirts,
};

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || '';
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
    limit: 12
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params: any = {
          page: 1,
          limit: 12
        };
        
        if (selectedCategory) {
          params.category = selectedCategory;
        }

        const response = await ApiService.getProducts(params);
        
        if (response.success) {
          setProducts(response.data.products);
          setPagination(response.data.pagination);
        }
      } catch (error: any) {
        toast.error('Failed to load products');
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === '') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', categoryId);
    }
    setSearchParams(searchParams);
  };

  const selectedCategoryName = categories.find(c => c.id === selectedCategory)?.name || 'All Products';
  
  return (
    <Layout>
      <SEO 
        title={`${selectedCategoryName} - PrintHub Professional Printing Services`}
        description={`Browse our ${selectedCategoryName.toLowerCase()} collection. High-quality printing with fast delivery and competitive prices. Order online today!`}
        keywords={`${selectedCategoryName.toLowerCase()}, printing services, custom printing, online printing, professional printing`}
      />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Horizontal Category Filter */}
          <div className="mb-8">
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-5 w-5 text-primary" />
                <h3 className="font-heading font-semibold text-foreground">Categories</h3>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button
                  onClick={() => handleCategoryChange('')}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    !selectedCategory
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  All Products
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      selectedCategory === cat.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Category Banner - Shows when category is selected */}
          {selectedCategory && (
            <div className="relative mb-8 rounded-2xl overflow-hidden shadow-xl">
              <div className="aspect-[21/9] sm:aspect-[21/6] lg:aspect-[21/5] relative">
                <img
                  src={imageMap[selectedCategory] || productCards}
                  alt={`${selectedCategoryName} Collection`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-transparent" />
                
                {/* Banner Content */}
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-4">
                    <div className="max-w-2xl text-white">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-4">
                        <Filter className="h-4 w-4" />
                        <span className="text-sm font-medium">Category</span>
                      </div>
                      <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                        {selectedCategoryName}
                      </h2>
                      <p className="text-lg sm:text-xl opacity-90 mb-6">
                        {categories.find(c => c.id === selectedCategory)?.description || 'High-quality printing products for all your needs'}
                      </p>
                      <div className="flex items-center gap-4">
                        <span className="text-sm opacity-75">
                          {loading ? 'Loading...' : `${products.length} products available`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col">
            {/* Products Grid */}
            <main className="flex-1">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground text-sm">
                  {loading ? 'Loading...' : `Showing ${products.length} products`}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}

              {/* Products */}
              {!loading && (
                <div className={`grid gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1'
                }`}>
                  {products.map((product, index) => (
                    <Link
                      key={product._id || product.id}
                      to={`/product/${product.id}`}
                      className={`group bg-card rounded-xl border border-border overflow-hidden hover:border-primary/50 hover:shadow-elevated transition-all duration-300 animate-fade-in ${
                        viewMode === 'list' ? 'flex' : ''
                      }`}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      {/* Image */}
                      <div className={`overflow-hidden ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-square'}`}>
                        <img
                          src={imageMap[product.id] || productCards}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {/* Content */}
                      <div className="p-4 flex-1">
                        <div className="text-xs text-primary font-medium uppercase tracking-wider mb-1">
                          {categories.find(c => c.id === product.category)?.name}
                        </div>
                        <h3 className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                          {product.name}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-lg font-bold text-foreground">
                              {formatPrice(product.basePrice)}
                            </span>
                            <span className="text-muted-foreground text-sm">/unit</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-accent text-accent" />
                              <span className="text-xs font-medium">{product.averageRating || 4.5}</span>
                              <span className="text-xs text-muted-foreground">({product.reviewCount || 0})</span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                              <ArrowRight className="h-4 w-4" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!loading && products.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No products found.</p>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
