import { useState } from 'react';
import { Camera, Sparkles, FileSpreadsheet, ChevronDown } from 'lucide-react';
import { faqs } from '../mockdata/faq';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  const [faqsQuantity, setFaqsQuantity] = useState<{ initial: number; final: number }>({
    initial: 0,
    final: 4
  });

  const showFaqs = () => {
    const STEPS_FAQS = 4;

    if (faqsQuantity.final >= faqs.length) {
      setFaqsQuantity({
        initial: 0,
        final: 4
      });
      return;
    }

    const newFinal = faqsQuantity.final + STEPS_FAQS;

    setFaqsQuantity({
      initial: 0,
      final: newFinal > faqs.length ? faqs.length : newFinal
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&display=swap');
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>

      {/* Header */}
      <header className="border-b border-neutral-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-neutral-900">Stockia</span>
          </div>
          <Link
            to="/login"
            className="px-6 py-2.5 bg-black text-white rounded-lg font-medium hover:bg-neutral-800 transition-all"
          >
            Comenzar
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-fade-in-up">
            <h1 className="text-6xl md:text-7xl font-bold text-neutral-900 leading-[1.1] tracking-tight">
              Convierte <span className="text-blue-500">fotos</span> de productos en <span className="text-blue-500">inventario</span> limpio
            </h1>
            <p className="text-xl text-neutral-600 leading-relaxed max-w-lg">
              Sube una foto de tu stock y deja que nuestra IA cuente, categorice y exporte tu inventario físico a una hoja de cálculo editable al instante.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/dashboard"
                className="px-8 py-4 bg-black text-white rounded-xl font-semibold hover:bg-neutral-800 transition-all text-center"
              > 
                Sube Fotos y Prueba la Beta
              </Link>
            </div>
            <div className="flex items-center gap-8 text-sm text-neutral-500 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-medium">99% de Precisión</span>
              </div>
              <span>Tu inventario más simple</span>
            </div>
          </div>
          <div className="relative animate-fade-in" style={{ animationDelay: '0.2s', opacity: 0 }}>
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/5 to-transparent rounded-3xl"></div>
            <img
              src="https://images.pexels.com/photos/4483610/pexels-photo-4483610.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Inventario de almacén"
              className="rounded-3xl shadow-2xl w-full"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-24 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-20 max-w-2xl mx-auto">
            <h2 className="text-5xl font-bold text-neutral-900 mb-6 tracking-tight">
              Gestión de Inventario Simplificada
            </h2>
            <p className="text-lg text-neutral-600">
              Pasa de estantes desordenados a datos organizados en tres simples pasos.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: Camera,
                title: '1. Captura',
                description: 'Usa tu teléfono para subir la imagen de los estantes de tu almacén directamente a la plataforma.'
              },
              {
                icon: Sparkles,
                title: '2. Procesa',
                description: 'La IA identifica artículos, cuenta cantidades y etiqueta productos automáticamente en segundos.'
              },
              {
                icon: FileSpreadsheet,
                title: '3. Exporta',
                description: 'Revisa, edita y descarga en formato CSV, XLSX y PDF. Conéctalo directamente a tu sistema ERP.'
              }
            ].map((step, index) => (
              <div 
                key={index} 
                className="text-center space-y-6 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.15}s`, opacity: 0 }}
              >
                <div className="inline-flex w-16 h-16 bg-neutral-100 rounded-2xl items-center justify-center">
                  <step.icon className="w-8 h-8 text-neutral-900" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900">{step.title}</h3>
                <p className="text-neutral-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-24 bg-neutral-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-5xl font-bold text-neutral-900 mb-6 tracking-tight">
              Panel Potente
            </h2>
            <p className="text-lg text-neutral-600">
              Revisa los artículos detectados con cajas delimitadoras y edita la tabla de datos resultante línea por línea.
            </p>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 bg-white">
            <div className="bg-neutral-900 px-6 py-4 flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/7679454/pexels-photo-7679454.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Vista previa del panel"
                className="w-full h-96 object-cover bg-neutral-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            <div className="absolute bottom-8 right-8">
              <Link
                to="/dashboard"
                className="px-8 py-3 bg-white text-neutral-900 rounded-xl font-semibold hover:bg-neutral-100 transition-all shadow-xl"
              >
                Abrir CSV
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white border-y border-neutral-200">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-5xl font-bold text-neutral-900 mb-6 tracking-tight">
            Porque tu tiempo sí importa
          </h2>
          <p className="text-xl text-neutral-600 mb-10">
            No pierdas tiempo registrando cada producto
          </p>
          <a 
            href='mailto:rodrigopacheco965@gmail.com'
            target="_blank"
            rel="noopener noreferrer"
            data-testid="get-a-demo-button"
            className="inline-block px-12 py-4 bg-black text-white rounded-xl font-semibold hover:bg-neutral-800 transition-all text-lg"
          >
            Solicitar una Demo
          </a>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-neutral-50">
        <div className="max-w-3xl mx-auto px-6 lg:px-12">
          <h2 className="text-5xl font-bold text-neutral-900 mb-16 text-center tracking-tight">
            Preguntas Frecuentes
          </h2>

          <div className="space-y-4">
            {faqs.slice(faqsQuantity.initial, faqsQuantity.final).map((faq, index) => (
              <details
                key={index}
                className="group bg-white border border-neutral-200 rounded-2xl p-6 hover:border-neutral-300 transition-all"
              >
                <summary className="flex justify-between items-start cursor-pointer list-none">
                  <span className="font-semibold text-neutral-900 pr-8 leading-relaxed">{faq.question}</span>
                  <ChevronDown className="w-5 h-5 text-neutral-400 group-open:rotate-180 transition-transform flex-shrink-0 mt-1" />
                </summary>
                <p className="mt-4 text-neutral-600 leading-relaxed">{faq.answer}</p>
              </details>
            ))}
            <div className="text-center mt-8">
              <button 
                className="text-neutral-900 font-semibold hover:text-neutral-600 transition-colors underline underline-offset-4" 
                onClick={showFaqs}
              >
                {faqsQuantity.final >= faqs.length ? 'Mostrar menos' : 'Mostrar más'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-neutral-900">Stockia</span>
            </div>
            <div className="flex gap-10 text-sm text-neutral-600">
              <a href="#" className="hover:text-neutral-900 transition-colors font-medium">
                Política de Privacidad
              </a>
              <a href="#" className="hover:text-neutral-900 transition-colors font-medium">
                Términos de Servicio
              </a>
              <a href="mailto:rodrigopacheco965@gmail.com" className="hover:text-neutral-900 transition-colors font-medium">
                Soporte
              </a>
            </div>
          </div>
          <div className="mt-12 text-center text-sm text-neutral-500">
            © {new Date().getFullYear()} STOCKIA. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}