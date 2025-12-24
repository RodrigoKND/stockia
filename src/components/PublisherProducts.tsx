import { useState, useEffect } from 'react';
import { Share2, Check, X, Copy, Bot, Settings, Eye, EyeOff, Sparkles } from 'lucide-react';
import Sidebar from './Sidebar';
import { generateShareableLink } from '../utils/shareableLink';
import { supabase } from '../lib/supabase';

interface InventoryItem {
  id: string;
  imageUrl: string;
  productName: string;
  brand: string;
  barcode: string;
  price: string;
  category: string;
  quantity: number;
  description: string;
  characteristics: string;
  targetMarket: string;
  usage: string;
  confidence: number;
  verifiedImage?: string;
}

interface SharedProduct extends InventoryItem {
  isPublished: boolean;
  shareableLink?: string;
}

interface VirtualSellerConfig {
  name: string;
  avatarUrl: string;
  personality: string;
  welcomeMessage: string;
  catalogTitle: string;
  catalogDescription: string;
  behavior: 'friendly' | 'professional' | 'enthusiastic' | 'casual';
  phoneNumber: string;
  adaptToUser: boolean;
}

interface VisibleAttributes {
  category: boolean;
  quantity: boolean;
  brand: boolean;
  price: boolean;
}

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
];

export default function PublishedProducts() {
  const [items, setItems] = useState<SharedProduct[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [configStep, setConfigStep] = useState<'attributes' | 'seller'>('attributes');
  
  const [visibleAttributes, setVisibleAttributes] = useState<VisibleAttributes>({
    category: true,
    quantity: true,
    brand: true,
    price: true,
  });

  const [sellerConfig, setSellerConfig] = useState<VirtualSellerConfig>({
    name: 'Sofía',
    avatarUrl: AVATAR_OPTIONS[0],
    personality: 'Soy una vendedora amigable y experta que conoce cada producto en detalle',
    welcomeMessage: '¡Hola! Bienvenido a nuestra tienda. Estoy aquí para ayudarte a encontrar exactamente lo que buscas.',
    catalogTitle: 'Catálogo de Productos Premium',
    catalogDescription: 'Descubre nuestra selección exclusiva de productos de alta calidad',
    behavior: 'friendly',
    phoneNumber: '',
    adaptToUser: true,
  });

  // Cargar productos desde Supabase
  useEffect(() => {
    const loadProducts = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);
      setLoading(true);

      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error cargando productos:', error);
      } else if (data) {
        const formattedItems: SharedProduct[] = data.map(item => ({
          id: item.id,
          imageUrl: item.verified_image || item.image_url || '',
          productName: item.product_name,
          brand: item.brand || 'N/A',
          barcode: item.barcode || 'No detectado',
          price: item.price || 'No visible',
          category: item.category || 'Sin categoría',
          quantity: item.quantity || 0,
          description: item.description || 'Sin descripción',
          characteristics: item.characteristics || '',
          targetMarket: item.target_market || 'General',
          usage: item.usage || '',
          confidence: item.confidence || 85,
          verifiedImage: item.verified_image,
          isPublished: false,
        }));
        setItems(formattedItems);
      }

      setLoading(false);
    };

    loadProducts();
  }, []);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedIds(e.target.checked ? items.map(item => item.id) : []);
  };

  const handleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleShare = () => {
    if (selectedIds.length === 0) {
      alert('Selecciona al menos un producto para compartir');
      return;
    }
    setShowConfig(true);
    setConfigStep('attributes');
  };

  const handleGenerateLink = () => {
    const link = generateShareableLink(selectedIds, sellerConfig, visibleAttributes);
    setShareLink(link);
    setShowConfig(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNextStep = () => {
    setConfigStep('seller');
  };

  const handlePrevStep = () => {
    setConfigStep('attributes');
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-3 border-gray-200 border-t-black rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Productos Publicados</h1>
              <p className="text-gray-600">Comparte tu inventario con clientes y configura tu vendedor virtual.</p>
            </div>
            <button
              onClick={handleShare}
              disabled={selectedIds.length === 0}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Share2 className="w-5 h-5" />
              Configurar y Compartir ({selectedIds.length})
            </button>
          </div>

          {/* Configuration Modal */}
          {showConfig && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden">
                {/* Progress Indicator */}
                <div className="flex border-b border-gray-100">
                  <button
                    onClick={() => setConfigStep('attributes')}
                    className={`flex-1 px-6 py-5 text-sm font-medium transition-all relative ${
                      configStep === 'attributes' ? 'text-black' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <Settings className="w-4 h-4 mx-auto mb-1" />
                    Atributos
                    {configStep === 'attributes' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
                    )}
                  </button>
                  <button
                    onClick={handleNextStep}
                    className={`flex-1 px-6 py-5 text-sm font-medium transition-all relative ${
                      configStep === 'seller' ? 'text-black' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <Bot className="w-4 h-4 mx-auto mb-1" />
                    Vendedor Virtual
                    {configStep === 'seller' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
                    )}
                  </button>
                </div>

                <div className="overflow-y-auto max-h-[calc(85vh-180px)]">
                  {/* Step 1: Attributes */}
                  {configStep === 'attributes' && (
                    <div className="p-8 space-y-8">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Atributos Visibles</h2>
                        <p className="text-gray-500 text-sm">Selecciona qué información mostrar en las tarjetas de productos</p>
                      </div>

                      <div className="space-y-4">
                        <label className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors group">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                              visibleAttributes.category ? 'bg-black text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
                            }`}>
                              {visibleAttributes.category ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">Categoría</div>
                              <div className="text-sm text-gray-500">Mostrar la categoría del producto</div>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={visibleAttributes.category}
                            onChange={(e) => setVisibleAttributes({ ...visibleAttributes, category: e.target.checked })}
                            className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                          />
                        </label>

                        <label className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors group">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                              visibleAttributes.quantity ? 'bg-black text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
                            }`}>
                              {visibleAttributes.quantity ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">Stock Disponible</div>
                              <div className="text-sm text-gray-500">Mostrar cantidad disponible</div>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={visibleAttributes.quantity}
                            onChange={(e) => setVisibleAttributes({ ...visibleAttributes, quantity: e.target.checked })}
                            className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                          />
                        </label>

                        <label className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors group">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                              visibleAttributes.brand ? 'bg-black text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
                            }`}>
                              {visibleAttributes.brand ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">Marca</div>
                              <div className="text-sm text-gray-500">Mostrar la marca del producto</div>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={visibleAttributes.brand}
                            onChange={(e) => setVisibleAttributes({ ...visibleAttributes, brand: e.target.checked })}
                            className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                          />
                        </label>

                        <label className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors group">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                              visibleAttributes.price ? 'bg-black text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
                            }`}>
                              {visibleAttributes.price ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">Precio</div>
                              <div className="text-sm text-gray-500">Mostrar el precio del producto</div>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={visibleAttributes.price}
                            onChange={(e) => setVisibleAttributes({ ...visibleAttributes, price: e.target.checked })}
                            className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                          />
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Seller Config */}
                  {configStep === 'seller' && (
                    <div className="p-8 space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Vendedor Virtual</h2>
                        <p className="text-gray-500 text-sm">Personaliza la experiencia de tus clientes</p>
                      </div>

                      {/* Avatar Selection */}
                      <div className="grid grid-cols-5 gap-3">
                        {AVATAR_OPTIONS.map((url, index) => (
                          <button
                            key={index}
                            onClick={() => setSellerConfig({ ...sellerConfig, avatarUrl: url })}
                            className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                              sellerConfig.avatarUrl === url
                                ? 'border-black scale-105'
                                : 'border-gray-200 hover:border-gray-400'
                            }`}
                          >
                            <img src={url} alt={`Avatar ${index + 1}`} className="w-full aspect-square object-cover" />
                          </button>
                        ))}
                      </div>

                      {/* Name and Phone */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                            Nombre
                          </label>
                          <input
                            type="text"
                            value={sellerConfig.name}
                            onChange={(e) => setSellerConfig({ ...sellerConfig, name: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                            placeholder="Sofía"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                            WhatsApp
                          </label>
                          <input
                            type="tel"
                            value={sellerConfig.phoneNumber}
                            onChange={(e) => setSellerConfig({ ...sellerConfig, phoneNumber: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                            placeholder="+591 12345678"
                          />
                        </div>
                      </div>

                      {/* Behavior */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                          Comportamiento
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            { value: 'friendly', label: 'Amigable' },
                            { value: 'professional', label: 'Profesional' },
                            { value: 'enthusiastic', label: 'Entusiasta' },
                            { value: 'casual', label: 'Casual' },
                          ].map((style) => (
                            <button
                              key={style.value}
                              onClick={() => setSellerConfig({ ...sellerConfig, behavior: style.value as any })}
                              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                                sellerConfig.behavior === style.value
                                  ? 'bg-black text-white'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              {style.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Personality */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                          Personalidad
                        </label>
                        <textarea
                          value={sellerConfig.personality}
                          onChange={(e) => setSellerConfig({ ...sellerConfig, personality: e.target.value })}
                          rows={2}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none text-sm"
                          placeholder="Describe cómo se comportará..."
                        />
                      </div>

                      {/* Welcome Message */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                          Mensaje de Bienvenida
                        </label>
                        <textarea
                          value={sellerConfig.welcomeMessage}
                          onChange={(e) => setSellerConfig({ ...sellerConfig, welcomeMessage: e.target.value })}
                          rows={2}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none text-sm"
                          placeholder="Saludo inicial..."
                        />
                      </div>

                      {/* Catalog Info */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                            Título del Catálogo
                          </label>
                          <input
                            type="text"
                            value={sellerConfig.catalogTitle}
                            onChange={(e) => setSellerConfig({ ...sellerConfig, catalogTitle: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                            placeholder="Catálogo de Productos Premium"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                            Descripción
                          </label>
                          <textarea
                            value={sellerConfig.catalogDescription}
                            onChange={(e) => setSellerConfig({ ...sellerConfig, catalogDescription: e.target.value })}
                            rows={2}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none text-sm"
                            placeholder="Breve descripción..."
                          />
                        </div>
                      </div>

                      {/* Adapt to User */}
                      <label className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                        <div className="flex items-center gap-3">
                          <Sparkles className="w-5 h-5 text-gray-400" />
                          <div>
                            <div className="font-semibold text-gray-900 text-sm">Adaptar al Usuario</div>
                            <div className="text-xs text-gray-500">Personalizar según género y preferencias</div>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={sellerConfig.adaptToUser}
                          onChange={(e) => setSellerConfig({ ...sellerConfig, adaptToUser: e.target.checked })}
                          className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                        />
                      </label>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="border-t border-gray-100 p-6">
                  <div className="flex gap-3">
                    {configStep === 'attributes' ? (
                      <>
                        <button
                          onClick={() => setShowConfig(false)}
                          className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={handleNextStep}
                          className="flex-1 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                        >
                          Siguiente
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={handlePrevStep}
                          className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                          Anterior
                        </button>
                        <button
                          onClick={handleGenerateLink}
                          className="flex-1 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                        >
                          Generar Link
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Share Link Display */}
          {shareLink && (
            <div className="bg-black text-white rounded-2xl p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  <h3 className="font-semibold">Link generado exitosamente</h3>
                </div>
                <button onClick={() => setShareLink('')} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-gray-400"
                />
                <button
                  onClick={handleCopyLink}
                  className={`px-4 py-3 rounded-lg flex items-center gap-2 transition-all ${
                    copied ? 'bg-white text-black' : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copiado' : 'Copiar'}
                </button>
              </div>
            </div>
          )}

          {/* Products Table */}
          {items.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Share2 className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No hay productos aún</h3>
              <p className="text-gray-600">Ve al Dashboard para agregar productos a tu inventario</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedIds.length === items.length && items.length > 0}
                          onChange={handleSelectAll}
                          className="w-4 h-4 text-black rounded focus:ring-2 focus:ring-black"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Imagen</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Producto</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Marca</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Categoría</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Precio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(item.id)}
                            onChange={() => handleSelect(item.id)}
                            className="w-4 h-4 text-black rounded focus:ring-2 focus:ring-black"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <img src={item.imageUrl} alt={item.productName} className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{item.productName}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-700">{item.brand}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">{item.category}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-baseline gap-2">
                            <span className="font-semibold text-gray-900">{item.quantity}</span>
                            <span className="text-sm text-gray-500">unidades</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">{item.price}</div>
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
                  </div>
                );
              }