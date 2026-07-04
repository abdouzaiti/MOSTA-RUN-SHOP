import React, { useEffect, useState } from 'react';
import { getSupabase } from '../lib/supabase';
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
  total?: number;
  items?: any[];
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
      setError(err.message || 'Failed to fetch orders.');
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
      (order.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${order.first_name || ''} ${order.last_name || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
          </div>
          <button 
            onClick={fetchOrders}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm font-semibold hover:bg-neutral-50 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center space-y-4">
              <RefreshCw className="h-8 w-8 text-[#0D5DF1] animate-spin mx-auto" />
              <p className="text-neutral-500 font-medium">Fetching orders...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center text-red-500">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <tbody className="divide-y divide-neutral-100">
                  {filteredOrders.map((order) => (
                    <tr 
                      key={order.id}
                      className="hover:bg-neutral-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">#{order.id.slice(0, 8)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{order.first_name} {order.last_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{(order.total || 0).toLocaleString()} DA</td>
                      <td className="px-6 py-4 whitespace-nowrap">{order.status}</td>
                    </tr>
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
