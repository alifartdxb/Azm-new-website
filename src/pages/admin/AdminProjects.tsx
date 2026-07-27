import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash, X } from 'lucide-react';
import { getCollection, createDocument, updateDocument, deleteDocument } from '../../services/db';
import { motion } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';

export function AdminProjects() {
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'edit'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { role } = useAuth();

  const defaultProject = {
    id: '', title: '', location: '', category: 'Hospitality',
    image: '', description: '', suppliedProducts: '', completionDate: ''
  };

  const [formData, setFormData] = useState(defaultProject);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await getCollection('projects');
      setProjects(data);
    } catch (e) {
      console.error("Failed to load projects from DB", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProject = async () => {
    try {
      const idToSave = formData.id || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const dataToSave = { ...formData, id: idToSave };

      if (activeTab === 'edit' && editingId) {
        await updateDocument('projects', editingId, dataToSave);
        alert('Project updated successfully!');
      } else {
        await createDocument('projects', { ...dataToSave, createdAt: new Date().toISOString() }, idToSave);
        alert('Project created successfully!');
      }
      loadProjects();
      setActiveTab('list');
    } catch (e) {
      console.error("Failed to save project", e);
      alert('Failed to save project.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteDocument('projects', id);
        alert('Project deleted');
        loadProjects();
      } catch (e) {
        console.error("Failed to delete", e);
      }
    }
  };

  const handleEdit = (project: any) => {
    setFormData(project);
    setEditingId(project.id);
    setActiveTab('edit');
  };

  const filteredProjects = projects.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold font-display text-brand-secondary">Project Management</h1>
          <p className="text-stone-500 text-sm">Manage portfolio and references.</p>
        </div>
        {activeTab === 'list' && role !== 'viewer' && (
          <button onClick={() => { setFormData(defaultProject); setActiveTab('add'); }} className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-brand-secondary transition-colors">
            <Plus size={16} /> Add Project
          </button>
        )}
      </div>

      {activeTab === 'list' && (
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
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {loading ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-stone-500">Loading projects...</td></tr>
                ) : filteredProjects.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-stone-500">No projects found.</td></tr>
                ) : filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-stone-800">{project.title}</td>
                    <td className="px-6 py-4 text-stone-600">{project.location}</td>
                    <td className="px-6 py-4 text-stone-600">{project.category}</td>
                    <td className="px-6 py-4 text-right">
                      {role !== 'viewer' && (
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleEdit(project)} className="p-2 text-stone-400 hover:text-brand-primary transition-colors"><Edit size={16} /></button>
                          <button onClick={() => handleDelete(project.id)} className="p-2 text-stone-400 hover:text-red-500 transition-colors"><Trash size={16} /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {(activeTab === 'add' || activeTab === 'edit') && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold font-display text-brand-secondary">
              {activeTab === 'edit' ? 'Edit Project' : 'Create New Project'}
            </h2>
            <button onClick={() => setActiveTab('list')} className="text-stone-400 hover:text-stone-600">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-full">
                <label className="block text-sm font-bold text-stone-700 mb-2">Project Name</label>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" />
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Location</label>
                <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" />
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Category</label>
                <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" />
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Completion Date</label>
                <input type="date" value={formData.completionDate} onChange={e => setFormData({...formData, completionDate: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" />
              </div>
              <div className="col-span-full">
                <label className="block text-sm font-bold text-stone-700 mb-2">Image URL</label>
                <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" />
              </div>
              <div className="col-span-full">
                <label className="block text-sm font-bold text-stone-700 mb-2">Description</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={4} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary"></textarea>
              </div>
              <div className="col-span-full">
                <label className="block text-sm font-bold text-stone-700 mb-2">Supplied Products (comma separated)</label>
                <textarea value={formData.suppliedProducts} onChange={e => setFormData({...formData, suppliedProducts: e.target.value})} rows={3} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary"></textarea>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 border-t border-stone-100 mt-8 pt-6">
            <button onClick={() => setActiveTab('list')} className="px-6 py-2 border border-stone-200 rounded-lg text-sm font-bold text-stone-600 hover:bg-stone-50">Cancel</button>
            <button onClick={handleSaveProject} className="px-6 py-2 bg-brand-primary text-white rounded-lg text-sm font-bold hover:bg-brand-secondary transition-colors">
              {activeTab === 'edit' ? 'Save Changes' : 'Save Project'}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
