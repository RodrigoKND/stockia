// import { useParams } from 'react-router-dom';
// import { decodeShareToken } from '../utils/shareableLink';

export default function SharedView() {
  // const { token } = useParams<{ token: string }>();
  
  const sellerConfig = {
    name: 'Sofia',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop',
    welcomeMessage: 'Hola, bienvenido a nuestra tienda. ¿En qué puedo ayudarte hoy?',
    catalogTitle: 'Colección Premium',
    catalogDescription: 'Productos seleccionados con cuidado para ti',
    behavior: 'friendly',
    phoneNumber: '+59112345678',
    adaptToUser: true,
  };

  const visibleAttributes = {
    category: true,
    quantity: true,
  };
  
  const sharedProducts = [
    { id: '1', imageUrl: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800', productName: 'Nike Air Max 90', category: 'Footwear', quantity: 12, confidence: 98 },
    { id: '3', imageUrl: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800', productName: 'Sony Alpha a7 III', category: 'Electronics', quantity: 3, confidence: 99 },
  ];

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
    </div>
  );
}