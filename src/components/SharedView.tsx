import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MessageCircle, X, Send } from 'lucide-react';
import { InventoryItem } from './Dashboard';
import { decodeShareToken } from '../utils/shareableLink';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'seller';
  timestamp: Date;
}

export default function SharedView() {
  const { token } = useParams<{ token: string }>();
  const productIds = token ? decodeShareToken(token) : [];
  
  // Simulated config (vendría del backend)
  const sellerConfig = {
    name: 'Sofia',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop',
    welcomeMessage: 'Hola, bienvenido a nuestra tienda. ¿En qué puedo ayudarte hoy?',
    catalogTitle: 'Colección Premium',
    catalogDescription: 'Productos seleccionados con cuidado para ti',
    behavior: 'friendly' as const,
    phoneNumber: '+59112345678',
    adaptToUser: true,
  };

  const visibleAttributes = {
    category: true,
    quantity: true,
  };
  
  const sharedProducts: InventoryItem[] = [
    { id: '1', imageUrl: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800', productName: 'Nike Air Max 90', category: 'Footwear', quantity: 12, confidence: 98 },
    { id: '2', imageUrl: 'https://images.pexels.com/photos/6069122/pexels-photo-6069122.jpeg?auto=compress&cs=tinysrgb&w=800', productName: 'Ceramic Coffee Mug', category: 'Kitchen', quantity: 45, confidence: 85 },
    { id: '3', imageUrl: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800', productName: 'Sony Alpha a7 III', category: 'Electronics', quantity: 3, confidence: 99 },
  ].filter(item => productIds.includes(item.id));

  const [showGenderModal, setShowGenderModal] = useState(true);
  const [userGender, setUserGender] = useState<'male' | 'female' | 'no-say' | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (userGender && sellerConfig.adaptToUser) {
      setShowWelcome(true);
    }
  }, [userGender]);

  const handleGenderSelect = (gender: 'male' | 'female' | 'no-say') => {
    setUserGender(gender);
    setShowGenderModal(false);
  };

  const getPersonalizedGreeting = () => {
    if (!sellerConfig.adaptToUser || userGender === 'no-say') {
      return sellerConfig.welcomeMessage;
    }
    
    if (userGender === 'male') {
      return 'Hola, bienvenido. Estoy aquí para ayudarte a encontrar exactamente lo que buscas.';
    } else {
      return 'Hola, bienvenida. Me encantaría ayudarte a encontrar algo perfecto para ti.';
    }
  };

  const getSellerResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('precio') || lowerMessage.includes('cuesta')) {
      return 'Con gusto te puedo ayudar con información de precios. ¿Cuál producto te interesa?';
    }
    
    if (lowerMessage.includes('disponible') || lowerMessage.includes('stock')) {
      return 'Todos los productos que ves aquí están disponibles. ¿Te gustaría saber sobre alguno en particular?';
    }
    
    if (lowerMessage.includes('envío') || lowerMessage.includes('entrega')) {
      return 'Tenemos envíos rápidos y seguros. El tiempo varía según tu ubicación. ¿Dónde te encuentras?';
    }
    
    if (lowerMessage.includes('gracias')) {
      return 'Con mucho gusto. Estoy aquí para lo que necesites.';
    }
    
    return 'Interesante. ¿Podrías darme más detalles? Así puedo ayudarte mejor.';
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const sellerMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: getSellerResponse(inputMessage),
        sender: 'seller',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, sellerMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const handleWhatsAppContact = (productName: string) => {
    const message = `Hola, me interesa el producto: ${productName}. ¿Podrías darme más información?`;
    const whatsappUrl = `https://wa.me/${sellerConfig.phoneNumber.replace(/\s/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-neutral-50" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&display=swap');
      `}</style>

      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">{sellerConfig.catalogTitle}</h1>
            <p className="text-sm text-neutral-500 mt-0.5">{sellerConfig.catalogDescription}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sharedProducts.map((item, index) => (
            <article
              key={item.id}
              className="group"
              style={{
                animation: 'fadeIn 0.6s ease-out forwards',
                animationDelay: `${index * 100}ms`,
                opacity: 0,
              }}
            >
              <style>{`
                @keyframes fadeIn {
                  from { opacity: 0; transform: translateY(20px); }
                  to { opacity: 1; transform: translateY(0); }
                }
              `}</style>
              
              <div className="relative overflow-hidden bg-neutral-100 rounded-2xl mb-4 aspect-square">
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-neutral-900 tracking-tight">
                  {item.productName}
                </h3>
                
                {(visibleAttributes.category || visibleAttributes.quantity) && (
                  <div className="flex items-center gap-3 text-sm text-neutral-600">
                    {visibleAttributes.category && (
                      <span className="px-3 py-1 bg-neutral-100 rounded-full">
                        {item.category}
                      </span>
                    )}
                    {visibleAttributes.quantity && (
                      <span className="font-medium">
                        {item.quantity} disponibles
                      </span>
                    )}
                  </div>
                )}
                
                <button
                  onClick={() => handleWhatsAppContact(item.productName)}
                  className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 group/btn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Consultar por WhatsApp
                </button>
              </div>
            </article>
          ))}
        </div>

        {sharedProducts.length === 0 && (
          <div className="text-center py-24">
            <p className="text-neutral-400 text-lg">No hay productos disponibles</p>
          </div>
        )}
      </main>

      {/* Gender Selection Modal */}
      {showGenderModal && sellerConfig.adaptToUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center">
            <div className="mb-6">
              <img
                src={sellerConfig.avatarUrl}
                alt={sellerConfig.name}
                className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
              />
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                Personaliza tu experiencia
              </h2>
              <p className="text-neutral-600 text-sm">
                Para ofrecerte mejor atención, ¿cómo te identificas?
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => handleGenderSelect('male')}
                className="w-full py-4 bg-neutral-100 hover:bg-neutral-200 rounded-xl font-medium text-neutral-900 transition-colors"
              >
                Masculino
              </button>
              <button
                onClick={() => handleGenderSelect('female')}
                className="w-full py-4 bg-neutral-100 hover:bg-neutral-200 rounded-xl font-medium text-neutral-900 transition-colors"
              >
                Femenino
              </button>
              <button
                onClick={() => handleGenderSelect('no-say')}
                className="w-full py-4 bg-neutral-100 hover:bg-neutral-200 rounded-xl font-medium text-neutral-900 transition-colors"
              >
                Prefiero no decirlo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Dialog */}
      {showWelcome && !showGenderModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-8 text-center">
              <img
                src={sellerConfig.avatarUrl}
                alt={sellerConfig.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-neutral-100"
              />
              
              <div className="bg-neutral-50 rounded-2xl p-6 mb-6">
                <h3 className="text-xl font-bold text-neutral-900 mb-2">
                  {sellerConfig.name}
                </h3>
                <p className="text-neutral-700 leading-relaxed">
                  {getPersonalizedGreeting()}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowWelcome(false)}
                  className="flex-1 px-6 py-3 bg-neutral-100 text-neutral-700 rounded-xl hover:bg-neutral-200 transition-colors font-medium"
                >
                  Continuar
                </button>
                <button
                  onClick={() => {
                    setShowWelcome(false);
                    setShowChat(true);
                  }}
                  className="flex-1 px-6 py-3 bg-black text-white rounded-xl hover:bg-neutral-800 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chatear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Widget */}
      {showChat && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-neutral-200">
          {/* Chat Header */}
          <div className="bg-black text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={sellerConfig.avatarUrl}
                alt={sellerConfig.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="font-semibold">{sellerConfig.name}</div>
                <div className="text-xs text-neutral-400">En línea</div>
              </div>
            </div>
            <button
              onClick={() => setShowChat(false)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50">
            {/* Initial greeting */}
            <div className="flex gap-3">
              <img
                src={sellerConfig.avatarUrl}
                alt={sellerConfig.name}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
              <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-sm max-w-[80%]">
                <p className="text-sm text-neutral-800">{getPersonalizedGreeting()}</p>
              </div>
            </div>

            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                {message.sender === 'seller' && (
                  <img
                    src={sellerConfig.avatarUrl}
                    alt={sellerConfig.name}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                )}
                <div
                  className={`rounded-2xl px-4 py-3 shadow-sm max-w-[80%] ${
                    message.sender === 'user'
                      ? 'bg-black text-white rounded-tr-none'
                      : 'bg-white text-neutral-800 rounded-tl-none'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <img
                  src={sellerConfig.avatarUrl}
                  alt={sellerConfig.name}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
                <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-neutral-200 p-4 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Escribe tu mensaje..."
                className="flex-1 px-4 py-3 bg-neutral-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="px-4 py-3 bg-black text-white rounded-xl hover:bg-neutral-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Chat Button */}
      {!showChat && !showWelcome && !showGenderModal && (
        <button
          onClick={() => setShowChat(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-black text-white rounded-full shadow-2xl hover:scale-110 transition-all flex items-center justify-center z-40"
        >
          <MessageCircle className="w-7 h-7" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
        </button>
      )}
    </div>
  );
}