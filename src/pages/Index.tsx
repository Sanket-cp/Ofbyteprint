import Layout from '@/components/layout/Layout';
import SEO from '@/components/SEO';
import HeroSection from '@/components/home/HeroSection';
import CategorySection from '@/components/home/CategorySection';
import MixedProductsSection from '@/components/home/MixedProductsSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import BulkOrderCTA from '@/components/home/BulkOrderCTA';

const Index = () => {
  return (
    <Layout>
      <SEO 
        title="PrintHub - Professional Printing Services | Business Cards, Banners & More"
        description="Get high-quality printing services for business cards, banners, flyers, and custom merchandise. Fast delivery, competitive prices, and professional results. Order online today!"
        keywords="printing services, business cards, banners, flyers, custom printing, online printing, professional printing, Mumbai printing, bulk printing"
      />
      <CategorySection />
      <HeroSection />
      <MixedProductsSection />
      <HowItWorksSection />
      <BulkOrderCTA />
    </Layout>
  );
};

export default Index;
