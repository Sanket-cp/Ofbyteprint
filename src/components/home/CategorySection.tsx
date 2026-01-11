import { Link } from 'react-router-dom';
import { categories } from '@/data/products';
import { CreditCard, Flag, Image, FileText, Shirt, Tag, Frame, Sparkles } from 'lucide-react';
import { useState } from 'react';

import productCards from '@/assets/product-cards.jpg';
import productBanner from '@/assets/product-banner.jpg';
import productFlyers from '@/assets/product-flyers.jpg';
import productTshirts from '@/assets/product-tshirts.jpg';
import productStickers from '@/assets/product-stickers.jpg';

const iconMap: Record<string, React.ReactNode> = {
  CreditCard: <CreditCard className="h-4 w-4" />,
  Flag: <Flag className="h-4 w-4" />,
  Image: <Image className="h-4 w-4" />,
  FileText: <FileText className="h-4 w-4" />,
  Shirt: <Shirt className="h-4 w-4" />,
  Tag: <Tag className="h-4 w-4" />,
  Frame: <Frame className="h-4 w-4" />,
  Sparkles: <Sparkles className="h-4 w-4" />,
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
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (categoryId: string) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    setHoveredCategory(categoryId);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredCategory(null);
    }, 150); // 150ms delay before hiding
    setHoverTimeout(timeout);
  };

  // Product lists for each category (reduced for better display)
  const categoryProducts = {
    'all': [
      'Business Cards',
      'Banners & Signage', 
      'Flyers & Brochures',
      'Custom T-Shirts',
      'Stickers & Labels',
      'Posters & Prints'
    ],
    'business-cards': [
      'Standard Business Cards',
      'Premium Business Cards',
      'Luxury Business Cards',
      'Eco-Friendly Cards',
      'Textured Business Cards',
      'Foil Stamped Cards'
    ],
    'banners': [
      'Flex Banners',
      'Vinyl Banners', 
      'Mesh Banners',
      'Fabric Banners',
      'PVC Banners',
      'Canvas Banners'
    ],
    'flyers': [
      'Paper Flyers',
      'Brochures',
      'Leaflets',
      'Tri-fold Brochures',
      'Bi-fold Brochures',
      'Catalog Printing'
    ],
    'merchandise': [
      'Custom T-Shirts',
      'Printed Mugs',
      'Custom Keychains',
      'Branded Caps',
      'Custom Bags',
      'Phone Cases'
    ],
    'stickers': [
      'Vinyl Stickers',
      'Paper Stickers', 
      'Transparent Stickers',
      'Die-Cut Stickers',
      'Holographic Stickers',
      'Waterproof Stickers'
    ],
    'posters': [
      'A4 Posters',
      'A3 Posters',
      'Large Format Posters',
      'Canvas Prints',
      'Photo Prints',
      'Art Prints'
    ],
    'photo-frames': [
      'Wooden Photo Frames',
      'Metal Photo Frames',
      'Acrylic Photo Frames',
      'Digital Photo Frames',
      'Collage Frames',
      'Custom Frames'
    ],
    'custom': [
      'Custom Designs',
      'Personalized Gifts',
      'Special Orders',
      'Corporate Branding',
      'Event Materials',
      'Promotional Items'
    ]
  };

  return (
    <section className="bg-background border-b border-border/30 relative">
      <div className="container mx-auto px-4">
        {/* Arc Print Style Category Navigation */}
        <div className="py-3">
          <div className="flex items-center justify-center gap-1 overflow-x-auto">
            {/* All Products Tab - First Position */}
            <div 
              className="relative flex-shrink-0"
              onMouseEnter={() => handleMouseEnter('all')}
              onMouseLeave={handleMouseLeave}
            >
              {/* All Products Button */}
              <Link
                to="/products"
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg hover:bg-primary/5 transition-all duration-200 min-w-[100px] text-center"
              >
                {/* All Products Icon */}
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                  <Sparkles className="h-4 w-4" />
                </div>
                
                {/* All Products Name */}
                <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors duration-200 whitespace-nowrap">
                  All Products
                </span>
              </Link>
            </div>

            {/* Category Tabs */}
            {categories.map((category, index) => (
              <div
                key={category.id}
                className="relative flex-shrink-0"
                onMouseEnter={() => handleMouseEnter(category.id)}
                onMouseLeave={handleMouseLeave}
              >
                {/* Category Button */}
                <Link
                  to={`/products?category=${category.id}`}
                  className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg hover:bg-primary/5 transition-all duration-200 min-w-[100px] text-center"
                >
                  {/* Category Icon */}
                  <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-200">
                    {iconMap[category.icon]}
                  </div>
                  
                  {/* Category Name */}
                  <span className="text-xs font-medium text-foreground hover:text-primary transition-colors duration-200 whitespace-nowrap">
                    {category.name}
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* All Products Mega Dropdown */}
      {hoveredCategory === 'all' && (
        <div 
          className="absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-xl z-50 animate-fade-in"
          onMouseEnter={() => handleMouseEnter('all')}
          onMouseLeave={handleMouseLeave}
        >
        <div className="container mx-auto p-6">
          <div className="grid grid-cols-6 gap-8">
            {/* All Custom Products */}
            <div>
              <h4 className="font-heading font-bold text-sm text-foreground mb-3">All Custom Products</h4>
              <div className="space-y-2">
                <Link to="/products?search=2024-calendars" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">2024 Calendars</Link>
                <Link to="/products?search=acrylic-clocks" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Acrylic Clocks</Link>
                <Link to="/products?search=acrylic-medals" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Acrylic Medals</Link>
                <Link to="/products?search=acrylic-photo-frames" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Acrylic Photo Frames</Link>
                <Link to="/products?search=baggy-hats" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Baggy Hats</Link>
                <Link to="/products?search=banners" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Banners</Link>
                <Link to="/products?search=black-coffee-mugs" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Black Coffee Mugs</Link>
                <Link to="/products?search=booklet" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Booklet</Link>
                <Link to="/products?search=bookmarks" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Bookmarks</Link>
                <Link to="/products?search=button-badges" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Button Badges</Link>
                <Link to="/products?search=canvas-photo-frame" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Canvas Photo Frame</Link>
                <Link to="/products?search=certificate" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Certificate</Link>
                <Link to="/products?search=coasters" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Coasters</Link>
                <Link to="/products?search=corporate-gifts" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Corporate Gifts</Link>
                <Link to="/products?search=custom-caps" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Custom Caps</Link>
              </div>
            </div>

            {/* Office Stationeries & Notebooks */}
            <div>
              <h4 className="font-heading font-bold text-sm text-foreground mb-3">Office Stationeries & Notebooks</h4>
              <div className="space-y-2">
                <Link to="/products?search=custom-fridge-magnets" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Custom Fridge Magnets</Link>
                <Link to="/products?search=custom-mugs" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Custom Mugs</Link>
                <Link to="/products?search=custom-photo-frames" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Custom Photo Frames</Link>
                <Link to="/products?search=custom-posters" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Custom Posters</Link>
                <Link to="/products?search=custom-water-bottles" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Custom Water Bottles</Link>
                <Link to="/products?search=customized-holi-with-photo" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Customized Holi With Photo</Link>
                <Link to="/products?search=dangler" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Dangler</Link>
                <Link to="/products?search=desk-organizers" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Desk Organizers</Link>
                <Link to="/products?search=diary-notebook" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Diary Notebook</Link>
                <Link to="/products?search=door-hangers" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Door Hangers</Link>
                <Link to="/products?search=door-name-plates" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Door Name Plates</Link>
                <Link to="/products?search=envelope" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Envelope</Link>
                <Link to="/products?search=flyers" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Flyers</Link>
                <Link to="/products?search=glass-sticker" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Glass Sticker</Link>
                <Link to="/products?search=greeting-cards" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Greeting Cards</Link>
              </div>
            </div>

            {/* Drinkware */}
            <div>
              <h4 className="font-heading font-bold text-sm text-foreground mb-3">Drinkware</h4>
              <div className="space-y-2">
                <Link to="/products/id-card-holders" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">ID Card Holders</Link>
                <Link to="/products/invitation-card" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Invitation Card</Link>
                <Link to="/products/key-chains" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Key Chains</Link>
                <Link to="/products/led-clip-on-frame" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">LED Clip On Frame</Link>
                <Link to="/products/labels" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Labels</Link>
                <Link to="/products/letterhead-printing" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Letterhead Printing</Link>
                <Link to="/products/menu-card" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Menu Card</Link>
                <Link to="/products/mouse-pad" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Mouse Pad</Link>
                <Link to="/products/name-badge-magnet" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Name Badge - Magnet</Link>
                <Link to="/products/panama-hats" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Panama Hats</Link>
                <Link to="/products/paper-birthday-caps" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Paper Birthday caps</Link>
                <Link to="/products/paper-caps" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Paper Caps</Link>
                <Link to="/products/paper-photo-frames" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Paper Photo Frames</Link>
                <Link to="/products/pendrives" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Pendrives</Link>
                <Link to="/products/pens" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Pens</Link>
              </div>
            </div>

            {/* T-Shirts, Caps & Bags */}
            <div>
              <h4 className="font-heading font-bold text-sm text-foreground mb-3">T-Shirts, Caps & Bags</h4>
              <div className="space-y-2">
                <Link to="/products/polo-t-shirts" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Polo T-Shirts</Link>
                <Link to="/products/premium-polo-t-shirts" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Premium Polo T-Shirts</Link>
                <Link to="/products/presentation-folders" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Presentation Folders</Link>
                <Link to="/products/printed-bags" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Printed Bags</Link>
                <Link to="/products/round-neck-t-shirts" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Round Neck T-Shirts</Link>
                <Link to="/products/safety-graphics" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Safety Graphics</Link>
                <Link to="/products/split-canvas-gallery-wraps" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Split Canvas Gallery Wraps</Link>
                <Link to="/products/sports-t-shirts" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Sports T-Shirts</Link>
                <Link to="/products/standee" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Standee</Link>
                <Link to="/products/tent-card" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Tent Card</Link>
                <Link to="/products/thank-you-card" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Thank You card</Link>
                <Link to="/products/visiting-cards" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Visiting Cards</Link>
                <Link to="/products/welcome-kit" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Welcome Kit</Link>
                <Link to="/products/winter-wear" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Winter Wear</Link>
                <Link to="/products/wooden-photo-frames" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Wooden Photo Frames</Link>
              </div>
            </div>

            {/* Customised Gifts */}
            <div>
              <h4 className="font-heading font-bold text-sm text-foreground mb-3">Customised Gifts</h4>
              <div className="space-y-2">
                <Link to="/products/visiting-cards" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Visiting Cards</Link>
                <Link to="/products/business-cards" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Business Cards</Link>
                <Link to="/products/premium-cards" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Premium Cards</Link>
                <Link to="/products/custom-gifts" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Custom Gifts</Link>
                <Link to="/products/photo-frames" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Photo Frames</Link>
                <Link to="/products/personalized-items" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Personalized Items</Link>
              </div>
            </div>

            {/* Wall Graphics & Large Format Printing */}
            <div>
              <h4 className="font-heading font-bold text-sm text-foreground mb-3">Wall Graphics & Large Format Printing</h4>
              <div className="space-y-2">
                <Link to="/products/wall-stickers" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Wall Stickers</Link>
                <Link to="/products/large-banners" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Large Banners</Link>
                <Link to="/products/vinyl-graphics" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Vinyl Graphics</Link>
                <Link to="/products/floor-graphics" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Floor Graphics</Link>
                <Link to="/products/window-graphics" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Window Graphics</Link>
                <Link to="/products/vehicle-wraps" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Vehicle Wraps</Link>
              </div>
            </div>
          </div>
        </div>
        </div>
      )}

      {/* Business Cards Mega Dropdown */}
      {hoveredCategory === 'business-cards' && (
        <div 
          className="absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-xl z-50 animate-fade-in"
          onMouseEnter={() => handleMouseEnter('business-cards')}
          onMouseLeave={handleMouseLeave}
        >
          <div className="container mx-auto p-6">
            <div className="grid grid-cols-4 gap-8">
              <div>
                <h4 className="font-heading font-bold text-sm text-foreground mb-3">Standard Cards</h4>
                <div className="space-y-2">
                  <Link to="/products/standard-business-cards" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Standard Business Cards</Link>
                  <Link to="/products/premium-business-cards" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Premium Business Cards</Link>
                  <Link to="/products/luxury-business-cards" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Luxury Business Cards</Link>
                  <Link to="/products/eco-friendly-cards" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Eco-Friendly Cards</Link>
                </div>
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-foreground mb-3">Special Finishes</h4>
                <div className="space-y-2">
                  <Link to="/products/textured-business-cards" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Textured Business Cards</Link>
                  <Link to="/products/foil-stamped-cards" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Foil Stamped Cards</Link>
                  <Link to="/products/embossed-cards" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Embossed Cards</Link>
                  <Link to="/products/spot-uv-cards" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Spot UV Cards</Link>
                </div>
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-foreground mb-3">Materials</h4>
                <div className="space-y-2">
                  <Link to="/products/plastic-cards" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Plastic Cards</Link>
                  <Link to="/products/metal-cards" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Metal Cards</Link>
                  <Link to="/products/wood-cards" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Wood Cards</Link>
                  <Link to="/products/transparent-cards" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Transparent Cards</Link>
                </div>
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-foreground mb-3">Shapes & Sizes</h4>
                <div className="space-y-2">
                  <Link to="/products/standard-size-cards" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Standard Size</Link>
                  <Link to="/products/mini-cards" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Mini Cards</Link>
                  <Link to="/products/square-cards" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Square Cards</Link>
                  <Link to="/products/die-cut-cards" className="block text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Die-Cut Cards</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Banners Mega Dropdown */}
      {hoveredCategory === 'banners' && (
        <div 
          className="absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-xl z-50 animate-fade-in"
          onMouseEnter={() => handleMouseEnter('banners')}
          onMouseLeave={handleMouseLeave}
        >
          <div className="container mx-auto p-6">
            <div className="grid grid-cols-4 gap-8">
              <div>
                <h4 className="font-heading font-bold text-sm text-foreground mb-3">Indoor Banners</h4>
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground hover:text-primary cursor-pointer">Flex Banners</div>
                  <div className="text-xs text-muted-foreground hover:text-primary cursor-pointer">Vinyl Banners</div>
                  <div className="text-xs text-muted-foreground hover:text-primary cursor-pointer">Fabric Banners</div>
                  <div className="text-xs text-muted-foreground hover:text-primary cursor-pointer">Canvas Banners</div>
                </div>
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-foreground mb-3">Outdoor Banners</h4>
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground hover:text-primary cursor-pointer">Mesh Banners</div>
                  <div className="text-xs text-muted-foreground hover:text-primary cursor-pointer">PVC Banners</div>
                  <div className="text-xs text-muted-foreground hover:text-primary cursor-pointer">Weather Resistant</div>
                  <div className="text-xs text-muted-foreground hover:text-primary cursor-pointer">Heavy Duty Banners</div>
                </div>
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-foreground mb-3">Display Banners</h4>
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground hover:text-primary cursor-pointer">Roll Up Banners</div>
                  <div className="text-xs text-muted-foreground hover:text-primary cursor-pointer">Pop Up Banners</div>
                  <div className="text-xs text-muted-foreground hover:text-primary cursor-pointer">X-Frame Banners</div>
                  <div className="text-xs text-muted-foreground hover:text-primary cursor-pointer">Retractable Banners</div>
                </div>
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-foreground mb-3">Sizes</h4>
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground hover:text-primary cursor-pointer">Small (2x3 ft)</div>
                  <div className="text-xs text-muted-foreground hover:text-primary cursor-pointer">Medium (3x5 ft)</div>
                  <div className="text-xs text-muted-foreground hover:text-primary cursor-pointer">Large (4x8 ft)</div>
                  <div className="text-xs text-muted-foreground hover:text-primary cursor-pointer">Custom Sizes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other Categories Mega Dropdowns */}
      {hoveredCategory === 'flyers' && (
        <div 
          className="absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-xl z-50 animate-fade-in"
          onMouseEnter={() => handleMouseEnter('flyers')}
          onMouseLeave={handleMouseLeave}
        >
          <div className="container mx-auto p-6">
            <div className="grid grid-cols-4 gap-8">
              <div>
                <h4 className="font-heading font-bold text-sm text-foreground mb-3">Flyers & Leaflets</h4>
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground hover:text-primary cursor-pointer">Paper Flyers</div>
                  <div className="text-xs text-muted-foreground hover:text-primary cursor-pointer">Leaflets</div>
                  <div className="text-xs text-muted-foreground hover:text-primary cursor-pointer">Handbills</div>
                  <div className="text-xs text-muted-foreground hover:text-primary cursor-pointer">Door Hangers</div>
                </div>
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-foreground mb-3">Brochures</h4>
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground hover:text-primary cursor-pointer">Tri-fold Brochures</div>
                  <div className="text-xs text-muted-foreground hover:text-primary cursor-pointer">Bi-fold Brochures</div>
                  <div className="text-xs text-muted-foreground hover:text-primary cursor-pointer">Z-fold Brochures</div>
                  <div className="text-xs text-muted-foreground hover:text-primary cursor-pointer">Gate-fold Brochures</div>
                </div>
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-foreground mb-3">Catalogs</h4>
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground hover:text-primary cursor-pointer">Product Catalogs</div>
                  <div className="text-xs text-muted-foreground hover:text-primary cursor-pointer">Service Catalogs</div>
                  <div className="text-xs text-muted-foreground hover:text-primary cursor-pointer">Company Profiles</div>
                  <div className="text-xs text-muted-foreground hover:text-primary cursor-pointer">Annual Reports</div>
                </div>
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-foreground mb-3">Sizes & Paper</h4>
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground hover:text-primary cursor-pointer">A4 Size</div>
                  <div className="text-xs text-muted-foreground hover:text-primary cursor-pointer">A5 Size</div>
                  <div className="text-xs text-muted-foreground hover:text-primary cursor-pointer">Glossy Paper</div>
                  <div className="text-xs text-muted-foreground hover:text-primary cursor-pointer">Matte Paper</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add similar mega dropdowns for other categories */}
      {(hoveredCategory === 'merchandise' || hoveredCategory === 'stickers' || hoveredCategory === 'posters' || hoveredCategory === 'photo-frames' || hoveredCategory === 'custom') && (
        <div 
          className="absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-xl z-50 animate-fade-in"
          onMouseEnter={() => handleMouseEnter(hoveredCategory)}
          onMouseLeave={handleMouseLeave}
        >
          <div className="container mx-auto p-6">
            <div className="grid grid-cols-4 gap-8">
              <div>
                <h4 className="font-heading font-bold text-sm text-foreground mb-3">{categories.find(c => c.id === hoveredCategory)?.name} Products</h4>
                <div className="space-y-2">
                  {(categoryProducts[hoveredCategory as keyof typeof categoryProducts] || []).map((product, idx) => (
                    <div key={idx} className="text-xs text-muted-foreground hover:text-primary cursor-pointer">{product}</div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-foreground mb-3">Popular Items</h4>
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground hover:text-primary cursor-pointer">Best Sellers</div>
                  <div className="text-xs text-muted-foreground hover:text-primary cursor-pointer">New Arrivals</div>
                  <div className="text-xs text-muted-foreground hover:text-primary cursor-pointer">Featured Products</div>
                  <div className="text-xs text-muted-foreground hover:text-primary cursor-pointer">Trending Items</div>
                </div>
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-foreground mb-3">Materials & Finishes</h4>
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground hover:text-primary cursor-pointer">Premium Quality</div>
                  <div className="text-xs text-muted-foreground hover:text-primary cursor-pointer">Standard Quality</div>
                  <div className="text-xs text-muted-foreground hover:text-primary cursor-pointer">Eco-Friendly</div>
                  <div className="text-xs text-muted-foreground hover:text-primary cursor-pointer">Waterproof</div>
                </div>
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-foreground mb-3">Customization</h4>
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground hover:text-primary cursor-pointer">Custom Design</div>
                  <div className="text-xs text-muted-foreground hover:text-primary cursor-pointer">Bulk Orders</div>
                  <div className="text-xs text-muted-foreground hover:text-primary cursor-pointer">Quick Delivery</div>
                  <div className="text-xs text-muted-foreground hover:text-primary cursor-pointer">Free Design</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CategorySection;