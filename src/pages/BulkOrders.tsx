import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Building2, 
  Phone, 
  Mail, 
  Upload,
  Send,
  FileText,
  CheckCircle,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import ApiService from '@/services/api';

const BulkOrders = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    productType: '',
    quantity: '',
    requirements: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        toast.error('File size must be less than 50MB');
        return;
      }
      
      // Check file type
      const allowedTypes = ['.pdf', '.png', '.jpg', '.jpeg', '.zip'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (!allowedTypes.includes(fileExtension)) {
        toast.error('Please upload PDF, PNG, JPG, or ZIP files only');
        return;
      }
      
      setSelectedFile(file);
      toast.success('File selected successfully');
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Prepare form data for API
      const enquiryData = {
        companyName: formData.companyName,
        contactPerson: formData.contactPerson,
        email: formData.email,
        phone: formData.phone,
        productType: formData.productType,
        quantity: formData.quantity,
        requirements: formData.requirements
      };

      // Submit to API
      const response = await ApiService.submitBulkOrderEnquiry(enquiryData);
      
      if (response.success) {
        setIsSubmitted(true);
        toast.success('Enquiry submitted! We will contact you within 24 hours.', {
          description: `Enquiry ID: ${response.data.enquiryId}`
        });
      }
    } catch (error: any) {
      console.error('Bulk order submission error:', error);
      toast.error(error.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      productType: '',
      quantity: '',
      requirements: '',
    });
    setSelectedFile(null);
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <Layout>
        <SEO 
          title="Thank You - Bulk Order Enquiry Submitted | PrintHub"
          description="Thank you for your bulk order enquiry. Our team will contact you within 24 hours with a customized quote."
        />
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="max-w-md mx-auto text-center">
            <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-success" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-foreground mb-4">
              Thank You for Your Enquiry!
            </h1>
            <p className="text-muted-foreground mb-8">
              Our team will review your requirements and get back to you within 24 hours 
              with a customized quote.
            </p>
            <Button onClick={resetForm}>
              Submit Another Enquiry
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO 
        title="Bulk Orders - Special Discounts on Large Orders | PrintHub"
        description="Get special discounts on bulk printing orders. Business cards, banners, flyers, and more. Free consultation and dedicated account manager."
        keywords="bulk printing, wholesale printing, large orders, business printing, corporate printing, bulk discounts"
      />
      <div className="bg-background min-h-screen">
        {/* Header */}
        <div className="gradient-primary">
          <div className="container mx-auto px-4 py-12 lg:py-16 text-center">
            <h1 className="font-heading text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
              Bulk Order Enquiry
            </h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">
              Get special discounts on large orders. Fill out the form below and our 
              dedicated team will provide you with a customized quote.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Company Name
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Your company name"
                        className="pl-10"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Contact Person
                    </label>
                    <Input
                      type="text"
                      placeholder="Your name"
                      value={formData.contactPerson}
                      onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="email@company.com"
                        className="pl-10"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        type="tel"
                        placeholder="+91 98765 43210"
                        className="pl-10"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Product Type
                    </label>
                    <select
                      className="w-full h-11 px-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-ring"
                      value={formData.productType}
                      onChange={(e) => handleInputChange('productType', e.target.value)}
                      required
                    >
                      <option value="">Select product type</option>
                      <option value="visiting-cards">Visiting Cards</option>
                      <option value="banners">Banners & Flex</option>
                      <option value="posters">Posters</option>
                      <option value="flyers">Flyers & Brochures</option>
                      <option value="tshirts">T-Shirts</option>
                      <option value="stickers">Stickers</option>
                      <option value="custom">Custom Products</option>
                      <option value="multiple">Multiple Products</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Approximate Quantity
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g., 5000"
                      value={formData.quantity}
                      onChange={(e) => handleInputChange('quantity', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Additional Requirements
                  </label>
                  <Textarea
                    placeholder="Tell us about your requirements - sizes, materials, finishing, timeline, etc."
                    rows={5}
                    value={formData.requirements}
                    onChange={(e) => handleInputChange('requirements', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Attach Reference/Design (Optional)
                  </label>
                  
                  {!selectedFile ? (
                    <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary transition-colors">
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground text-sm mb-1">
                        Click to upload file
                      </p>
                      <p className="text-xs text-muted-foreground mb-3">
                        PDF, PNG, JPG, ZIP (max 50MB)
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('file-upload')?.click()}
                      >
                        Choose File
                      </Button>
                      <input
                        id="file-upload"
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg,.zip"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className="border border-border rounded-xl p-4 bg-muted/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="h-8 w-8 text-primary" />
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {selectedFile.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={removeFile}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <Button 
                  type="submit" 
                  variant="hero" 
                  size="xl" 
                  className="w-full md:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Submit Enquiry
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Benefits */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-heading font-semibold text-lg text-foreground mb-4">
                  Bulk Order Benefits
                </h3>
                <ul className="space-y-3">
                  {[
                    'Up to 30% discount on large orders',
                    'Dedicated account manager',
                    'Priority production',
                    'Free design consultation',
                    'Flexible payment terms',
                    'Custom packaging options',
                  ].map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div className="bg-primary/5 rounded-xl p-6">
                <h3 className="font-heading font-semibold text-lg text-foreground mb-4">
                  Need Immediate Assistance?
                </h3>
                <div className="space-y-3">
                  <a
                    href="tel:+919876543210"
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Phone className="h-5 w-5" />
                    +91 98765 43210
                  </a>
                  <a
                    href="mailto:bulk@printhub.com"
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Mail className="h-5 w-5" />
                    bulk@printhub.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BulkOrders;
