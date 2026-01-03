import { Product, ProductCustomization, BulkDiscount } from '@/types/product';

interface PriceBreakdown {
  basePrice: number;
  sizeMultiplier: number;
  paperMultiplier: number;
  colorAddition: number;
  doubleSideAddition: number;
  laminationAddition: number;
  finishingAddition: number;
  urgentAddition: number;
  subtotal: number;
  bulkDiscount: number;
  finalPrice: number;
  pricePerUnit: number;
}

export const calculatePrice = (
  product: Product,
  customization: ProductCustomization
): PriceBreakdown => {
  const { quantity, size, paperType, isColor, isDoubleSide, lamination, finishing, isUrgent } = customization;

  // Get size multiplier
  const selectedSize = product.sizes.find(s => s.id === size);
  const sizeMultiplier = selectedSize?.priceMultiplier || 1;

  // Get paper type multiplier
  const selectedPaper = product.paperTypes.find(p => p.id === paperType);
  const paperMultiplier = selectedPaper?.priceMultiplier || 1;

  // Calculate base unit price
  let unitPrice = product.basePrice * sizeMultiplier * paperMultiplier;

  // Color addition (if B/W is cheaper, color adds 20%)
  const colorAddition = isColor ? unitPrice * 0.2 : 0;
  unitPrice += colorAddition;

  // Double side addition (50% more)
  const doubleSideAddition = isDoubleSide && product.hasDoubleSide ? unitPrice * 0.5 : 0;
  unitPrice += doubleSideAddition;

  // Lamination addition (per unit)
  let laminationAddition = 0;
  if (lamination && lamination !== 'none' && product.hasLamination) {
    laminationAddition = lamination === 'matte' ? 0.5 : lamination === 'glossy' ? 0.5 : 0;
    unitPrice += laminationAddition;
  }

  // Calculate subtotal before finishing
  const subtotal = unitPrice * quantity;

  // Finishing addition (flat fee)
  const selectedFinishing = product.finishings.find(f => f.id === finishing);
  const finishingAddition = selectedFinishing?.price || 0;

  // Urgent delivery addition (25% extra)
  const urgentAddition = isUrgent && product.hasUrgentDelivery ? subtotal * 0.25 : 0;

  // Calculate bulk discount
  const bulkDiscountPercent = getBulkDiscountPercent(product.bulkDiscounts, quantity);
  const preTotalBeforeDiscount = subtotal + finishingAddition + urgentAddition;
  const bulkDiscount = preTotalBeforeDiscount * (bulkDiscountPercent / 100);

  // Final price
  const finalPrice = preTotalBeforeDiscount - bulkDiscount;
  const pricePerUnit = finalPrice / quantity;

  return {
    basePrice: product.basePrice,
    sizeMultiplier,
    paperMultiplier,
    colorAddition: colorAddition * quantity,
    doubleSideAddition: doubleSideAddition * quantity,
    laminationAddition: laminationAddition * quantity,
    finishingAddition,
    urgentAddition,
    subtotal,
    bulkDiscount,
    finalPrice,
    pricePerUnit
  };
};

const getBulkDiscountPercent = (discounts: BulkDiscount[], quantity: number): number => {
  const sortedDiscounts = [...discounts].sort((a, b) => b.minQuantity - a.minQuantity);
  const applicableDiscount = sortedDiscounts.find(d => quantity >= d.minQuantity);
  return applicableDiscount?.discountPercent || 0;
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(price);
};
