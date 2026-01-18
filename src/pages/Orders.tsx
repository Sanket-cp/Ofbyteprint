import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Package, Search, Filter, Calendar, Eye, 
  Loader2, AlertCircle, RefreshCw
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ApiService from "@/services/api";

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    confirmed: "bg-blue-100 text-blue-800 border-blue-200",
    processing: "bg-purple-100 text-purple-800 border-purple-200",
    shipped: "bg-indigo-100 text-indigo-800 border-indigo-200",
    delivered: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
    refunded: "bg-gray-100 text-gray-800 border-gray-200"
  };

  const fetchOrders = async (page = 1, refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else setLoading(true);

      const params: any = {
        page,
        limit: 10
      };

      if (statusFilter !== "all") {
        params.status = statusFilter;
      }

      const response = await ApiService.getOrders(params);
      
      if (response.success) {
        setOrders(response.data.orders);
        setCurrentPage(response.data.pagination.current);
        setTotalPages(response.data.pagination.pages);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders(1);
    }
  }, [user, statusFilter]);

  const handleRefresh = () => {
    fetchOrders(currentPage, true);
  };

  const handlePageChange = (page: number) => {
    fetchOrders(page);
  };

  const filteredOrders = orders.filter(order => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      order.orderNumber.toLowerCase().includes(searchLower) ||
      order.items?.some((item: any) => 
        item.productSnapshot?.name?.toLowerCase().includes(searchLower)
      )
    );
  });

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <AlertCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Please Login</h2>
          <p className="text-muted-foreground mb-6">You need to be logged in to view your orders.</p>
          <Button asChild>
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO 
        title="My Orders | PrintHub"
        description="View and track all your printing orders. Check order status, download invoices, and manage your print jobs."
      />

      {/* Header */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/20 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">My Orders</h1>
              <p className="text-muted-foreground">Track and manage all your printing orders</p>
            </div>
            <Button 
              onClick={handleRefresh} 
              disabled={refreshing}
              variant="outline"
              size="sm"
            >
              {refreshing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-border rounded-md bg-background"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Orders List */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading orders...</span>
            </div>
          ) : filteredOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Card key={order._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Package className="w-5 h-5 text-primary" />
                          <h3 className="font-semibold text-lg">#{order.orderNumber}</h3>
                          <Badge 
                            variant="outline" 
                            className={statusColors[order.status as keyof typeof statusColors]}
                          >
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div>
                            <p className="mb-1">
                              <strong>Items:</strong> {order.items?.length || 0} product(s)
                            </p>
                            <p className="mb-1">
                              <strong>Total:</strong> ₹{order.total?.toFixed(2) || '0.00'}
                            </p>
                          </div>
                          <div>
                            <p className="mb-1 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <strong>Ordered:</strong> {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                            <p className="mb-1">
                              <strong>Payment:</strong> 
                              <Badge 
                                variant="outline" 
                                size="sm" 
                                className={`ml-1 ${
                                  order.payment?.status === 'completed' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {order.payment?.status || 'pending'}
                              </Badge>
                            </p>
                          </div>
                        </div>

                        {order.items && order.items.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-border">
                            <p className="text-sm text-muted-foreground">
                              <strong>Products:</strong> {
                                order.items
                                  .map((item: any) => item.productSnapshot?.name || 'Unknown Product')
                                  .join(', ')
                              }
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/orders/${order._id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Link>
                        </Button>
                        {order.tracking?.trackingUrl && (
                          <Button variant="outline" size="sm" asChild>
                            <a 
                              href={order.tracking.trackingUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              Track Package
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-16">
                <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Orders Found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm || statusFilter !== "all" 
                    ? "No orders match your current filters." 
                    : "You haven't placed any orders yet."
                  }
                </p>
                {!searchTerm && statusFilter === "all" && (
                  <Button asChild>
                    <Link to="/products">Start Shopping</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Orders;