import { useState } from 'react';
import {
  Camera,
  Sparkles,
  FileSpreadsheet,
  ChevronDown,
  CheckCircle,
  Zap,
  ArrowRight,
  Upload,
} from 'lucide-react';
import { faqs } from '../mockdata/faq';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  const [faqsQuantity, setFaqsQuantity] = useState({ initial: 0, final: 4 });

  const showFaqs = () => {
    const STEP = 4;
    setFaqsQuantity(prev =>
      prev.final >= faqs.length
        ? { initial: 0, final: STEP }
        : { initial: 0, final: Math.min(prev.final + STEP, faqs.length) }
    );
  };

  return (
    <div className="bg-neutral-50" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur-md">
        <nav className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Stockia</span>
          </div>
          <Link to="/login" className="px-6 py-2.5 bg-black text-white rounded-lg font-medium hover:bg-neutral-800 hover:scale-105 transition-all duration-300 hover:shadow-lg">
            Comenzar
          </Link>
        </nav>
      </header>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <article className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-sm font-medium text-blue-600 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              Automatización inteligente
            </div>

            <h1 className="text-6xl md:text-7xl font-bold leading-[1.1] animate-fade-in">
              Convierte <span className="text-blue-500 relative inline-block">
                fotos
              </span>
              <span>en </span>
              <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                inventario listo
              </span> para vender
            </h1>

            <p className="text-xl text-neutral-600 max-w-lg leading-relaxed">
              Automatiza tu inventario y catálogo sin Excel ni registros manuales.
              Sube fotos, la IA hace el resto.
            </p>

            <div className="flex gap-4 pt-4">
              <Link to="/login" className="group px-8 py-4 bg-black text-white rounded-xl font-semibold hover:bg-neutral-800 hover:scale-105 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl">
                Probar Beta
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <ul className="flex flex-wrap gap-6 text-sm text-neutral-600 pt-4">
              <li className="flex items-center gap-2 group cursor-default">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                </div>
                <span className="font-medium">Precisión +95%</span>
              </li>
              <li className="flex items-center gap-2 group cursor-default">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <span className="font-medium">Resultados en minutos</span>
              </li>
            </ul>
          </article>

          <aside className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all opacity-50"></div>
            <img
              src="https://images.pexels.com/photos/4483610/pexels-photo-4483610.jpeg"
              alt="Inventario automatizado"
              className="relative rounded-3xl shadow-2xl group-hover:scale-[1.02] transition-transform duration-500"
            />
          </aside>
        </div>
      </section>

      {/* PROCESO */}
      <section className="bg-white border-y border-neutral-200 py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Cómo funciona</h2>
            <p className="text-xl text-neutral-600">Simple, rápido y automático</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: Upload, title: 'Sube fotos', desc: 'Arrastra tus imágenes de productos al sistema' },
              { step: '02', icon: Sparkles, title: 'IA procesa', desc: 'Detectamos y clasificamos automáticamente' },
              { step: '03', icon: FileSpreadsheet, title: 'Catálogo listo', desc: 'Comparte o exporta tu inventario' }
            ].map(({ step, icon: Icon, title, desc }, i) => (
              <div key={i} className="relative group">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-neutral-50 rounded-2xl border-2 border-neutral-200 group-hover:border-blue-500 group-hover:bg-blue-50 transition-all duration-300">
                    <Icon className="w-10 h-10 text-neutral-700 group-hover:text-blue-600 group-hover:scale-110 transition-all" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center font-bold text-sm group-hover:scale-110 transition-transform">
                    {step}
                  </div>
                  <h3 className="text-2xl font-bold">{title}</h3>
                  <p className="text-neutral-600">{desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-neutral-300 to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-neutral-900 to-neutral-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50"></div>

        <div className="relative max-w-4xl mx-auto text-center px-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm font-medium mb-8 backdrop-blur-sm">
            <Zap className="w-4 h-4 text-yellow-400" />
            Únete a la beta ahora
          </div>

          <h2 className="text-5xl lg:text-6xl font-bold mb-6">
            Deja de perder tiempo
          </h2>
          <p className="text-xl text-neutral-300 mb-10 max-w-2xl mx-auto">
            Enfócate en lo que más importa para tu negocio
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="mailto:rodrigopacheco965@gmail.com"
              className="group px-12 py-4 bg-white text-black rounded-xl font-semibold hover:bg-neutral-100 hover:scale-105 transition-all duration-300 shadow-2xl flex items-center gap-2"
            >
              Solicitar demo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-neutral-50">
        <div className="max-w-3xl mx-auto px-6 lg:px-12">
          <h2 className="text-5xl font-bold text-center mb-4">
            Preguntas frecuentes
          </h2>
          <p className="text-xl text-neutral-600 text-center mb-16">
            Todo lo que necesitas saber
          </p>

          <div className="space-y-4">
            {faqs.slice(0, faqsQuantity.final).map((faq, i) => (
              <details
                key={i}
                className="group bg-white border border-neutral-200 rounded-2xl p-6 hover:border-neutral-300 hover:shadow-md transition-all duration-300"
              >
                <summary className="flex justify-between items-center cursor-pointer font-semibold text-lg">
                  <span className="pr-8">{faq.question}</span>
                  <ChevronDown className="w-5 h-5 text-neutral-400 group-open:rotate-180 transition-transform duration-300 flex-shrink-0" />
                </summary>
                <p className="mt-4 text-neutral-600 leading-relaxed pl-1">{faq.answer}</p>
              </details>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={showFaqs}
              className="inline-flex items-center gap-2 text-neutral-700 font-semibold hover:text-black transition-colors group"
            >
              {faqsQuantity.final >= faqs.length ? 'Mostrar menos' : 'Mostrar más'}
              <ChevronDown className={`w-4 h-4 transition-transform ${faqsQuantity.final >= faqs.length ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </section>


      {/* FOOTER */}
      <footer className="border-t bg-white py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <Camera className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold">Stockia</span>
            </div>

            <p className="text-sm text-neutral-500">
              © {new Date().getFullYear()} STOCKIA. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}