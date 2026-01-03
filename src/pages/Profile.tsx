import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, Mail, Phone, MapPin, Edit2, Package, Heart, 
  LogOut, Bell, Shield, CreditCard, Clock, Loader2
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import ApiService from "@/services/api";

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address?.street || "",
  });

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address?.street || "",
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [ordersResponse, statsResponse] = await Promise.all([
          ApiService.getOrders({ limit: 5 }),
          ApiService.getUserDashboard()
        ]);

        if (ordersResponse.success) {
          setOrders(ordersResponse.data.orders);
        }

        if (statsResponse.success) {
          setDashboardStats(statsResponse.data.stats);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile({
        name: profile.name,
        phone: profile.phone,
        address: {
          street: profile.address,
          city: user?.address?.city || '',
          state: user?.address?.state || '',
          zipCode: user?.address?.zipCode || '',
          country: user?.address?.country || 'India'
        }
      });
      setIsEditing(false);
    } catch (error) {
      // Error handled by AuthContext
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">Please login to view your profile.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO 
        title={`${user.name} - Profile | PrintHub`}
        description="Manage your PrintHub account, view order history, and update your profile information."
      />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/20 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center shadow-glow">
              <span className="text-primary-foreground font-heading font-bold text-3xl">
                {user.name.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold">{user.name}</h1>
              <p className="text-muted-foreground">{user.email}</p>
              {!user.isEmailVerified && (
                <p className="text-warning text-sm">Email not verified</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Profile Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="profile" className="space-y-8">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Manage your personal details</CardDescription>
                  </div>
                  <Button
                    variant={isEditing ? "default" : "outline"}
                    size="sm"
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : isEditing ? (
                      "Save Changes"
                    ) : (
                      <>
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                      </>
                    )}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        Full Name
                      </label>
                      {isEditing ? (
                        <Input
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        />
                      ) : (
                        <p className="text-foreground">{profile.name}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        Email Address
                      </label>
                      {isEditing ? (
                        <Input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        />
                      ) : (
                        <p className="text-foreground">{profile.email}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        Phone Number
                      </label>
                      {isEditing ? (
                        <Input
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        />
                      ) : (
                        <p className="text-foreground">{profile.phone}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        Address
                      </label>
                      {isEditing ? (
                        <Input
                          value={profile.address}
                          onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                        />
                      ) : (
                        <p className="text-foreground">{profile.address}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="text-center p-4">
                  <Package className="w-8 h-8 mx-auto text-primary mb-2" />
                  <p className="text-2xl font-bold">{dashboardStats?.totalOrders || 0}</p>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                </Card>
                <Card className="text-center p-4">
                  <Heart className="w-8 h-8 mx-auto text-accent mb-2" />
                  <p className="text-2xl font-bold">{dashboardStats?.statusCounts?.pending || 0}</p>
                  <p className="text-sm text-muted-foreground">Pending Orders</p>
                </Card>
                <Card className="text-center p-4">
                  <CreditCard className="w-8 h-8 mx-auto text-success mb-2" />
                  <p className="text-2xl font-bold">₹{Math.round(dashboardStats?.totalSpent || 0)}</p>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                </Card>
                <Card className="text-center p-4">
                  <Clock className="w-8 h-8 mx-auto text-warning mb-2" />
                  <p className="text-2xl font-bold">{dashboardStats?.statusCounts?.delivered || 0}</p>
                  <p className="text-sm text-muted-foreground">Delivered</p>
                </Card>
              </div>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>View and track all your orders</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <div
                        key={order._id}
                        className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-border rounded-lg hover:border-primary/30 transition-colors"
                      >
                        <div className="space-y-1">
                          <p className="font-semibold">#{order.orderNumber}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.items?.length} item(s)
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 mt-4 md:mt-0">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              order.status === "delivered"
                                ? "bg-success/10 text-success"
                                : order.status === "cancelled"
                                ? "bg-destructive/10 text-destructive"
                                : "bg-warning/10 text-warning"
                            }`}
                          >
                            {order.status}
                          </span>
                          <span className="font-semibold">₹{Math.round(order.total)}</span>
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/orders/${order._id}`}>View</Link>
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No orders yet</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive order updates via email</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Password & Security</p>
                        <p className="text-sm text-muted-foreground">Change your password</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Update</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Payment Methods</p>
                        <p className="text-sm text-muted-foreground">Manage saved payment options</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <Button variant="destructive" className="w-full md:w-auto" onClick={logout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default Profile;
