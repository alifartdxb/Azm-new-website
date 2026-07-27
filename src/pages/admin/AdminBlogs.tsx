import { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash, Eye } from 'lucide-react';
import { OptimizedImage } from '../../components/OptimizedImage';

export function AdminBlogs() {
  const [showAddModal, setShowAddModal] = useState(false);

  const mockBlogs = [
    { id: 1, title: 'The Future of Sustainable Bathroom Design', author: 'AZM Editorial', date: '2023-10-15', status: 'Published', views: 1240 },
    { id: 2, title: 'VADO UK: A Legacy of Brassware Excellence', author: 'Technical Team', date: '2023-09-28', status: 'Published', views: 890 },
    { id: 3, title: 'Choosing the Right Kitchen Sink Material', author: 'AZM Editorial', date: '2023-09-10', status: 'Draft', views: 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-stone-800">Blog Management</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-semibold hover:bg-brand-secondary transition-colors shadow-sm"
        >
          <Plus size={16} /> New Article
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-stone-400" size={18} />
          <input
            className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary bg-stone-50 text-sm transition-all"
            type="text"
            placeholder="Search articles by title..."
            aria-label="Search articles"
          />
        </div>
        <div className="flex gap-2">
          <select className="border border-stone-200 rounded-lg px-4 py-2 bg-stone-50 text-sm text-stone-600 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all">
            <option>All Status</option>
            <option>Published</option>
            <option>Draft</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-xs uppercase tracking-wider text-stone-500 font-bold">
                <th className="p-4 w-12"><input type="checkbox" className="rounded border-stone-300" aria-label="Select all" /></th>
                <th className="p-4">Title</th>
                <th className="p-4">Author</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {mockBlogs.map((blog) => (
                <tr key={blog.id} className="border-b border-stone-100 hover:bg-stone-50/50 transition-colors">
                  <td className="p-4"><input type="checkbox" className="rounded border-stone-300" aria-label={`Select ${blog.title}`} /></td>
                  <td className="p-4 font-semibold text-stone-800">{blog.title}</td>
                  <td className="p-4 text-stone-600">{blog.author}</td>
                  <td className="p-4 text-stone-600">{blog.date}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      blog.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-stone-100 text-stone-600'
                    }`}>
                      {blog.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2 text-stone-400">
                      <button className="p-1 hover:text-brand-primary transition-colors" aria-label="View article"><Eye size={16} /></button>
                      <button className="p-1 hover:text-brand-primary transition-colors" aria-label="Edit article"><Edit size={16} /></button>
                      <button className="p-1 hover:text-red-500 transition-colors" aria-label="Delete article"><Trash size={16} /></button>
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
