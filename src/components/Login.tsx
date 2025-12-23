import { Camera } from 'lucide-react';

export default function LoginPage() {
  const handleGoogleLogin = () => {
    // Aquí iría la lógica de autenticación con Google
    // Por ejemplo usando Firebase Auth o tu provider preferido
    console.log('Iniciando sesión con Google...');
    // window.location.href = '/api/auth/google';
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&display=swap');
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-float-delay {
          animation: float 3s ease-in-out infinite;
          animation-delay: 0.5s;
        }
        
        .animate-float-delay-2 {
          animation: float 3s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>

      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8" style={{ animation: 'fadeIn 0.6s ease-out' }}>
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center">
              <Camera className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold tracking-tight text-neutral-900">Stockia</span>
          </div>

          {/* Welcome Text */}
          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-neutral-900 tracking-tight">
              Welcome back
            </h1>
            <p className="text-lg text-neutral-600">
              Sign in to manage your inventory with AI
            </p>
          </div>

          {/* Google Sign In Button */}
          <div className="pt-4">
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-white border-2 border-neutral-200 hover:border-neutral-300 rounded-xl px-6 py-4 flex items-center justify-center gap-3 transition-all hover:shadow-lg group"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="font-semibold text-neutral-900">Continue with Google</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-neutral-50 text-neutral-500">
                Quick & secure authentication
              </span>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-4 pt-4">
            {[
              'AI-powered inventory detection',
              'Export to CSV, XLSX, PDF',
              'Share catalogs with clients'
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 text-neutral-600">
                <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm font-medium">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Terms */}
          <p className="text-xs text-neutral-500 leading-relaxed">
            By signing in, you agree to our{' '}
            <a href="#" className="text-neutral-900 hover:underline font-medium">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-neutral-900 hover:underline font-medium">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-neutral-100 to-neutral-50 items-center justify-center p-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 right-20 w-64 h-64 bg-neutral-200 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-neutral-300 rounded-full blur-3xl"></div>
        </div>

        {/* Main Illustration */}
        <div className="relative w-full max-w-2xl">
          <svg viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            {/* Person 1 - Left - Holding a box */}
            <g className="animate-float">
              {/* Body */}
              <ellipse cx="200" cy="380" rx="35" ry="50" fill="#4A90E2" opacity="0.9"/>
              <rect x="175" y="340" width="50" height="70" rx="25" fill="#4A90E2"/>
              
              {/* Head */}
              <circle cx="200" cy="300" r="30" fill="#F4A261"/>
              
              {/* Hair */}
              <path d="M 180 285 Q 200 270 220 285 Q 215 295 200 300 Q 185 295 180 285" fill="#2C3E50"/>
              
              {/* Arms holding box */}
              <ellipse cx="160" cy="360" rx="12" ry="35" fill="#4A90E2" transform="rotate(-30 160 360)"/>
              <ellipse cx="240" cy="360" rx="12" ry="35" fill="#4A90E2" transform="rotate(30 240 360)"/>
              
              {/* Box */}
              <rect x="160" y="340" width="80" height="60" rx="8" fill="#E9C46A" stroke="#D4A853" strokeWidth="3"/>
              <line x1="160" y1="370" x2="240" y2="370" stroke="#D4A853" strokeWidth="2"/>
              <line x1="200" y1="340" x2="200" y2="400" stroke="#D4A853" strokeWidth="2"/>
              
              {/* Legs */}
              <ellipse cx="185" cy="435" rx="12" ry="40" fill="#2C3E50"/>
              <ellipse cx="215" cy="435" rx="12" ry="40" fill="#2C3E50"/>
            </g>

            {/* Person 2 - Center - Scanning with phone */}
            <g className="animate-float-delay">
              {/* Body */}
              <ellipse cx="400" cy="350" rx="40" ry="55" fill="#E76F51" opacity="0.9"/>
              <rect x="370" y="305" width="60" height="80" rx="30" fill="#E76F51"/>
              
              {/* Head */}
              <circle cx="400" cy="270" r="32" fill="#F4A261"/>
              
              {/* Hair */}
              <ellipse cx="400" cy="255" rx="35" ry="25" fill="#8B4513"/>
              
              {/* Arm with phone */}
              <ellipse cx="350" cy="340" rx="15" ry="40" fill="#E76F51" transform="rotate(-45 350 340)"/>
              
              {/* Phone */}
              <g transform="translate(310, 310)">
                <rect width="35" height="60" rx="5" fill="#2C3E50"/>
                <rect x="3" y="3" width="29" height="50" rx="2" fill="#4A90E2" opacity="0.3"/>
                
                {/* Scan lines */}
                <line x1="17" y1="10" x2="17" y2="45" stroke="#4A90E2" strokeWidth="2" opacity="0.6">
                  <animate attributeName="y1" values="10;45;10" dur="2s" repeatCount="indefinite"/>
                  <animate attributeName="y2" values="15;50;15" dur="2s" repeatCount="indefinite"/>
                </line>
              </g>
              
              {/* Other arm */}
              <ellipse cx="450" cy="340" rx="15" ry="38" fill="#E76F51"/>
              
              {/* Legs */}
              <ellipse cx="385" cy="410" rx="13" ry="42" fill="#2C3E50"/>
              <ellipse cx="415" cy="410" rx="13" ry="42" fill="#2C3E50"/>
            </g>

            {/* Person 3 - Right - Celebrating with checklist */}
            <g className="animate-float-delay-2">
              {/* Body */}
              <ellipse cx="600" cy="370" rx="38" ry="52" fill="#2A9D8F" opacity="0.9"/>
              <rect x="572" y="325" width="56" height="75" rx="28" fill="#2A9D8F"/>
              
              {/* Head */}
              <circle cx="600" cy="290" r="31" fill="#F4A261"/>
              
              {/* Hair */}
              <path d="M 575 280 Q 600 265 625 280 L 620 290 Q 600 285 580 290 Z" fill="#2C3E50"/>
              
              {/* Arms */}
              <ellipse cx="555" cy="350" rx="14" ry="38" fill="#2A9D8F" transform="rotate(-25 555 350)"/>
              <ellipse cx="645" cy="345" rx="14" ry="36" fill="#2A9D8F" transform="rotate(45 645 345)"/>
              
              {/* Checklist paper */}
              <g transform="translate(520, 330)">
                <rect width="50" height="65" rx="3" fill="white" stroke="#2C3E50" strokeWidth="2"/>
                <line x1="10" y1="15" x2="40" y2="15" stroke="#4A90E2" strokeWidth="2"/>
                <line x1="10" y1="27" x2="40" y2="27" stroke="#4A90E2" strokeWidth="2"/>
                <line x1="10" y1="39" x2="40" y2="39" stroke="#4A90E2" strokeWidth="2"/>
                <circle cx="12" cy="15" r="3" fill="#2A9D8F"/>
                <circle cx="12" cy="27" r="3" fill="#2A9D8F"/>
                <circle cx="12" cy="39" r="3" fill="#2A9D8F"/>
                <path d="M 10 13 L 13 16 L 16 12" stroke="white" strokeWidth="2" fill="none"/>
                <path d="M 10 25 L 13 28 L 16 24" stroke="white" strokeWidth="2" fill="none"/>
                <path d="M 10 37 L 13 40 L 16 36" stroke="white" strokeWidth="2" fill="none"/>
              </g>
              
              {/* Legs */}
              <ellipse cx="585" cy="430" rx="13" ry="41" fill="#2C3E50"/>
              <ellipse cx="615" cy="430" rx="13" ry="41" fill="#2C3E50"/>
            </g>

            {/* Floating elements */}
            <g opacity="0.6">
              {/* Camera icon */}
              <g className="animate-float" transform="translate(150, 200)">
                <rect width="40" height="35" rx="5" fill="#4A90E2" opacity="0.3"/>
                <circle cx="20" cy="18" r="10" fill="#4A90E2" opacity="0.5"/>
                <rect x="15" y="3" width="10" height="4" rx="2" fill="#4A90E2" opacity="0.4"/>
              </g>
              
              {/* Box icon */}
              <g className="animate-float-delay" transform="translate(650, 180)">
                <rect width="35" height="35" rx="3" fill="#E9C46A" opacity="0.3" stroke="#D4A853" strokeWidth="2"/>
                <line x1="0" y1="17.5" x2="35" y2="17.5" stroke="#D4A853" strokeWidth="1.5" opacity="0.4"/>
                <line x1="17.5" y1="0" x2="17.5" y2="35" stroke="#D4A853" strokeWidth="1.5" opacity="0.4"/>
              </g>
              
              {/* Checkmark */}
              <g className="animate-float-delay-2" transform="translate(700, 350)">
                <circle r="20" fill="#2A9D8F" opacity="0.3"/>
                <path d="M -6 0 L -2 4 L 6 -6" stroke="#2A9D8F" strokeWidth="3" fill="none" opacity="0.5" strokeLinecap="round"/>
              </g>
              
              {/* Sparkles */}
              <g className="animate-float" transform="translate(250, 150)">
                <path d="M 0,-8 L 2,-2 L 8,0 L 2,2 L 0,8 L -2,2 L -8,0 L -2,-2 Z" fill="#F4A261" opacity="0.4"/>
              </g>
              
              <g className="animate-float-delay-2" transform="translate(550, 480)">
                <path d="M 0,-6 L 1.5,-1.5 L 6,0 L 1.5,1.5 L 0,6 L -1.5,1.5 L -6,0 L -1.5,-1.5 Z" fill="#E76F51" opacity="0.4"/>
              </g>
            </g>

            {/* Text caption */}
            <text x="400" y="550" textAnchor="middle" fill="#2C3E50" fontSize="24" fontWeight="600" fontFamily="Instrument Sans, sans-serif">
              Inventory made simple
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}