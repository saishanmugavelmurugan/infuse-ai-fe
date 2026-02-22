import React, { useState, useEffect } from 'react';
import { 
  Settings, ToggleLeft, ToggleRight, RefreshCw, 
  ChevronDown, ChevronRight, Shield, Heart, Globe, Users,
  AlertCircle, CheckCircle, Loader2, Search, Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { API_URL } from '../../config/api';

const INTERNAL_ADMIN_KEY = 'infuse_internal_2025_secret';

const FeatureFlagAdmin = () => {
  const [features, setFeatures] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expandedProducts, setExpandedProducts] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState('all');
  const [togglingFeature, setTogglingFeature] = useState(null);

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/features/admin/summary`, {
        headers: {
          'x-internal-key': INTERNAL_ADMIN_KEY
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setFeatures(data);
        // Expand all products by default
        const expanded = {};
        data.products.forEach(p => { expanded[p.name] = true; });
        setExpandedProducts(expanded);
      } else {
        setError('Failed to load feature flags');
      }
    } catch (err) {
      setError('Connection error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleFeature = async (product, feature, currentState) => {
    setTogglingFeature(`${product}-${feature}`);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch(`${API_URL}/api/features/admin/${product}/${feature}/toggle`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-internal-key': INTERNAL_ADMIN_KEY
        },
        body: JSON.stringify({ enabled: !currentState })
      });
      
      if (response.ok) {
        const result = await response.json();
        setSuccess(result.message);
        // Refresh the data
        await fetchFeatures();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const err = await response.json();
        setError(err.detail || 'Failed to toggle feature');
      }
    } catch (err) {
      setError('Connection error: ' + err.message);
    } finally {
      setTogglingFeature(null);
    }
  };

  const toggleProduct = async (product, currentState) => {
    setTogglingFeature(`product-${product}`);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch(`${API_URL}/api/features/admin/${product}/toggle`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-internal-key': INTERNAL_ADMIN_KEY
        },
        body: JSON.stringify({ enabled: !currentState })
      });
      
      if (response.ok) {
        const result = await response.json();
        setSuccess(result.message);
        await fetchFeatures();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const err = await response.json();
        setError(err.detail || 'Failed to toggle product');
      }
    } catch (err) {
      setError('Connection error: ' + err.message);
    } finally {
      setTogglingFeature(null);
    }
  };

  const reloadFeatures = async () => {
    setLoading(true);
    try {
      await fetch(`${API_URL}/api/features/admin/reload`, {
        method: 'POST',
        headers: {
          'x-internal-key': INTERNAL_ADMIN_KEY
        }
      });
      await fetchFeatures();
      setSuccess('Feature flags reloaded from configuration');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to reload features');
    } finally {
      setLoading(false);
    }
  };

  const getProductIcon = (name) => {
    switch (name) {
      case 'healthtrack': return <Heart className="w-5 h-5 text-orange-500" />;
      case 'securesphere': return <Shield className="w-5 h-5 text-blue-500" />;
      case 'platform': return <Globe className="w-5 h-5 text-green-500" />;
      case 'admin': return <Users className="w-5 h-5 text-purple-500" />;
      default: return <Settings className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'free': return 'bg-green-100 text-green-700';
      case 'basic': return 'bg-blue-100 text-blue-700';
      case 'pro': return 'bg-purple-100 text-purple-700';
      case 'enterprise': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatFeatureName = (name) => {
    return name.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const filterFeatures = (productFeatures) => {
    return productFeatures.filter(feature => {
      const matchesSearch = searchQuery === '' || 
        formatFeatureName(feature.name).toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTier = filterTier === 'all' || feature.tier === filterTier;
      return matchesSearch && matchesTier;
    });
  };

  if (loading && !features) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Settings className="w-8 h-8 text-orange-500" />
            Feature Flag Management
          </h1>
          <p className="text-gray-600 mt-1">
            Enable or disable features across the platform without code changes
          </p>
        </div>
        <Button 
          onClick={reloadFeatures} 
          variant="outline"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Reload Config
        </Button>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-600 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          {success}
        </div>
      )}

      {/* Stats Overview */}
      {features && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-gray-900">{features.total_features}</div>
              <p className="text-sm text-gray-600">Total Features</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-600">{features.enabled_features}</div>
              <p className="text-sm text-gray-600">Enabled</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-red-600">{features.disabled_features}</div>
              <p className="text-sm text-gray-600">Disabled</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600">{features.products?.length || 0}</div>
              <p className="text-sm text-gray-600">Products</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tier Distribution */}
      {features?.by_tier && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Feature Tier Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 flex-wrap">
              {Object.entries(features.by_tier).map(([tier, count]) => (
                <div key={tier} className="flex items-center gap-2">
                  <Badge className={getTierColor(tier)}>{tier}</Badge>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Tiers</option>
            <option value="free">Free</option>
            <option value="basic">Basic</option>
            <option value="pro">Pro</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>
      </div>

      {/* Products and Features */}
      {features?.products?.map((product) => {
        const filteredFeatures = filterFeatures(product.features);
        if (filteredFeatures.length === 0 && searchQuery) return null;
        
        return (
          <Card key={product.name} className="overflow-hidden">
            <CardHeader 
              className="cursor-pointer hover:bg-gray-50 transition"
              onClick={() => setExpandedProducts(prev => ({
                ...prev,
                [product.name]: !prev[product.name]
              }))}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {expandedProducts[product.name] ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                  {getProductIcon(product.name)}
                  <div>
                    <CardTitle className="text-lg capitalize">{product.name}</CardTitle>
                    <CardDescription>
                      {product.enabled_count}/{product.feature_count} features enabled
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={product.enabled ? 'default' : 'secondary'}>
                    {product.enabled ? 'Active' : 'Inactive'}
                  </Badge>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleProduct(product.name, product.enabled);
                    }}
                    disabled={togglingFeature === `product-${product.name}`}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    {togglingFeature === `product-${product.name}` ? (
                      <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                    ) : product.enabled ? (
                      <ToggleRight className="w-6 h-6 text-green-500" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </CardHeader>
            
            {expandedProducts[product.name] && (
              <CardContent className="border-t">
                <div className="divide-y">
                  {filteredFeatures.map((feature) => (
                    <div 
                      key={feature.name}
                      className="py-4 flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-gray-900">
                            {formatFeatureName(feature.name)}
                          </span>
                          <Badge className={getTierColor(feature.tier)}>
                            {feature.tier}
                          </Badge>
                          {feature.requires_config?.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              Requires Config
                            </Badge>
                          )}
                        </div>
                        {feature.requires_config?.length > 0 && (
                          <p className="text-xs text-gray-500 mt-1">
                            Config: {feature.requires_config.join(', ')}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => toggleFeature(product.name, feature.name, feature.enabled)}
                        disabled={togglingFeature === `${product.name}-${feature.name}`}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                      >
                        {togglingFeature === `${product.name}-${feature.name}` ? (
                          <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                        ) : feature.enabled ? (
                          <ToggleRight className="w-6 h-6 text-green-500" />
                        ) : (
                          <ToggleLeft className="w-6 h-6 text-gray-400" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}

      {/* Last Updated */}
      {features?.last_updated && (
        <p className="text-sm text-gray-500 text-center">
          Last updated: {new Date(features.last_updated).toLocaleString()}
        </p>
      )}
    </div>
  );
};

export default FeatureFlagAdmin;
