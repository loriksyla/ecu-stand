import React, { useState, useEffect, useMemo } from 'react';
import { X, Lock, Trash2, Package, CheckCircle, Clock, ChevronDown, ChevronUp, Search, RefreshCw, MapPin, BarChart3, TrendingUp, AlertOctagon } from 'lucide-react';
import { Order } from '../types';
import Button from './Button';

interface AdminPanelProps {
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Load orders on mount
  useEffect(() => {
    const loadOrders = () => {
      const stored = localStorage.getItem('ecu_orders');
      if (stored) {
        setOrders(JSON.parse(stored));
      }
    };
    loadOrders();
    window.addEventListener('storage', loadOrders);
    return () => window.removeEventListener('storage', loadOrders);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1234') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid Access Code');
    }
  };

  const updateStatus = (id: string, newStatus: Order['status']) => {
    const updatedOrders = orders.map(order => 
      order.id === id ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('ecu_orders', JSON.stringify(updatedOrders));
  };

  const deleteOrder = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation(); // Critical: Prevent row expansion when clicking delete
    
    if (window.confirm('Are you sure you want to delete this order PERMANENTLY?')) {
      const updatedOrders = orders.filter(order => order.id !== id);
      setOrders(updatedOrders);
      localStorage.setItem('ecu_orders', JSON.stringify(updatedOrders));
      if (expandedOrder === id) setExpandedOrder(null);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Packed': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'Shipped': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'Delivered': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'Canceled': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  // Analytics Calculations
  const analytics = useMemo(() => {
    const totalOrders = orders.length;
    const canceledOrders = orders.filter(o => o.status === 'Canceled').length;
    const activeOrders = totalOrders - canceledOrders;
    
    let totalRevenue = 0;
    orders.forEach(order => {
      if (order.status !== 'Canceled') {
        const qty = order.quantity || 1;
        const isHighShipping = order.country === 'Shqipëri' || order.country === 'Maqedoni e Veriut';
        const orderTotal = (14.99 * qty) + (isHighShipping ? 5.00 : 0);
        totalRevenue += orderTotal;
      }
    });

    const statusDistribution = {
      'Pending': orders.filter(o => o.status === 'Pending').length,
      'Packed': orders.filter(o => o.status === 'Packed').length,
      'Shipped': orders.filter(o => o.status === 'Shipped').length,
      'Delivered': orders.filter(o => o.status === 'Delivered').length,
      'Canceled': canceledOrders,
    };

    return { totalOrders, canceledOrders, activeOrders, totalRevenue, statusDistribution };
  }, [orders]);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] w-full max-w-md mx-auto p-6">
        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10">
          <Lock className="w-8 h-8 text-brand-subtext" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Admin Access</h2>
        <p className="text-brand-subtext mb-8 text-center">Restricted area for authorized personnel only.</p>
        
        <form onSubmit={handleLogin} className="w-full space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/30 border border-brand-border rounded-xl px-4 py-3 text-white placeholder-brand-subtext focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all text-center tracking-widest text-lg"
              placeholder="ENTER PASSCODE"
              autoFocus
            />
            {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
          </div>
          <Button type="submit" fullWidth>
            Authenticate
          </Button>
        </form>
        <button onClick={onClose} className="mt-6 text-brand-subtext hover:text-white text-sm">
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[90vh] w-full max-w-6xl mx-auto bg-brand-surface rounded-3xl shadow-2xl overflow-hidden border border-brand-border">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/5 bg-brand-bg/50">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5" />
            Order Management
          </h2>
          <p className="text-brand-subtext text-xs mt-1">
            Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-brand-subtext hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Dashboard & Content */}
      <div className="flex-grow overflow-auto p-6 space-y-6">
        
        {/* Analytics Section */}
        {orders.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Revenue Card */}
            <div className="bg-black/20 border border-white/5 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <TrendingUp size={48} />
              </div>
              <p className="text-brand-subtext text-xs font-semibold uppercase tracking-wider mb-1">Total Revenue</p>
              <h3 className="text-3xl font-black text-white tracking-tight">€{analytics.totalRevenue.toFixed(2)}</h3>
              <p className="text-xs text-brand-subtext mt-2">Excluding canceled orders</p>
            </div>

            {/* Order Stats Card */}
            <div className="bg-black/20 border border-white/5 rounded-2xl p-5 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                   <p className="text-brand-subtext text-xs font-semibold uppercase tracking-wider mb-1">Total Orders</p>
                   <h3 className="text-3xl font-bold text-white">{analytics.totalOrders}</h3>
                </div>
                <div className="text-right">
                   <p className="text-brand-subtext text-xs font-semibold uppercase tracking-wider mb-1">Active</p>
                   <h3 className="text-xl font-bold text-brand-accent">{analytics.activeOrders}</h3>
                </div>
              </div>
              <div className="mt-4 w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-brand-accent h-full rounded-full transition-all duration-1000" 
                  style={{ width: `${(analytics.activeOrders / (analytics.totalOrders || 1)) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Status Graph */}
            <div className="bg-black/20 border border-white/5 rounded-2xl p-5 flex flex-col justify-end">
               <p className="text-brand-subtext text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                 <BarChart3 className="w-3 h-3" /> Status Distribution
               </p>
               {/* Increased height to h-24 to fit labels and numbers */}
               <div className="flex items-end justify-between gap-2 h-24 pt-4">
                  {Object.entries(analytics.statusDistribution).map(([status, count]) => {
                    const max = Math.max(...Object.values(analytics.statusDistribution), 1);
                    // Limit max height to 70% of container to leave room for top number and bottom label
                    const height = `${(count / max) * 70}%`;
                    const colorClass = status === 'Canceled' ? 'bg-red-500' : 'bg-brand-accent';
                    
                    return (
                      <div key={status} className="flex flex-col items-center justify-end h-full gap-1 flex-1 group relative">
                        <span className="text-[10px] font-bold text-white/70 mb-0.5">{count}</span>
                        <div 
                          className={`w-full ${colorClass} rounded-t-sm opacity-60 group-hover:opacity-100 transition-all duration-500`} 
                          style={{ height: height || '4px', minHeight: '4px' }}
                        ></div>
                        <span className="text-[9px] text-brand-subtext uppercase font-medium truncate w-full text-center">{status.slice(0,3)}</span>
                      </div>
                    );
                  })}
               </div>
            </div>
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-3">
          <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold text-brand-subtext uppercase tracking-wider">
            <div className="col-span-2">Order ID</div>
            <div className="col-span-3">Customer</div>
            <div className="col-span-3">Status</div>
            <div className="col-span-2">Amount</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-brand-subtext border border-dashed border-white/10 rounded-2xl bg-black/10">
              <Search className="w-8 h-8 mb-4 opacity-20" />
              <p>No orders found.</p>
            </div>
          ) : (
            orders.map((order) => {
               const qty = order.quantity || 1;
               const isHighShipping = order.country === 'Shqipëri' || order.country === 'Maqedoni e Veriut';
               const amount = (14.99 * qty) + (isHighShipping ? 5.00 : 0);
               
               return (
                <div key={order.id} className="bg-brand-bg border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-colors">
                  <div 
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center cursor-pointer md:cursor-default"
                    onClick={() => window.innerWidth < 768 && toggleExpand(order.id)}
                  >
                    <div className="col-span-2 font-mono text-brand-accent text-sm flex items-center justify-between md:justify-start">
                      <div className="flex items-center gap-2">
                         {qty > 1 && (
                            <span className="bg-brand-accent text-brand-bg text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                              {qty}x
                            </span>
                         )}
                         <span className="text-brand-subtext md:hidden text-xs uppercase mr-1">ID:</span>
                         #{order.id}
                      </div>
                      <div className="md:hidden">
                        {expandedOrder === order.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>
                    
                    <div className="col-span-3">
                      <div className={`font-medium ${order.status === 'Canceled' ? 'text-brand-subtext line-through' : 'text-white'}`}>
                        {order.firstName} {order.lastName}
                      </div>
                      <div className="text-xs text-brand-subtext truncate">{order.email}</div>
                    </div>

                    <div className="col-span-3">
                      <div className="relative inline-block w-full md:w-auto group" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={order.status}
                            onChange={(e) => updateStatus(order.id, e.target.value as Order['status'])}
                            className={`appearance-none w-full md:w-40 pl-3 pr-8 py-1.5 rounded-lg text-xs font-semibold border focus:outline-none focus:ring-1 focus:ring-white/20 cursor-pointer ${getStatusColor(order.status)} bg-transparent`}
                          >
                            <option value="Pending" className="bg-brand-surface text-white">Pending</option>
                            <option value="Packed" className="bg-brand-surface text-white">Packed</option>
                            <option value="Shipped" className="bg-brand-surface text-white">Shipped</option>
                            <option value="Delivered" className="bg-brand-surface text-white">Delivered</option>
                            <option value="Canceled" className="bg-brand-surface text-red-400">Canceled</option>
                          </select>
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                            <RefreshCw className="w-3 h-3" />
                          </div>
                      </div>
                    </div>

                    <div className="col-span-2 text-sm text-white font-medium hidden md:block">
                      €{amount.toFixed(2)}
                    </div>

                    <div className="col-span-2 flex items-center justify-end gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleExpand(order.id); }}
                        className="p-2 text-brand-subtext hover:text-white hover:bg-white/10 rounded-lg transition-colors hidden md:block"
                        title="View Details"
                      >
                        {expandedOrder === order.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      <button 
                        onClick={(e) => deleteOrder(e, order.id)}
                        className="p-2 text-brand-subtext hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors z-10 relative"
                        title="Delete Order"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedOrder === order.id && (
                    <div className="px-4 pb-4 md:px-16 md:pb-6 border-t border-white/5 bg-black/20 animate-in slide-in-from-top-2 duration-200">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                        <div>
                          <h4 className="text-xs uppercase text-brand-subtext font-semibold mb-2 flex items-center gap-2">
                            <MapPin className="w-3 h-3" /> Shipping Information
                          </h4>
                          <div className="space-y-1 text-sm text-white">
                            <p className="font-medium text-brand-accent">{order.address}</p>
                            <p>{order.city}, {order.country}</p>
                            <p className="text-brand-subtext pt-2">{order.phoneNumber}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-xs uppercase text-brand-subtext font-semibold mb-2 flex items-center gap-2">
                            <Clock className="w-3 h-3" /> Order Meta
                          </h4>
                          <div className="space-y-1 text-sm text-white">
                            <p>Created: {new Date(order.date).toLocaleString()}</p>
                            <p>Quantity: {qty}x</p>
                            <p>Amount: €{amount.toFixed(2)}</p>
                          </div>
                        </div>
                        {order.status === 'Canceled' && (
                          <div className="flex items-center justify-center bg-red-500/5 rounded-xl border border-red-500/10">
                             <div className="text-center">
                               <AlertOctagon className="w-8 h-8 text-red-500 mx-auto mb-2 opacity-50" />
                               <p className="text-red-400 text-xs font-medium">Order Canceled</p>
                             </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
               );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;