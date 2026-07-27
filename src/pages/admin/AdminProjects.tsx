import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, Save } from 'lucide-react';
import { OptimizedImage } from '../../components/OptimizedImage';
import { getCollection, createDocument, updateDocument, deleteDocument } from '../../services/db';

export function AdminProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    year: new Date().getFullYear().toString(),
    client: '',
    image: '',
    description: ''
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await getCollection('projects');
      setProjects(data);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setFormData({ title: '', location: '', year: new Date().getFullYear().toString(), client: '', image: '', description: '' });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (project: any) => {
    setFormData({
      title: project.title || '',
      location: project.location || '',
      year: project.year || '',
      client: project.client || '',
      image: project.image || '',
      description: project.description || ''
    });
    setEditingId(project.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await deleteDocument('projects', id);
      setProjects(projects.filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert('Failed to delete project.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return alert('Title is required');
    
    try {
      setSaving(true);
      
      if (editingId) {
        await updateDocument('projects', editingId, formData);
      } else {
        await createDocument('projects', { ...formData, createdAt: new Date().toISOString() });
      }
      
      await loadProjects();
      setShowForm(false);
    } catch (error) {
      console.error('Failed to save project:', error);
      alert('Failed to save project.');
    } finally {
      setSaving(false);
    }
  };

  const filteredProjects = projects.filter(p => p.title?.toLowerCase().includes(searchQuery.toLowerCase()));

  if (showForm) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-brand-secondary">{editingId ? 'Edit Project' : 'Add New Project'}</h2>
          <button onClick={() => setShowForm(false)} className="p-2 text-stone-400 hover:text-stone-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Project Title <span className="text-red-500">*</span></label>
              <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-brand-primary" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Location</label>
              <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-brand-primary" />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Year</label>
              <input type="text" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-brand-primary" />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Client</label>
              <input type="text" value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-brand-primary" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-stone-700 mb-2">Main Image URL</label>
              <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-brand-primary" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-stone-700 mb-2">Description</label>
              <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={4} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-brand-primary" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-6 border-t border-stone-100">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-stone-200 text-stone-600 rounded-lg font-medium hover:bg-stone-50 transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-brand-primary text-white rounded-lg font-medium hover:bg-brand-secondary transition-colors flex items-center gap-2">
              <Save size={16} /> {saving ? 'Saving...' : 'Save Project'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold font-display text-brand-secondary">Projects Management</h1>
          <p className="text-stone-500 text-sm">Manage portfolio projects and case studies.</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-brand-secondary transition-colors">
          <Plus size={16} /> Add Project
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-stone-200 bg-stone-50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
            <input 
              type="text" 
              placeholder="Search projects..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] font-bold">
              <tr>
                <th className="px-6 py-4">Project</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Year</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-stone-500">Loading...</td></tr>
              ) : filteredProjects.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-stone-500">No projects found.</td></tr>
              ) : filteredProjects.map((project) => (
                <tr key={project.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-12 rounded border border-stone-200 bg-stone-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {project.image ? (
                          <OptimizedImage src={project.image} alt={project.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-stone-400">Img</div>
                        )}
                      </div>
                      <div className="font-bold text-brand-secondary">{project.title}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-stone-600">{project.location || '-'}</td>
                  <td className="px-6 py-4 text-stone-600">{project.year || '-'}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(project)} className="p-2 text-stone-400 hover:text-brand-primary transition-colors"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(project.id)} className="p-2 text-stone-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                    </div>
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
