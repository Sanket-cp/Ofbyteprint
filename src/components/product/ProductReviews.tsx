import { Star, ThumbsUp, User, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface Review {
  id: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
  helpful: number;
  verified: boolean;
  productVariant?: string;
  pros?: string[];
  cons?: string[];
  images?: string[];
}

interface ProductOverview {
  qualityScore: number;
  valueScore: number;
  serviceScore: number;
  deliveryScore: number;
  highlights: string[];
  commonUses: string[];
  tips: string[];
}

interface ProductReviewsProps {
  productId: string;
  productName: string;
}

// Enhanced demo reviews data with more details
const demoReviews: Record<string, Review[]> = {
  'vc-standard': [
    {
      id: '1',
      name: 'Rajesh Kumar',
      rating: 5,
      date: 'Dec 22, 2025',
      comment: 'Outstanding quality business cards! The matte finish gives a premium feel and the colors are exactly as I designed. Perfect for networking events.',
      helpful: 18,
      verified: true,
      productVariant: 'Matte 350 GSM, Standard Size',
      pros: ['Premium feel', 'Accurate colors', 'Fast delivery', 'Great bulk pricing'],
      cons: ['None really, exceeded expectations']
    },
    {
      id: '2',
      name: 'Priya Sharma',
      rating: 4,
      date: 'Dec 20, 2025',
      comment: 'Very good quality cards. The texture is nice and professional. Only minor issue was one corner was slightly bent on a few cards, but overall excellent value.',
      helpful: 12,
      verified: true,
      productVariant: 'Textured 350 GSM, Standard Size',
      pros: ['Professional look', 'Good texture', 'Competitive pricing'],
      cons: ['Minor packaging issue', 'Could use better protective packaging']
    },
    {
      id: '3',
      name: 'Amit Patel',
      rating: 5,
      date: 'Dec 18, 2025',
      comment: 'Perfect for my startup! Ordered 1000 cards and got amazing bulk discount. Quality is consistent across all cards. Highly recommend for business use.',
      helpful: 25,
      verified: true,
      productVariant: 'Glossy 300 GSM, Standard Size',
      pros: ['Bulk discount', 'Consistent quality', 'Professional appearance', 'Quick turnaround'],
      cons: []
    },
    {
      id: '4',
      name: 'Sneha Reddy',
      rating: 4,
      date: 'Dec 15, 2025',
      comment: 'Good quality cards with vibrant colors. The gold foil finishing looks premium. Delivery was on time. Would order again for future events.',
      helpful: 9,
      verified: true,
      productVariant: 'Matte 300 GSM with Gold Foil',
      pros: ['Vibrant colors', 'Premium foil finish', 'On-time delivery'],
      cons: ['Slightly expensive with foil', 'Minimum quantity is high']
    }
  ],
  'banner-flex': [
    {
      id: '1',
      name: 'Vikram Singh',
      rating: 5,
      date: 'Dec 21, 2025',
      comment: 'Excellent outdoor banner! Survived heavy rain and strong winds. Colors remain vibrant after 2 months. Perfect for shop signage.',
      helpful: 22,
      verified: true,
      productVariant: 'Star Flex, 4ft x 6ft',
      pros: ['Weather resistant', 'Vibrant colors', 'Durable material', 'Good value'],
      cons: []
    },
    {
      id: '2',
      name: 'Meera Joshi',
      rating: 4,
      date: 'Dec 19, 2025',
      comment: 'Great quality banner for our event. The print quality is sharp and colors are bright. Installation was easy with the eyelets.',
      helpful: 15,
      verified: true,
      productVariant: 'Normal Flex, 3ft x 4ft with Eyelets',
      pros: ['Sharp print quality', 'Easy installation', 'Good customer service'],
      cons: ['Could be slightly thicker', 'Delivery took 3 days']
    }
  ],
  default: [
    {
      id: '1',
      name: 'Customer',
      rating: 5,
      date: 'Dec 20, 2025',
      comment: 'Excellent quality product! Very satisfied with the print quality and delivery time.',
      helpful: 12,
      verified: true,
      pros: ['Great quality', 'Fast delivery'],
      cons: []
    }
  ]
};

// Product overview data
const productOverviews: Record<string, ProductOverview> = {
  'vc-standard': {
    qualityScore: 4.8,
    valueScore: 4.6,
    serviceScore: 4.7,
    deliveryScore: 4.5,
    highlights: [
      'Premium cardstock with multiple finish options',
      'Consistent color reproduction across batches',
      'Professional matte and glossy finishes available',
      'Bulk discounts up to 25% for large orders'
    ],
    commonUses: [
      'Business networking and meetings',
      'Trade shows and exhibitions',
      'Professional services marketing',
      'Corporate branding and identity'
    ],
    tips: [
      'Choose matte finish for a premium, professional feel',
      'Glossy finish works best for colorful designs',
      'Order samples first for color matching',
      'Consider textured paper for luxury brands'
    ]
  },
  'banner-flex': {
    qualityScore: 4.7,
    valueScore: 4.8,
    serviceScore: 4.6,
    deliveryScore: 4.4,
    highlights: [
      'Weather-resistant outdoor material',
      'UV-resistant inks for long-lasting colors',
      'Multiple size options available',
      'Professional finishing with eyelets or pole pockets'
    ],
    commonUses: [
      'Shop signage and storefront displays',
      'Event promotion and advertising',
      'Construction site banners',
      'Trade show backdrops'
    ],
    tips: [
      'Star Flex is best for outdoor use',
      'Add eyelets for easy hanging',
      'Consider backlit flex for illuminated signs',
      'Order slightly larger for better visibility'
    ]
  }
};

const ProductReviews = ({ productId, productName }: ProductReviewsProps) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState('reviews');

  const reviews = demoReviews[productId] || demoReviews.default;
  const overview = productOverviews[productId];
  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const ratingCounts = [5, 4, 3, 2, 1].map(
    (star) => reviews.filter((r) => r.rating === star).length
  );

  const handleSubmitReview = () => {
    if (!newComment.trim()) {
      toast.error('Please write a review');
      return;
    }
    toast.success('Review submitted! It will appear after verification.');
    setShowReviewForm(false);
    setNewComment('');
    setNewRating(5);
  };

  return (
    <div className="mt-12 border-t border-border pt-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Reviews & Product Overview
        </h2>
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.round(averageRating)
                    ? 'fill-accent text-accent'
                    : 'text-muted-foreground'
                }`}
              />
            ))}
          </div>
          <span className="font-semibold text-foreground">{averageRating.toFixed(1)}</span>
          <span className="text-muted-foreground">({reviews.length} reviews)</span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2">
          <TabsTrigger value="reviews">Customer Reviews</TabsTrigger>
          <TabsTrigger value="overview">Product Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Rating Summary */}
            <div className="lg:col-span-1">
              <div className="bg-muted/30 rounded-2xl p-6">
                <div className="text-center mb-6">
                  <div className="text-5xl font-heading font-bold text-foreground mb-2">
                    {averageRating.toFixed(1)}
                  </div>
                  <div className="flex justify-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.round(averageRating)
                            ? 'fill-accent text-accent'
                            : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Based on {reviews.length} reviews
                  </p>
                </div>

                {/* Rating Bars */}
                <div className="space-y-2 mb-6">
                  {[5, 4, 3, 2, 1].map((star, index) => (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground w-8">{star} ★</span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent rounded-full transition-all duration-500"
                          style={{
                            width: `${(ratingCounts[index] / reviews.length) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-8">
                        {ratingCounts[index]}
                      </span>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowReviewForm(!showReviewForm)}
                >
                  Write a Review
                </Button>
              </div>
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-6">
              {/* Review Form */}
              {showReviewForm && (
                <div className="bg-muted/30 rounded-2xl p-6 animate-fade-in">
                  <h3 className="font-semibold text-foreground mb-4">Write Your Review</h3>
                  
                  <div className="mb-4">
                    <label className="text-sm text-muted-foreground mb-2 block">Your Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setNewRating(star)}
                          className="p-1"
                        >
                          <Star
                            className={`w-6 h-6 transition-colors ${
                              star <= newRating
                                ? 'fill-accent text-accent'
                                : 'text-muted-foreground hover:text-accent'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="text-sm text-muted-foreground mb-2 block">Your Review</label>
                    <Textarea
                      placeholder={`Share your experience with ${productName}...`}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={handleSubmitReview}>Submit Review</Button>
                    <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Individual Reviews */}
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border border-border rounded-xl p-6 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{review.name}</span>
                          {review.verified && (
                            <Badge variant="secondary" className="text-xs">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified Purchase
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">{review.date}</span>
                        {review.productVariant && (
                          <span className="text-xs text-muted-foreground block">
                            Purchased: {review.productVariant}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'fill-accent text-accent'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-foreground/80 mb-4 leading-relaxed">{review.comment}</p>

                  {/* Pros and Cons */}
                  {(review.pros?.length || review.cons?.length) && (
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      {review.pros && review.pros.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-success mb-2 flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            Pros
                          </h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {review.pros.map((pro, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-success mt-1">•</span>
                                {pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {review.cons && review.cons.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-warning mb-2 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            Cons
                          </h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {review.cons.map((con, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-warning mt-1">•</span>
                                {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    Helpful ({review.helpful})
                  </button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          {overview ? (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Quality Scores */}
              <div className="space-y-6">
                <div className="bg-muted/30 rounded-2xl p-6">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-primary" />
                    Quality Ratings
                  </h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Print Quality', score: overview.qualityScore },
                      { label: 'Value for Money', score: overview.valueScore },
                      { label: 'Customer Service', score: overview.serviceScore },
                      { label: 'Delivery Speed', score: overview.deliveryScore }
                    ].map((item) => (
                      <div key={item.label} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">{item.label}</span>
                          <span className="text-sm font-medium">{item.score}/5.0</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${(item.score / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Product Highlights */}
                <div className="bg-muted/30 rounded-2xl p-6">
                  <h3 className="font-semibold text-foreground mb-4">Product Highlights</h3>
                  <ul className="space-y-2">
                    {overview.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Usage and Tips */}
              <div className="space-y-6">
                <div className="bg-muted/30 rounded-2xl p-6">
                  <h3 className="font-semibold text-foreground mb-4">Common Uses</h3>
                  <div className="flex flex-wrap gap-2">
                    {overview.commonUses.map((use, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {use}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="bg-muted/30 rounded-2xl p-6">
                  <h3 className="font-semibold text-foreground mb-4">Pro Tips</h3>
                  <ul className="space-y-3">
                    {overview.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 flex-shrink-0">
                          <span className="text-xs font-medium text-primary">{index + 1}</span>
                        </div>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Info className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Product overview coming soon...</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductReviews;
