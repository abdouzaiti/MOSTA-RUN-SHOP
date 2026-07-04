import React, { useEffect, useState } from 'react';
import { getSupabase } from '../lib/supabase';
import { Package, Clock, CheckCircle, XCircle, ChevronRight, Search, Filter, RefreshCw } from 'lucide-react';

interface Order {
  id: string;
  created_at: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  city: string;
  baladiya: string;
  wilaya?: string;
  wiliya?: string;
  postal_code: string;
  country: string;
  total?: number;
  items?: any[];
  status: string;
  delivery_method?: string;
  method?: string;
  payment_method?: string;
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
      order.id.toString().includes(searchTerm);
    
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
    <div className="min-h-screen bg-neutral-50 p-4 md:p-8 font-sans text-neutral-900">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 pb-5 relative">
          <div className="space-y-1">
            <p className="text-sm text-neutral-500 font-medium">
              Consulter, filtrer et gérer toutes les commandes du club.
            </p>
          </div>

          <div className="flex justify-center items-center md:absolute md:left-1/2 md:-translate-x-1/2 py-2 md:py-0">
            <img
              src="/logo.png"
              alt="Mosta Run Club Logo"
              className="h-14 w-auto object-contain select-none"
              referrerPolicy="no-referrer"
            />
          </div>

          <button 
            onClick={fetchOrders}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm font-semibold hover:bg-neutral-50 transition-colors shadow-sm self-start md:self-auto"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
        </div>

        {/* Stats cards summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Commandes Totales</span>
            <div className="text-2xl font-black text-neutral-900">{orders.length}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-yellow-600 uppercase tracking-wider">En Attente</span>
            <div className="text-2xl font-black text-neutral-900">
              {orders.filter(o => o.status === 'pending').length}
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-[#0D5DF1] uppercase tracking-wider">Livrées / Livrées</span>
            <div className="text-2xl font-black text-neutral-900">
              {orders.filter(o => o.status === 'delivered').length}
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-green-600 uppercase tracking-wider">Revenu Total</span>
            <div className="text-2xl font-black text-neutral-900">
              {orders.reduce((sum, o) => sum + (o.total || 0), 0).toLocaleString()} <span className="text-xs font-mono uppercase">DA</span>
            </div>
          </div>
        </div>

        {/* Filters and search section */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Rechercher par nom, email, téléphone ou ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0D5DF1]/20 focus:border-[#0D5DF1] transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-neutral-400" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0D5DF1]/20 transition-all cursor-pointer"
            >
              <option value="all">Tous les Statuts</option>
              <option value="pending">En Attente (Pending)</option>
              <option value="processing">En Cours (Processing)</option>
              <option value="shipped">Expédié (Shipped)</option>
              <option value="delivered">Livré (Delivered)</option>
              <option value="cancelled">Annulé (Cancelled)</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center space-y-4">
              <RefreshCw className="h-8 w-8 text-[#0D5DF1] animate-spin mx-auto" />
              <p className="text-neutral-500 font-medium">Récupération des commandes en cours...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center text-red-500">{error}</div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center text-neutral-400">Aucune commande trouvée</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50/50">
                    <th className="px-6 py-4 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Commande / Date</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Client</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Téléphone</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Adresse</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Wilaya / Baladiya</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Articles commandés</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Livraison</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-neutral-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredOrders.map((order) => (
                    <tr 
                      key={order.id}
                      className="hover:bg-neutral-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs font-mono font-bold text-neutral-900">#{String(order.id || '').slice(0, 8)}</div>
                        <div className="text-[10px] text-neutral-400">
                          {new Date(order.created_at).toLocaleDateString()} à {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-neutral-900">{order.first_name} {order.last_name}</div>
                        <div className="text-xs text-neutral-500">{order.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-neutral-700">{order.phone || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-neutral-900">{order.address}</div>
                        <div className="text-xs text-neutral-500">{order.postal_code}, {order.country}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{order.baladiya}, {order.wilaya || order.wiliya || ''}</td>
                      <td className="px-6 py-4 text-sm text-neutral-600 max-w-xs">
                        {order.items && Array.isArray(order.items) ? (
                          <div className="flex flex-col gap-1.5">
                            {order.items.map((item: any, idx: number) => (
                              <div key={idx} className="text-xs bg-neutral-100 px-2 py-1 rounded border border-neutral-200">
                                <span className="font-bold text-black">{item.title || item.name || 'Unknown Item'}</span>
                                {item.quantity && <span className="text-neutral-500 font-semibold"> (x{item.quantity})</span>}
                                {item.size && <span className="text-neutral-400 text-[10px]"> [{item.size}]</span>}
                                {item.color && <span className="text-neutral-400 text-[10px]"> - {item.color}</span>}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-neutral-400">Aucun article</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-neutral-900">{(order.total || 0).toLocaleString()} DA</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold capitalize text-neutral-700">
                        {order.delivery_method === 'home' || order.method === 'home' ? '🏠 Home' : '📦 Desk/Relais'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <select 
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="bg-neutral-50 border border-neutral-200 rounded px-2 py-1 text-[11px] font-bold text-neutral-700 hover:text-black cursor-pointer outline-none uppercase tracking-wider transition-colors"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
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
