import { useState, useEffect, useRef } from 'react';
import { Download, Sparkles, X, AlertCircle, Crown, Edit2, Trash2 } from 'lucide-react';
import Sidebar from './Sidebar';
import UploadArea from './UploadArea';

export interface InventoryItem {
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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<InventoryItem | null>(null);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const scannerRef = useRef<any>(null);

  const [credits, setCredits] = useState<CreditInfo>({
    used: 0,
    total: 5,
    isRegistered: false
  });

  useEffect(() => {
    const savedCredits = localStorage.getItem('stockia_credits');
    if (savedCredits) {
      setCredits(JSON.parse(savedCredits));
    }
  }, []);

  const saveCredits = (newCredits: CreditInfo) => {
    setCredits(newCredits);
    localStorage.setItem('stockia_credits', JSON.stringify(newCredits));
  };

  const startBarcodeScanner = async () => {
    setShowBarcodeScanner(true);

    const { Html5QrcodeScanner } = await import('html5-qrcode');

    scannerRef.current = new Html5QrcodeScanner(
      "barcode-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scannerRef.current.render(
      async (decodedText: string) => {
        scannerRef.current?.clear();
        setShowBarcodeScanner(false);
        await searchProductByBarcode(decodedText);
      },
      () => { }
    );
  };

  const stopBarcodeScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear();
    }
    setShowBarcodeScanner(false);
  };

  const analyzeWithGemini = async (prompt: string, imageBase64?: string) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error('API Key de Gemini no configurada');
    }

    const parts: any[] = [{ text: prompt }];

    if (imageBase64) {
      parts.push({
        inline_data: {
          mime_type: 'image/jpeg',
          data: imageBase64
        }
      });
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: parts
            }],
            generationConfig: {
              temperature: 0.4,
              topK: 32,
              topP: 1,
              maxOutputTokens: 2048,
            }
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error de Gemini API:', errorData);
        throw new Error(`Error ${response.status}: ${errorData.error?.message || 'Error desconocido'}`);
      }

      const data = await response.json();

      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No se recibió respuesta de la IA');
      }

      const text = data.candidates[0].content.parts[0].text;

      // Extraer JSON del texto
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('Respuesta de Gemini sin JSON:', text);
        throw new Error('Respuesta inválida de la IA');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error al analizar con Gemini:', error);
      throw error;
    }
  };

  const searchImageOnWeb = async (query: string): Promise<string> => {
    const apiKey = import.meta.env.VITE_SERPAPI_KEY;

    if (!apiKey) {
      console.warn('SerpAPI Key no configurada');
      return '';
    }

    try {
      const response = await fetch(
        `https://serpapi.com/search?engine=google_images_light&q=${encodeURIComponent(query)}&api_key=${apiKey}`
      );

      if (!response.ok) {
        console.warn('Error al buscar imagen en web:', response.status);
        return '';
      }

      const data = await response.json();
      return data.images_results?.[0]?.serpapi_thumbnail || '';
    } catch (error) {
      console.error('Error en búsqueda de imagen:', error);
      return '';
    }
  };

  const searchProductByBarcode = async (barcode: string) => {
    if (credits.used >= credits.total) {
      setUpgradeType(credits.isRegistered ? 'upgrade' : 'register');
      setShowUpgradeModal(true);
      return;
    }

    setIsProcessing(true);

    try {
      const prompt = `Busca información del producto con código de barras: ${barcode}. 

Proporciona la siguiente información en formato JSON válido:
{
  "productName": "nombre del producto",
  "brand": "marca",
  "price": "precio estimado con moneda",
  "description": "para qué sirve en máximo 10 palabras",
  "characteristics": "características principales en máximo 15 palabras",
  "targetMarket": "mercado objetivo (ej: jóvenes, familias, profesionales)",
  "usage": "uso específico del producto",
  "category": "categoría del producto"
}

Responde ÚNICAMENTE con el objeto JSON, sin texto adicional antes o después.`;

      // CAMBIO: No pasar imagen aquí porque el scanner solo da el código
      const analysis = await analyzeWithGemini(prompt);

      const verifiedImageUrl = await searchImageOnWeb(`${barcode} product`);

      const newItem: InventoryItem = {
        id: Date.now().toString(),
        imageUrl: verifiedImageUrl,
        productName: analysis.productName || 'Producto desconocido',
        brand: analysis.brand || 'N/A',
        barcode,
        price: analysis.price || 'No disponible',
        category: analysis.category || 'Sin categoría',
        quantity: 1,
        description: analysis.description || 'Sin descripción',
        characteristics: analysis.characteristics || 'Sin características',
        targetMarket: analysis.targetMarket || 'General',
        usage: analysis.usage || 'Uso general',
        confidence: 75,
        verifiedImage: verifiedImageUrl
      };

      setCurrentAnalysis(newItem);
      setShowConfirmModal(true);

      const newCredits = { ...credits, used: credits.used + 1 };
      saveCredits(newCredits);

      if (newCredits.used === newCredits.total) {
        setTimeout(() => {
          setUpgradeType(newCredits.isRegistered ? 'upgrade' : 'register');
          setShowUpgradeModal(true);
        }, 2000);
      }
    } catch (error) {
      console.error('Error buscando producto:', error);
      alert(`Error al buscar el producto: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFilesUpload = async (files: FileList) => {
    if (credits.used >= credits.total) {
      setUpgradeType(credits.isRegistered ? 'upgrade' : 'register');
      setShowUpgradeModal(true);
      return;
    }

    setIsProcessing(true);

    const file = files[0];
    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64Image = (reader.result as string).split(',')[1];

      try {
        const prompt = `Analiza esta imagen de producto con MÁXIMA ATENCIÓN al código de barras.

INSTRUCCIONES CRÍTICAS PARA EL CÓDIGO DE BARRAS:
1. Busca CUIDADOSAMENTE números bajo las barras verticales (típicamente 13 dígitos)
2. El código suele estar en la parte inferior, lateral o trasera del producto
3. Lee TODOS los dígitos visibles del código de barras
4. Si encuentras el código, es OBLIGATORIO incluirlo completo
5. Si tienes conocimiento del código de barras de este producto por su nombre/marca, inclúyelo
6. Solo responde "No detectado" si realmente no hay forma de determinar el código

Extrae la siguiente información en formato JSON válido:
{
  "productName": "nombre completo del producto tal como aparece",
  "brand": "marca del producto",
  "barcode": "código de barras COMPLETO (13 dígitos típicamente) - OBLIGATORIO si es visible o conocido",
  "price": "precio si es visible, o 'No visible'",
  "quantity": número estimado de unidades visibles,
  "description": "para qué sirve en máximo 10 palabras",
  "characteristics": "características principales en máximo 15 palabras",
  "targetMarket": "mercado objetivo",
  "usage": "uso específico del producto",
  "category": "categoría del producto"
}

Responde ÚNICAMENTE con el objeto JSON válido, sin texto adicional.`;

        const analysis = await analyzeWithGemini(prompt, base64Image);

        console.log('Análisis recibido:', analysis); // DEBUG: ver qué devuelve Gemini

        let verifiedImageUrl = '';
        if (analysis.productName && analysis.productName !== 'Producto desconocido') {
          let searchQuery = '';

          if (analysis.barcode && analysis.barcode !== 'No detectado') {
            searchQuery = `${analysis.barcode} ${analysis.brand} ${analysis.productName}`;
          } else {
            searchQuery = `${analysis.brand} ${analysis.productName} producto`;
          }

          verifiedImageUrl = await searchImageOnWeb(searchQuery);
        }

        const newItem: InventoryItem = {
          id: Date.now().toString(),
          imageUrl: verifiedImageUrl || reader.result as string,
          productName: analysis.productName || 'Producto desconocido',
          brand: analysis.brand || 'N/A',
          barcode: analysis.barcode || 'No detectado', // ASEGURAR que siempre tenga valor
          price: analysis.price || 'No visible',
          category: analysis.category || 'Sin categoría',
          quantity: typeof analysis.quantity === 'number' ? analysis.quantity : 1,
          description: analysis.description || 'Sin descripción',
          characteristics: analysis.characteristics || 'Sin características',
          targetMarket: analysis.targetMarket || 'General',
          usage: analysis.usage || 'Uso general',
          confidence: 85,
          verifiedImage: verifiedImageUrl
        };

        console.log('Item creado:', newItem); // DEBUG: verificar que el barcode esté en el item

        setCurrentAnalysis(newItem);
        setShowConfirmModal(true);

        const newCredits = { ...credits, used: credits.used + 1 };
        saveCredits(newCredits);

        if (newCredits.used === newCredits.total) {
          setTimeout(() => {
            setUpgradeType(newCredits.isRegistered ? 'upgrade' : 'register');
            setShowUpgradeModal(true);
          }, 2000);
        }
      } catch (error) {
        console.error('Error analizando imagen:', error);
        alert(`Error al analizar la imagen: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      } finally {
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      setIsProcessing(false);
      alert('Error al leer el archivo');
    };

    reader.readAsDataURL(file);
  };

  const handleEdit = (id: string) => {
    const item = items.find(i => i.id === id);
    if (item) {
      setCurrentAnalysis(item);
      setShowConfirmModal(true);
    }
  };

  const handleDelete = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleUpdateItem = (id: string, field: keyof InventoryItem, value: string | number) => {
    if (currentAnalysis) {
      setCurrentAnalysis({
        ...currentAnalysis,
        [field]: value
      });
    }
  };

  const handleConfirmItem = () => {
    if (currentAnalysis) {
      const existingIndex = items.findIndex(i => i.id === currentAnalysis.id);
      if (existingIndex >= 0) {
        setItems(items.map(item =>
          item.id === currentAnalysis.id ? currentAnalysis : item
        ));
      } else {
        setItems([...items, currentAnalysis]);
      }
    }
    setShowConfirmModal(false);
    setCurrentAnalysis(null);
  };

  const handleExport = () => {
    const csv = [
      ['Producto', 'Marca', 'Código', 'Precio', 'Categoría', 'Cantidad', 'Descripción', 'Características', 'Mercado', 'Uso', 'Confianza'],
      ...items.map(item => [
        item.productName,
        item.brand,
        item.barcode,
        item.price,
        item.category,
        item.quantity,
        item.description,
        item.characteristics,
        item.targetMarket,
        item.usage,
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

  const handleContactSales = () => {
    window.location.href = 'mailto:rodrigopacheco965@gmail.com?subject=Interested in Stockia Premium';
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
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 tracking-tight mb-2">Dashboard</h1>
              <p className="text-neutral-600">Sube imágenes, toma fotos o escanea códigos para análisis con IA</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-white border border-neutral-200 rounded-xl px-4 py-2 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-neutral-600" />
                <div className="text-sm">
                  <div className="font-semibold text-neutral-900">{remainingCredits} / {credits.total} análisis</div>
                  <div className="text-xs text-neutral-500">{credits.isRegistered ? 'Registrado' : 'Prueba'}</div>
                </div>
              </div>

              {!credits.isRegistered && (
                <button
                  onClick={() => { setUpgradeType('register'); setShowUpgradeModal(true); }}
                  className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors flex items-center gap-2"
                >
                  <Crown className="w-4 h-4" />Registrar +5
                </button>
              )}
            </div>
          </div>

          {credits.used < credits.total ? (
            <UploadArea onFilesUpload={handleFilesUpload} onBarcodeScan={startBarcodeScanner} />
          ) : (
            <div className="bg-neutral-100 border-2 border-dashed border-neutral-300 rounded-2xl p-12 text-center mb-8">
              <div className="inline-flex w-16 h-16 bg-neutral-200 rounded-2xl items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-neutral-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Límite alcanzado</h3>
              <p className="text-neutral-600 mb-4">
                {credits.isRegistered ? 'Contáctanos para análisis ilimitados' : 'Regístrate para +5 análisis'}
              </p>
              <button
                onClick={() => { setUpgradeType(credits.isRegistered ? 'upgrade' : 'register'); setShowUpgradeModal(true); }}
                className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-neutral-800 transition-colors"
              >
                {credits.isRegistered ? 'Contactar' : 'Registrar'}
              </button>
            </div>
          )}

          {isProcessing && (
            <div className="bg-white rounded-2xl border border-neutral-200 p-8 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 border-3 border-neutral-200 border-t-black rounded-full animate-spin"></div>
                <div>
                  <h3 className="font-bold text-neutral-900 mb-1">Procesando...</h3>
                  <p className="text-sm text-neutral-600">La IA está analizando tu producto</p>
                </div>
              </div>
            </div>
          )}

          {items.length > 0 && (
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center">
                <h2 className="text-lg font-bold text-neutral-900">Productos Detectados ({items.length})</h2>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-neutral-800 transition-colors"
                >
                  <Download className="w-4 h-4" />Exportar CSV
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-200">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Imagen</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Producto</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Marca</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Código</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Precio</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Categoría</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Cantidad</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-6 py-4">
                          <img
                            src={item.verifiedImage || item.imageUrl}
                            alt={item.productName}
                            className="w-12 h-12 rounded-lg object-cover border border-neutral-200"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-neutral-900">{item.productName}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-neutral-700">{item.brand}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-neutral-700 font-mono">{item.barcode}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-neutral-900">{item.price}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-sm">{item.category}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-neutral-900">{item.quantity}</div>
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

      {/* Barcode Scanner Modal */}
      {showBarcodeScanner && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-neutral-900">Escanear Código de Barras</h3>
                <button onClick={stopBarcodeScanner} className="text-neutral-400 hover:text-neutral-600 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div id="barcode-reader" className="w-full rounded-xl overflow-hidden"></div>
              <p className="text-sm text-neutral-600 mt-4 text-center">Apunta la cámara al código de barras</p>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && currentAnalysis && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full my-8">
            <div className="p-8 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-neutral-900">Confirmar Información del Producto</h2>
                <button
                  onClick={() => { setShowConfirmModal(false); setCurrentAnalysis(null); }}
                  className="text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Imagen Original</label>
                  <img
                    src={currentAnalysis.imageUrl}
                    alt="Product"
                    className="w-full h-64 object-cover rounded-xl border border-neutral-200"
                  />
                  {currentAnalysis.verifiedImage && (
                    <>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2 mt-4">Imagen Verificada (Web)</label>
                      <img
                        src={currentAnalysis.verifiedImage}
                        alt="Verified"
                        className="w-full h-64 object-cover rounded-xl border border-green-200"
                      />
                    </>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Nombre del Producto</label>
                    <input
                      type="text"
                      value={currentAnalysis.productName}
                      onChange={(e) => handleUpdateItem(currentAnalysis.id, 'productName', e.target.value)}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">Marca</label>
                      <input
                        type="text"
                        value={currentAnalysis.brand}
                        onChange={(e) => handleUpdateItem(currentAnalysis.id, 'brand', e.target.value)}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">Precio</label>
                      <input
                        type="text"
                        value={currentAnalysis.price}
                        onChange={(e) => handleUpdateItem(currentAnalysis.id, 'price', e.target.value)}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">Código de Barras</label>
                      <input
                        type="text"
                        value={currentAnalysis.barcode} // Debe mostrar el valor
                        onChange={(e) => handleUpdateItem(currentAnalysis.id, 'barcode', e.target.value)}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black font-mono"
                      />
                      {/* DEBUG: mostrar valor directamente */}
                      <p className="text-xs text-neutral-500 mt-1">Valor actual: {currentAnalysis.barcode}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">Cantidad</label>
                      <input
                        type="number"
                        value={currentAnalysis.quantity}
                        onChange={(e) => handleUpdateItem(currentAnalysis.id, 'quantity', parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Categoría</label>
                    <input
                      type="text"
                      value={currentAnalysis.category}
                      onChange={(e) => handleUpdateItem(currentAnalysis.id, 'category', e.target.value)}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Descripción</label>
                    <textarea
                      value={currentAnalysis.description}
                      onChange={(e) => handleUpdateItem(currentAnalysis.id, 'description', e.target.value)}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Características</label>
                    <textarea
                      value={currentAnalysis.characteristics}
                      onChange={(e) => handleUpdateItem(currentAnalysis.id, 'characteristics', e.target.value)}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">Mercado Objetivo</label>
                      <input
                        type="text"
                        value={currentAnalysis.targetMarket}
                        onChange={(e) => handleUpdateItem(currentAnalysis.id, 'targetMarket', e.target.value)}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">Uso Específico</label>
                      <input
                        type="text"
                        value={currentAnalysis.usage}
                        onChange={(e) => handleUpdateItem(currentAnalysis.id, 'usage', e.target.value)}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleConfirmItem}
                  className="flex-1 px-6 py-4 bg-black text-white rounded-xl font-semibold hover:bg-neutral-800 transition-colors"
                >
                  Confirmar y Agregar
                </button>
                <button
                  onClick={() => { setShowConfirmModal(false); setCurrentAnalysis(null); }}
                  className="px-6 py-4 text-neutral-600 hover:text-neutral-900 font-medium transition-colors border border-neutral-300 rounded-xl "
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-neutral-100 rounded-2xl flex items-center justify-center">
                  {upgradeType === 'register' ? <Crown className="w-6 h-6 text-neutral-900" /> : <AlertCircle className="w-6 h-6 text-neutral-900" />}
                </div>
                <button onClick={() => setShowUpgradeModal(false)} className="text-neutral-400 hover:text-neutral-600 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {upgradeType === 'register' ? (
                <>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-3 tracking-tight">Has usado tus análisis gratis</h2>
                  <p className="text-neutral-600 mb-6 leading-relaxed">Crea una cuenta gratis para obtener 5 análisis más y desbloquear funciones adicionales.</p>

                  <div className="space-y-3 mb-6">
                    {['5 análisis adicionales gratis', 'Guarda tu historial de inventario', 'Comparte catálogos con clientes', 'Soporte prioritario por email'].map((feature, index) => (
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
                  <button className="w-full px-6 py-4 bg-black text-white rounded-xl font-semibold hover:bg-neutral-800 transition-colors mb-3">
                    Crear Cuenta Gratis
                  </button>
                  <button onClick={() => setShowUpgradeModal(false)} className="w-full px-6 py-3 text-neutral-600 hover:text-neutral-900 font-medium transition-colors">
                    Tal vez después
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-3 tracking-tight">¿Listo para análisis ilimitados?</h2>
                  <p className="text-neutral-600 mb-6 leading-relaxed">Has alcanzado tu límite de análisis. Actualiza para continuar gestionando tu inventario sin límites.</p>

                  <div className="bg-neutral-50 rounded-2xl p-6 mb-6">
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-4xl font-bold text-neutral-900">Personalizado</span>
                    </div>
                    <div className="space-y-2 text-sm text-neutral-700">
                      {['Análisis ilimitados con IA', 'Opciones avanzadas de exportación', 'Soporte prioritario', 'Acceso a API'].map((f, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full"></div>
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button onClick={handleContactSales} className="w-full px-6 py-4 bg-black text-white rounded-xl font-semibold hover:bg-neutral-800 transition-colors mb-3">
                    Contáctanos
                  </button>
                  <button onClick={() => setShowUpgradeModal(false)} className="w-full px-6 py-3 text-neutral-600 hover:text-neutral-900 font-medium transition-colors">
                    Ahora no
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