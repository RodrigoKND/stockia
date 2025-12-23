import { useState } from 'react';
import { Download, Edit2, Search, SlidersHorizontal, Trash2 } from 'lucide-react';
import { InventoryItem } from './Dashboard';

export default function InventoryTable({ items, onEdit, onDelete }: {
  items: InventoryItem[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = items.filter(item =>
    item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportCSV = () => {
    const headers = ['Product Name', 'Category', 'Stock Qty', 'Confidence'];
    const rows = filteredItems.map((item) => [
      item.productName,
      item.category,
      item.quantity,
      `${item.confidence}%`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory.csv';
    a.click();
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 95) return 'text-green-700 bg-green-50';
    if (confidence >= 80) return 'text-yellow-700 bg-yellow-50';
    return 'text-orange-700 bg-orange-50';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 95) return 'High';
    if (confidence >= 80) return 'Med';
    return 'Low';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or category..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-3 ml-4">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium text-gray-700">
            <SlidersHorizontal className="w-4 h-4" />
            Filter
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock Qty</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Confidence</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <img src={item.imageUrl} alt={item.productName} className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{item.productName}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">{item.category}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-gray-900">{item.quantity}</span>
                    <span className="text-sm text-gray-500">pcs</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${item.confidence >= 95 ? 'bg-green-600' : item.confidence >= 80 ? 'bg-yellow-600' : 'bg-orange-600'}`}></div>
                    <span className={`text-sm font-medium ${getConfidenceColor(item.confidence)} px-2 py-1 rounded`}>
                      {item.confidence}% {getConfidenceLabel(item.confidence)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => onEdit(item.id)} className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(item.id)} className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredItems.length === 0 && (
        <div className="py-12 text-center text-gray-500">
          <p>{items.length === 0 ? 'No items detected yet. Upload photos to get started.' : 'No items match your search.'}</p>
        </div>
      )}

      {filteredItems.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 text-sm text-gray-600">
          Showing {filteredItems.length} of {items.length} {items.length === 1 ? 'item' : 'items'}
        </div>
      )}
    </div>
  );
}