import { useState } from "react";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Package, Truck, CheckCircle, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import ApiService from "@/services/api";

const TrackOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState<null | {
    orderNumber: string;
    status: string;
    timeline: any[];
    tracking: any;
    estimatedDelivery?: string;
  }>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderId.trim() && !orderNumber.trim()) {
      toast.error("Please enter your Order ID or Order Number");
      return;
    }

    setLoading(true);
    try {
      let response;
      
      if (orderNumber.trim()) {
        // Track by order number (public tracking)
        response = await ApiService.trackOrder(orderId.trim() || 'unknown', orderNumber.trim());
      } else {
        // Track by order ID (requires authentication or order number)
        response = await ApiService.trackOrder(orderId.trim());
      }

      if (response.success) {
        setOrderStatus(response.data.tracking);
        toast.success("Order found!");
      } else {
        setOrderStatus(null);
        toast.error(response.message || "Order not found. Please check your details.");
      }
    } catch (error: any) {
      console.error('Track order error:', error);
      setOrderStatus(null);
      
      // Fallback to demo data for development
      if (orderId.toUpperCase().startsWith("ORD") || orderNumber.toUpperCase().startsWith("ORD")) {
        setOrderStatus({
          orderNumber: orderId.toUpperCase() || orderNumber.toUpperCase(),
          status: "processing",
          timeline: [
            { status: "pending", message: "Order placed successfully", timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
            { status: "confirmed", message: "Payment confirmed", timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
            { status: "processing", message: "Order is being processed", timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) }
          ],
          tracking: {
            currentLocation: "Production Facility",
            estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
          }
        });
        toast.success("Order found! (Demo data)");
      } else {
        toast.error("Order not found. Please check your Order ID or Order Number.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusSteps = (status: string, timeline: any[]) => {
    const allSteps = [
      { key: 'pending', title: 'Order Placed', icon: Package },
      { key: 'confirmed', title: 'Payment Confirmed', icon: CheckCircle },
      { key: 'processing', title: 'In Production', icon: Package },
      { key: 'shipped', title: 'Shipped', icon: Truck },
      { key: 'delivered', title: 'Delivered', icon: CheckCircle }
    ];

    const timelineMap = timeline.reduce((acc, item) => {
      acc[item.status] = item;
      return acc;
    }, {});

    return allSteps.map(step => ({
      ...step,
      completed: timelineMap[step.key] ? true : false,
      date: timelineMap[step.key] ? new Date(timelineMap[step.key].timestamp).toLocaleDateString() : undefined,
      message: timelineMap[step.key]?.message
    }));
  };

  return (
    <Layout>
      <SEO 
        title="Track Your Order - Real-time Order Status | PrintHub"
        description="Track your printing order status in real-time. Enter your order ID to get updates on production, shipping, and delivery."
        keywords="order tracking, print order status, delivery tracking, order updates"
      />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/20 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Track Your Order
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Enter your Order ID to get real-time updates on your print order status
          </p>
        </div>
      </section>

      {/* Track Form */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5 text-primary" />
                Enter Order Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTrack} className="space-y-4">
                <div className="flex gap-4">
                  <Input
                    placeholder="Enter Order Number (e.g., ORD12345)"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Tracking...
                      </>
                    ) : (
                      "Track Order"
                    )}
                  </Button>
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  <span>or</span>
                </div>
                <Input
                  placeholder="Enter Order ID (for logged-in users)"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                />
              </form>
              <p className="text-sm text-muted-foreground mt-3">
                You can find your Order Number in your confirmation email or SMS.
              </p>
            </CardContent>
          </Card>

          {/* Order Status Display */}
          {orderStatus && (
            <Card className="mt-8 shadow-lg animate-fade-in">
              <CardHeader className="bg-primary/5 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">Order #{orderStatus.orderNumber}</CardTitle>
                    <p className="text-muted-foreground text-sm mt-1">
                      Current Status: <span className="font-medium capitalize">{orderStatus.status}</span>
                    </p>
                    {orderStatus.estimatedDelivery && (
                      <p className="text-muted-foreground text-sm">
                        Expected Delivery: {new Date(orderStatus.estimatedDelivery).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <span className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm font-medium capitalize">
                    {orderStatus.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {orderStatus.tracking?.currentLocation && (
                  <p className="text-muted-foreground mb-6">
                    <strong>Current Location:</strong> {orderStatus.tracking.currentLocation}
                  </p>
                )}

                {/* Progress Steps */}
                <div className="relative">
                  {getStatusSteps(orderStatus.status, orderStatus.timeline || []).map((step, index, steps) => (
                    <div key={step.key} className="flex gap-4 pb-8 last:pb-0">
                      {/* Line */}
                      {index !== steps.length - 1 && (
                        <div
                          className={`absolute left-4 w-0.5 h-8 mt-8 ${
                            step.completed ? "bg-primary" : "bg-muted"
                          }`}
                          style={{ top: `${index * 56 + 24}px` }}
                        />
                      )}
                      
                      {/* Icon */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          step.completed
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Clock className="w-4 h-4" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <p
                          className={`font-medium ${
                            step.completed ? "text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {step.title}
                        </p>
                        {step.message && (
                          <p className="text-sm text-muted-foreground">{step.message}</p>
                        )}
                        {step.date && (
                          <p className="text-sm text-muted-foreground">{step.date}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Help Section */}
          <div className="mt-12 text-center">
            <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
            <p className="text-muted-foreground mb-4">
              Can't find your order or have questions about delivery?
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button variant="outline" asChild>
                <a href="/contact">Contact Support</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
                  WhatsApp Us
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TrackOrder;
