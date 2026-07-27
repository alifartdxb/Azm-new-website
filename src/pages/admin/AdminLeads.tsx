import React, { useState, useEffect } from 'react';
import { Search, Mail, Phone, Clock, CheckCircle, Edit, Trash } from 'lucide-react';
import { getCollection, updateDocument, deleteDocument } from '../../services/db';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'motion/react';

export function AdminLeads() {
  const [searchQuery, setSearchQuery] = useState('');
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { role } = useAuth();

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const data = await getCollection('leads');
      setLeads(data);
    } catch (e) {
      console.error("Failed to load leads from DB", e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await deleteDocument('leads', id);
        alert('Lead deleted');
        loadLeads();
      } catch (e) {
        console.error("Failed to delete", e);
      }
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateDocument('leads', id, { status: newStatus });
      loadLeads();
    } catch (e) {
      console.error("Failed to update status", e);
    }
  };

  const filteredLeads = leads.filter(l => 
    l.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.email?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold font-display text-brand-secondary">Leads CRM</h1>
          <p className="text-stone-500 text-sm">Manage incoming inquiries and quotation requests.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-stone-200 bg-stone-50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
            <input 
              type="text" 
              placeholder="Search leads..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary text-sm"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] font-bold">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Type / Product</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-stone-500">Loading leads...</td></tr>
              ) : filteredLeads.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-stone-500">No leads found.</td></tr>
              ) : filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-stone-800">{lead.name}</div>
                    <div className="text-xs text-stone-500">{lead.company}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-stone-600 mb-1"><Mail size={12} /> {lead.email}</div>
                    <div className="flex items-center gap-2 text-stone-600"><Phone size={12} /> {lead.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2 py-1 bg-stone-100 rounded text-xs font-bold text-stone-600 mb-1">{lead.type}</span>
                    {lead.productSku && <div className="text-xs text-brand-primary">SKU: {lead.productSku}</div>}
                  </td>
                  <td className="px-6 py-4 text-stone-600 text-xs">
                    {new Date(lead.createdAt || Date.now()).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      value={lead.status || 'New'} 
                      onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                      className={`text-xs font-bold uppercase tracking-wider rounded-full px-2 py-1 border-0 focus:ring-2 ${
                        lead.status === 'Closed' ? 'bg-green-100 text-green-700' :
                        lead.status === 'Contacted' ? 'bg-blue-100 text-blue-700' :
                        'bg-orange-100 text-orange-700'
                      }`}
                      disabled={role === 'viewer'}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {role !== 'viewer' && (
                      <button onClick={() => handleDelete(lead.id)} className="p-2 text-stone-400 hover:text-red-500 transition-colors"><Trash size={16} /></button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
