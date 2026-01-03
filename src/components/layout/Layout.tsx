import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import { MessageCircle } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      
      {/* WhatsApp Float Button */}
      <a
        href="https://wa.me/919876543210?text=Hi! I'm interested in your printing services."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-floating hover:scale-110 transition-transform flex items-center justify-center animate-float"
      >
        <MessageCircle className="h-7 w-7" />
      </a>
    </div>
  );
};

export default Layout;
