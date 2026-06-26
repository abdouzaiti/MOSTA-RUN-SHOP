import React, { useEffect, useState } from 'react';
import { getSupabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { Package, Clock, CheckCircle, XCircle, ChevronRight, Search, Filter, RefreshCw } from 'lucide-react';

interface Order {
  id: string;
  created_at: string;
  email: string;
  first_name: string;
  last_name: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  total: number;
  items: any[];
  status: string;
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchOrders = async () => {
    const supabase = getSupabase();
    if (!supabase) {
      setError('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Failed to fetch orders. Please make sure your Supabase URL and Key are configured and the "orders" table exists.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const supabase = getSupabase();
    if (!supabase) return;
    
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      setOrders(orders.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
    } catch (err: any) {
      alert('Error updating status: ' + err.message);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${order.first_name} ${order.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-neutral-900 uppercase italic">
              MRC <span className="text-[#0D5DF1]">Admin</span> Dashboard
            </h1>
            <p className="text-sm text-neutral-500 font-medium">
              Manage club apparel orders and tracking.
            </p>
          </div>
          <button 
            onClick={fetchOrders}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm font-semibold hover:bg-neutral-50 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-2">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Total Orders</span>
            <div className="text-2xl font-black text-neutral-900">{orders.length}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-2">
            <span className="text-xs font-bold text-yellow-500 uppercase tracking-wider">Pending</span>
            <div className="text-2xl font-black text-neutral-900">{orders.filter(o => o.status === 'pending').length}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-2">
            <span className="text-xs font-bold text-green-500 uppercase tracking-wider">Completed</span>
            <div className="text-2xl font-black text-neutral-900">{orders.filter(o => o.status === 'delivered').length}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-2">
            <span className="text-xs font-bold text-[#0D5DF1] uppercase tracking-wider">Revenue</span>
            <div className="text-2xl font-black text-neutral-900">
              {orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()} <span className="text-sm font-mono uppercase">DA</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search by email, name or order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0D5DF1]/20 focus:border-[#0D5DF1] transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-neutral-400" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0D5DF1]/20 transition-all cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center space-y-4">
              <RefreshCw className="h-8 w-8 text-[#0D5DF1] animate-spin mx-auto" />
              <p className="text-neutral-500 font-medium">Fetching the latest orders...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center space-y-4">
              <XCircle className="h-12 w-12 text-red-500 mx-auto" />
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-bold text-neutral-900">Connection Error</h3>
                <p className="text-sm text-neutral-500 mt-1">{error}</p>
                <div className="mt-6 p-4 bg-neutral-50 rounded-xl text-left text-xs font-mono text-neutral-600 border border-neutral-100">
                  <p className="font-bold mb-2">Required Supabase Schema:</p>
                  <pre className="whitespace-pre-wrap">
{`CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT,
  total NUMERIC,
  items JSONB,
  status TEXT DEFAULT 'pending'
);`}
                  </pre>
                </div>
              </div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center space-y-4">
              <Package className="h-12 w-12 text-neutral-200 mx-auto" />
              <p className="text-neutral-500 font-medium">No orders found matching your criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50/50">
                    <th className="px-6 py-4 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Order / Date</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Items</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-neutral-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredOrders.map((order) => (
                    <motion.tr 
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-neutral-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-xs font-mono font-bold text-neutral-900">#{order.id.slice(0, 8)}</span>
                          <span className="text-[10px] text-neutral-400 flex items-center gap-1 mt-1">
                            <Clock className="h-3 w-3" />
                            {new Date(order.created_at).toLocaleDateString()} {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-neutral-900">{order.first_name} {order.last_name}</span>
                          <span className="text-xs text-neutral-500">{order.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex -space-x-2 overflow-hidden">
                          {order.items.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="h-8 w-8 rounded-lg border-2 border-white bg-white flex items-center justify-center shadow-sm overflow-hidden">
                              <img src={item.image} alt="" className="h-6 w-6 object-contain" />
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <div className="h-8 w-8 rounded-lg border-2 border-white bg-neutral-100 flex items-center justify-center text-[10px] font-bold text-neutral-500 shadow-sm">
                              +{order.items.length - 3}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-black text-[#0D5DF1]">
                        {order.total.toLocaleString()} DA
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(order.status)} uppercase tracking-wider`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <select 
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="bg-transparent text-[11px] font-bold text-neutral-400 hover:text-black cursor-pointer outline-none uppercase tracking-widest transition-colors"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
