import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash, Eye, X } from 'lucide-react';
import { getCollection, createDocument, updateDocument, deleteDocument } from '../../services/db';
import { motion } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';

export function AdminBlogs() {
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'edit'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { role } = useAuth();

  const defaultBlog = {
    id: '', title: '', author: 'AZM Editorial', date: new Date().toISOString().split('T')[0], status: 'Draft',
    image: '', content: '', category: 'Design Trends'
  };

  const [formData, setFormData] = useState(defaultBlog);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const data = await getCollection('blogs');
      setBlogs(data);
    } catch (e) {
      console.error("Failed to load blogs from DB", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBlog = async () => {
    try {
      const idToSave = formData.id || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const dataToSave = { ...formData, id: idToSave };

      if (activeTab === 'edit' && editingId) {
        await updateDocument('blogs', editingId, dataToSave);
        alert('Blog updated successfully!');
      } else {
        await createDocument('blogs', { ...dataToSave, createdAt: new Date().toISOString() }, idToSave);
        alert('Blog created successfully!');
      }
      loadBlogs();
      setActiveTab('list');
    } catch (e) {
      console.error("Failed to save blog", e);
      alert('Failed to save blog.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await deleteDocument('blogs', id);
        alert('Blog deleted');
        loadBlogs();
      } catch (e) {
        console.error("Failed to delete", e);
      }
    }
  };

  const handleEdit = (blog: any) => {
    setFormData(blog);
    setEditingId(blog.id);
    setActiveTab('edit');
  };

  const filteredBlogs = blogs.filter(b => b.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold font-display text-brand-secondary">Blog Management</h1>
          <p className="text-stone-500 text-sm">Manage articles and insights.</p>
        </div>
        {activeTab === 'list' && role !== 'viewer' && (
          <button onClick={() => { setFormData(defaultBlog); setActiveTab('add'); }} className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-brand-secondary transition-colors">
            <Plus size={16} /> New Article
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
                placeholder="Search articles..." 
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
                  <th className="px-6 py-4">Author</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {loading ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-stone-500">Loading blogs...</td></tr>
                ) : filteredBlogs.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-stone-500">No blogs found.</td></tr>
                ) : filteredBlogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-stone-800">{blog.title}</td>
                    <td className="px-6 py-4 text-stone-600">{blog.author}</td>
                    <td className="px-6 py-4 text-stone-600">{blog.date}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        blog.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-600'
                      }`}>
                        {blog.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {role !== 'viewer' && (
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleEdit(blog)} className="p-2 text-stone-400 hover:text-brand-primary transition-colors"><Edit size={16} /></button>
                          <button onClick={() => handleDelete(blog.id)} className="p-2 text-stone-400 hover:text-red-500 transition-colors"><Trash size={16} /></button>
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
              {activeTab === 'edit' ? 'Edit Article' : 'Create New Article'}
            </h2>
            <button onClick={() => setActiveTab('list')} className="text-stone-400 hover:text-stone-600">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-full">
                <label className="block text-sm font-bold text-stone-700 mb-2">Title</label>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" />
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Author</label>
                <input type="text" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" />
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Date</label>
                <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" />
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Category</label>
                <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" />
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary">
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
              <div className="col-span-full">
                <label className="block text-sm font-bold text-stone-700 mb-2">Featured Image URL</label>
                <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" />
              </div>
              <div className="col-span-full">
                <label className="block text-sm font-bold text-stone-700 mb-2">Content (HTML allowed)</label>
                <textarea value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} rows={10} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary"></textarea>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 border-t border-stone-100 mt-8 pt-6">
            <button onClick={() => setActiveTab('list')} className="px-6 py-2 border border-stone-200 rounded-lg text-sm font-bold text-stone-600 hover:bg-stone-50">Cancel</button>
            <button onClick={handleSaveBlog} className="px-6 py-2 bg-brand-primary text-white rounded-lg text-sm font-bold hover:bg-brand-secondary transition-colors">
              {activeTab === 'edit' ? 'Save Changes' : 'Save Article'}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
