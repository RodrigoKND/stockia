import { LayoutDashboard, Camera, Users, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate} from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = () => {
    if (confirm('¿Estás seguro de cerrar sesión?')) {
      navigate('/');
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Camera className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <div className="text-lg font-semibold text-gray-900">STOCKIA</div>
            <div className="text-xs text-gray-500">Inventory Manager</div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4">
        <Link
          to="/dashboard"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium mb-1 transition-colors ${
            location.pathname === '/dashboard'
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </Link>
        <Link
          to="/published"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
            location.pathname === '/published'
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Users className="w-5 h-5" />
          Published Products
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-200 space-y-3">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 font-medium transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">AM</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900 text-sm truncate">Alex Morgan</div>
          </div>
        </div>
      </div>
    </div>
  );
}
