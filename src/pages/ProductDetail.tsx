import { useState, useCallback, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { categories } from '@/data/products';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/utils/priceCalculator';
import { useCart } from '@/context/CartContext';
import ProductReviews from '@/components/product/ProductReviews';
import ApiService from '@/services/api';
import { toast } from 'sonner';
import {
  ShoppingCart,
  Upload,
  Minus,
  Plus,
  Check,
  Info,
  Zap,
  ChevronLeft,
  FileText,
  X,
  Star,
  Loader2
} from 'lucide-react';

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
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedPaper, setSelectedPaper] = useState('');
  const [selectedFinishing, setSelectedFinishing] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isColor, setIsColor] = useState(true);
  const [isDoubleSide, setIsDoubleSide] = useState(false);
  const [lamination, setLamination] = useState('none');
  const [isUrgent, setIsUrgent] = useState(false);
  const [designFile, setDesignFile] = useState<File | null>(null);
  const [priceBreakdown, setPriceBreakdown] = useState<any>(null);
  const [calculatingPrice, setCalculatingPrice] = useState(false);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const response = await ApiService.getProduct(id);
        if (response.success) {
          const productData = response.data.product;
          setProduct(productData);
          
          // Set default values
          setSelectedSize(productData.sizes[0]?.id || '');
          setSelectedPaper(productData.paperTypes[0]?.id || '');
          setSelectedFinishing(productData.finishings[0]?.id || '');
          setQuantity(productData.minQuantity || 1);
        }
      } catch (error: any) {
        toast.error('Failed to load product');
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Calculate price when customization changes
  useEffect(() => {
    const calculateProductPrice = async () => {
      if (!product || !selectedSize || !selectedPaper || !selectedFinishing) return;

      setCalculatingPrice(true);
      try {
        const customization = {
          size: selectedSize,
          paperType: selectedPaper,
          quantity,
          isColor,
          isDoubleSide,
          lamination,
          finishing: selectedFinishing,
          isUrgent,
        };

        const response = await ApiService.calculatePrice(product.id, customization);
        if (response.success) {
          setPriceBreakdown(response.data.priceBreakdown);
        }
      } catch (error: any) {
        console.error('Price calculation failed:', error);
      } finally {
        setCalculatingPrice(false);
      }
    };

    calculateProductPrice();
  }, [product, selectedSize, selectedPaper, quantity, isColor, isDoubleSide, lamination, selectedFinishing, isUrgent]);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Invalid file type. Please upload PDF, PNG, or JPG.');
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        toast.error('File too large. Maximum size is 50MB.');
        return;
      }
      
      try {
        const response = await ApiService.uploadDesign(file);
        if (response.success) {
          setDesignFile(file);
          toast.success('Design uploaded successfully!');
        }
      } catch (error: any) {
        toast.error('Failed to upload design');
        console.error('Upload failed:', error);
      }
    }
  }, []);

  const handleAddToCart = useCallback(() => {
    if (!product || !priceBreakdown) return;
    
    addItem(
      product,
      {
        productId: product.id,
        size: selectedSize,
        paperType: selectedPaper,
        quantity,
        isColor,
        isDoubleSide,
        lamination,
        finishing: selectedFinishing,
        isUrgent,
      },
      priceBreakdown.finalPrice,
      designFile?.name
    );
  }, [product, priceBreakdown, addItem, selectedSize, selectedPaper, quantity, isColor, isDoubleSide, lamination, selectedFinishing, isUrgent, designFile]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-heading text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
          <Link to="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const category = categories.find(c => c.id === product.category);

  return (
    <Layout>
      <div className="bg-background min-h-screen">
        {/* Breadcrumb */}
        <div className="bg-muted/30 border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center gap-2 text-sm">
              <Link to="/products" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                <ChevronLeft className="h-4 w-4" />
                Products
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground">{product.name}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
                <img
                  src={imageMap[product.id] || productCards}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4" />
                <span>Images are for illustration purposes</span>
              </div>
            </div>

            {/* Product Details & Customization */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="text-xs text-primary font-medium uppercase tracking-wider mb-1">
                  {category?.name}
                </div>
                <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground mb-2">
                  {product.name}
                </h1>
                
                {/* Rating Display */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < 4 ? 'fill-accent text-accent' : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">4.7 (120 reviews)</span>
                </div>
                
                <p className="text-muted-foreground">{product.description}</p>
              </div>

              {/* Size */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Size</label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedSize === size.id
                          ? 'bg-primary text-primary-foreground shadow-soft'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {size.name}
                      <span className="block text-xs opacity-75">{size.dimensions}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Paper Type */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Paper / Material</label>
                <div className="flex flex-wrap gap-2">
                  {product.paperTypes.map((paper) => (
                    <button
                      key={paper.id}
                      onClick={() => setSelectedPaper(paper.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedPaper === paper.id
                          ? 'bg-primary text-primary-foreground shadow-soft'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {paper.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Color Option */}
                {product.hasColor && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Print Type</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsColor(true)}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          isColor
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        Color
                      </button>
                      <button
                        onClick={() => setIsColor(false)}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          !isColor
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        B/W
                      </button>
                    </div>
                  </div>
                )}

                {/* Double Side */}
                {product.hasDoubleSide && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Sides</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsDoubleSide(false)}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          !isDoubleSide
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        Single
                      </button>
                      <button
                        onClick={() => setIsDoubleSide(true)}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          isDoubleSide
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        Double
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Lamination */}
              {product.hasLamination && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Lamination</label>
                  <div className="flex flex-wrap gap-2">
                    {['none', 'matte', 'glossy'].map((lam) => (
                      <button
                        key={lam}
                        onClick={() => setLamination(lam)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                          lamination === lam
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {lam === 'none' ? 'No Lamination' : lam}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Finishing */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Finishing</label>
                <div className="flex flex-wrap gap-2">
                  {product.finishings.map((finish) => (
                    <button
                      key={finish.id}
                      onClick={() => setSelectedFinishing(finish.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedFinishing === finish.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {finish.name}
                      {finish.price > 0 && (
                        <span className="text-xs opacity-75 ml-1">+{formatPrice(finish.price)}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Quantity (min: {product.minQuantity})
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(product.minQuantity, quantity - (quantity >= 100 ? 50 : 10)))}
                      className="p-3 hover:bg-muted transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(product.minQuantity, parseInt(e.target.value) || product.minQuantity))}
                      className="w-20 text-center py-2 border-x border-border bg-transparent focus:outline-none"
                    />
                    <button
                      onClick={() => setQuantity(quantity + (quantity >= 100 ? 50 : 10))}
                      className="p-3 hover:bg-muted transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  {product.bulkDiscounts.length > 0 && (
                    <span className="text-sm text-success">
                      {(() => {
                        const discount = product.bulkDiscounts.find(d => quantity >= d.minQuantity);
                        return discount ? `${discount.discountPercent}% bulk discount applied!` : '';
                      })()}
                    </span>
                  )}
                </div>
              </div>

              {/* Urgent Delivery */}
              {product.hasUrgentDelivery && (
                <button
                  onClick={() => setIsUrgent(!isUrgent)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                    isUrgent
                      ? 'bg-accent/10 border-accent text-accent'
                      : 'bg-muted border-border text-muted-foreground'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5" />
                    <div className="text-left">
                      <p className="font-medium">Express Delivery</p>
                      <p className="text-sm opacity-75">Get it within 24 hours (+25%)</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isUrgent ? 'bg-accent border-accent' : 'border-muted-foreground'
                  }`}>
                    {isUrgent && <Check className="h-4 w-4 text-accent-foreground" />}
                  </div>
                </button>
              )}

              {/* Design Upload */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Upload Design</label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                    designFile ? 'border-success bg-success/5' : 'border-border hover:border-primary'
                  }`}>
                    {designFile ? (
                      <div className="flex items-center justify-center gap-3">
                        <FileText className="h-6 w-6 text-success" />
                        <span className="text-success font-medium">{designFile.name}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDesignFile(null);
                          }}
                          className="p-1 hover:bg-muted rounded"
                        >
                          <X className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground text-sm">
                          Drag & drop or click to upload
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PDF, PNG, JPG (max 50MB)
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Price Summary */}
              {priceBreakdown && (
                <div className="bg-muted/50 rounded-xl p-4 space-y-2">
                  {calculatingPrice && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Calculating price...
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(priceBreakdown.subtotal)}</span>
                  </div>
                  {priceBreakdown.finishingCost > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Finishing</span>
                      <span>+{formatPrice(priceBreakdown.finishingCost)}</span>
                    </div>
                  )}
                  {priceBreakdown.urgentCost > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Express Delivery</span>
                      <span>+{formatPrice(priceBreakdown.urgentCost)}</span>
                    </div>
                  )}
                  {priceBreakdown.bulkDiscount > 0 && (
                    <div className="flex justify-between text-sm text-success">
                      <span>Bulk Discount</span>
                      <span>-{formatPrice(priceBreakdown.bulkDiscount)}</span>
                    </div>
                  )}
                  <div className="border-t border-border pt-2 mt-2">
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="text-sm text-muted-foreground">Total</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          ({formatPrice(priceBreakdown.pricePerUnit)}/unit)
                        </span>
                      </div>
                      <span className="font-heading text-2xl font-bold text-foreground">
                        {formatPrice(priceBreakdown.finalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Add to Cart */}
              <Button
                variant="hero"
                size="xl"
                className="w-full"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>
            </div>
          </div>

          {/* Product Reviews Section */}
          <ProductReviews productId={product.id} productName={product.name} />
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
