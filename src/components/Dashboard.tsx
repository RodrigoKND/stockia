import { useState, useEffect } from 'react';
import { Download, Sparkles, X, AlertCircle, Crown, Edit2, Trash2 } from 'lucide-react';
import Sidebar from './Sidebar';
import UploadArea from './UploadArea';
import { Link } from 'react-router-dom';

export interface InventoryItem {
  id: string;
  imageUrl: string;
  productName: string;
  category: string;
  quantity: number;
  confidence: number;
}

interface CreditInfo {
  used: number;
  total: number;
  isRegistered: boolean;
}

export default function Dashboard() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeType, setUpgradeType] = useState<'register' | 'upgrade'>('register');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Credit system
  const [credits, setCredits] = useState<CreditInfo>({
    used: 0,
    total: 5,
    isRegistered: false
  });

  useEffect(() => {
    // Load credits from localStorage
    const savedCredits = localStorage.getItem('stockia_credits');
    if (savedCredits) {
      setCredits(JSON.parse(savedCredits));
    }
  }, []);

  const saveCredits = (newCredits: CreditInfo) => {
    setCredits(newCredits);
    localStorage.setItem('stockia_credits', JSON.stringify(newCredits));
  };

  const handleFilesUpload = async (files: FileList) => {
    // Check credits before processing
    if (credits.used >= credits.total) {
      if (!credits.isRegistered) {
        setUpgradeType('register');
      } else {
        setUpgradeType('upgrade');
      }
      setShowUpgradeModal(true);
      return;
    }

    setIsProcessing(true);

    // Simulate AI processing with uploaded images
    const fileArray = Array.from(files);
    const imagePromises = fileArray.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    const imageUrls = await Promise.all(imagePromises);

    // Simulate API delay
    setTimeout(() => {
      const mockItems: InventoryItem[] = imageUrls.map((url, index) => ({
        id: `${Date.now()}-${index}`,
        imageUrl: url,
        productName: `Product ${index + 1}`,
        category: ['Electronics', 'Footwear', 'Kitchen', 'Clothing'][Math.floor(Math.random() * 4)],
        quantity: Math.floor(Math.random() * 50) + 1,
        confidence: Math.floor(Math.random() * 20) + 80
      }));

      setItems((prev) => [...prev, ...mockItems]);
      setIsProcessing(false);

      // Increment credits used
      const newCredits = {
        ...credits,
        used: credits.used + 1
      };
      saveCredits(newCredits);

      // Show upgrade prompt after using all analyses
      if (newCredits.used === newCredits.total) {
        setTimeout(() => {
          setUpgradeType(newCredits.isRegistered ? 'upgrade' : 'register');
          setShowUpgradeModal(true);
        }, 2000);
      }
    }, 2000);
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
  };

  const handleDelete = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleUpdateItem = (id: string, field: keyof InventoryItem, value: string | number) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleExport = () => {
    const csv = [
      ['Product Name', 'Category', 'Quantity', 'Confidence'],
      ...items.map(item => [
        item.productName,
        item.category,
        item.quantity,
        `${item.confidence}%`
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'inventory.csv';
    link.click();
  };

  // const handleRegister = () => {
  //   // In production, redirect to registration
  //   console.log('Redirecting to registration...');

  //   // Simulate registration
  //   const newCredits = {
  //     used: credits.used,
  //     total: 10,
  //     isRegistered: true
  //   };
  //   saveCredits(newCredits);
  //   setShowUpgradeModal(false);
  // };

  const handleContactSales = () => {
    window.location.href = 'mailto:rodrigopacheco965@gmail.com?subject=Interested in Stockia Premium&body=Hi, I would like more information about upgrading my Stockia plan for unlimited analyses.';
  };

  const remainingCredits = credits.total - credits.used;

  return (
    <div className="flex h-screen bg-neutral-50" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&display=swap');
      `}</style>

      <Sidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header with Credits */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 tracking-tight mb-2">
                Dashboard
              </h1>
              <p className="text-neutral-600">
                Upload product images for AI-powered inventory analysis
              </p>
            </div>

            {/* Credits Display */}
            <div className="flex items-center gap-4">
              <div className="bg-white border border-neutral-200 rounded-xl px-4 py-2 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-neutral-600" />
                <div className="text-sm">
                  <div className="font-semibold text-neutral-900">
                    {remainingCredits} / {credits.total} analyses
                  </div>
                  <div className="text-xs text-neutral-500">
                    {credits.isRegistered ? 'Registered' : 'Free trial'}
                  </div>
                </div>
              </div>

              {!credits.isRegistered && (
                <button
                  onClick={() => {
                    setUpgradeType('register');
                    setShowUpgradeModal(true);
                  }}
                  className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors flex items-center gap-2"
                >
                  <Crown className="w-4 h-4" />
                  Register for +5
                </button>
              )}
            </div>
          </div>

          {/* Upload Area */}
          {credits.used < credits.total ? (
            <UploadArea onFilesUpload={handleFilesUpload} />
          ) : (
            <div className="bg-neutral-100 border-2 border-dashed border-neutral-300 rounded-2xl p-12 text-center mb-8">
              <div className="inline-flex w-16 h-16 bg-neutral-200 rounded-2xl items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-neutral-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                Analysis limit reached
              </h3>
              <p className="text-neutral-600 mb-4">
                {credits.isRegistered
                  ? 'Contact us to upgrade for unlimited analyses'
                  : 'Register for free to get 5 more analyses'
                }
              </p>
              <button
                onClick={() => {
                  setUpgradeType(credits.isRegistered ? 'upgrade' : 'register');
                  setShowUpgradeModal(true);
                }}
                className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-neutral-800 transition-colors"
              >
                {credits.isRegistered ? 'Contact Sales' : 'Register Now'}
              </button>
            </div>
          )}

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="bg-white rounded-2xl border border-neutral-200 p-8 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 border-3 border-neutral-200 border-t-black rounded-full animate-spin"></div>
                <div>
                  <h3 className="font-bold text-neutral-900 mb-1">Processing images...</h3>
                  <p className="text-sm text-neutral-600">AI is analyzing your inventory</p>
                </div>
              </div>
            </div>
          )}

          {/* Results Table */}
          {items.length > 0 && (
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center">
                <h2 className="text-lg font-bold text-neutral-900">
                  Detected Items ({items.length})
                </h2>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-neutral-800 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-200">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                        Image
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                        Product Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                        Confidence
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-6 py-4">
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="w-12 h-12 rounded-lg object-cover border border-neutral-200"
                          />
                        </td>
                        <td className="px-6 py-4">
                          {editingId === item.id ? (
                            <input
                              type="text"
                              value={item.productName}
                              onChange={(e) => handleUpdateItem(item.id, 'productName', e.target.value)}
                              className="px-3 py-1 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                              onBlur={() => setEditingId(null)}
                              autoFocus
                            />
                          ) : (
                            <div className="font-medium text-neutral-900">{item.productName}</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {editingId === item.id ? (
                            <input
                              type="text"
                              value={item.category}
                              onChange={(e) => handleUpdateItem(item.id, 'category', e.target.value)}
                              className="px-3 py-1 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                              onBlur={() => setEditingId(null)}
                            />
                          ) : (
                            <span className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-sm">
                              {item.category}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {editingId === item.id ? (
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleUpdateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                              className="w-20 px-3 py-1 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                              onBlur={() => setEditingId(null)}
                            />
                          ) : (
                            <div className="font-semibold text-neutral-900">{item.quantity}</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-neutral-100 rounded-full h-2 max-w-[100px]">
                              <div
                                className="bg-black h-2 rounded-full"
                                style={{ width: `${item.confidence}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-neutral-600">
                              {item.confidence}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(item.id)}
                              className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-2 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-neutral-100 rounded-2xl flex items-center justify-center">
                  {upgradeType === 'register' ? (
                    <Crown className="w-6 h-6 text-neutral-900" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-neutral-900" />
                  )}
                </div>
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {upgradeType === 'register' ? (
                <>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-3 tracking-tight">
                    You've used your free analyses
                  </h2>
                  <p className="text-neutral-600 mb-6 leading-relaxed">
                    Create a free account to get 5 more analyses and unlock additional features.
                  </p>

                  <div className="space-y-3 mb-6">
                    {[
                      '5 additional free analyses',
                      'Save your inventory history',
                      'Share catalogs with clients',
                      'Priority email support'
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 text-sm text-neutral-700">
                        <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center my-4">
                    <Link
                      to="/login"
                      // onClick={handleRegister}
                      className="w-md px-6 py-4 cursor-pointer bg-black text-white rounded-xl font-semibold hover:bg-neutral-800 transition-colors"
                    >
                      Create Free Account
                    </Link>

                  </div>
                  <button
                    onClick={() => setShowUpgradeModal(false)}
                    className="w-full px-6 py-3 text-neutral-600 hover:text-neutral-900 font-medium transition-colors"
                  >
                    Maybe later
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-3 tracking-tight">
                    Ready for unlimited analyses?
                  </h2>
                  <p className="text-neutral-600 mb-6 leading-relaxed">
                    You've reached your analysis limit. Upgrade to continue managing your inventory without limits.
                  </p>

                  <div className="bg-neutral-50 rounded-2xl p-6 mb-6">
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-4xl font-bold text-neutral-900">Custom</span>
                      <span className="text-neutral-600">pricing</span>
                    </div>
                    <div className="space-y-2 text-sm text-neutral-700">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full"></div>
                        <span>Unlimited AI analyses</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full"></div>
                        <span>Advanced export options</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full"></div>
                        <span>Priority support</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full"></div>
                        <span>API access</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleContactSales}
                    className="w-full px-6 py-4 bg-black text-white rounded-xl font-semibold hover:bg-neutral-800 transition-colors mb-3"
                  >
                    Contact Us for Pricing
                  </button>
                  <button
                    onClick={() => setShowUpgradeModal(false)}
                    className="w-full px-6 py-3 text-neutral-600 hover:text-neutral-900 font-medium transition-colors"
                  >
                    Not now
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}