export interface ProductCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  image: string;
}

export interface PaperType {
  id: string;
  name: string;
  priceMultiplier: number;
}

export interface Size {
  id: string;
  name: string;
  dimensions: string;
  priceMultiplier: number;
}

export interface Finishing {
  id: string;
  name: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  basePrice: number;
  image: string;
  minQuantity: number;
  sizes: Size[];
  paperTypes: PaperType[];
  finishings: Finishing[];
  hasColor: boolean;
  hasDoubleSide: boolean;
  hasLamination: boolean;
  hasUrgentDelivery: boolean;
  bulkDiscounts: BulkDiscount[];
}

export interface BulkDiscount {
  minQuantity: number;
  discountPercent: number;
}

export interface ProductCustomization {
  productId: string;
  size: string;
  paperType: string;
  quantity: number;
  isColor: boolean;
  isDoubleSide: boolean;
  lamination: string;
  finishing: string;
  isUrgent: boolean;
  designFile?: File;
}

export interface CartItem {
  id: string;
  product: Product;
  customization: ProductCustomization;
  calculatedPrice: number;
  designFileName?: string;
}
