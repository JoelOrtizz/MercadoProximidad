import { Instagram, Twitter, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Columna 1 - Marca */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="font-semibold text-lg">TerretaShop</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Conectando personas con producto local de su ciudad.
            </p>
            <p className="text-sm font-medium text-orange-500">terreta.shop</p>
          </div>

          {/* Columna 2 - Navegación */}
          <div>
            <h3 className="font-semibold mb-4">Navegación</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-sm text-gray-600 hover:text-orange-500 transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a href="/comprar" className="text-sm text-gray-600 hover:text-orange-500 transition-colors">
                  Comprar
                </a>
              </li>
              <li>
                <a href="/vender" className="text-sm text-gray-600 hover:text-orange-500 transition-colors">
                  Vender
                </a>
              </li>
              <li>
                <a href="/login" className="text-sm text-gray-600 hover:text-orange-500 transition-colors">
                  Acceder
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 3 - Proyecto */}
          <div>
            <h3 className="font-semibold mb-4">TerretaShop</h3>
            <ul className="space-y-2">
              <li>
                <a href="#que-es" className="text-sm text-gray-600 hover:text-orange-500 transition-colors">
                  Qué es TerretaShop
                </a>
              </li>
              <li>
                <a href="#como-funciona" className="text-sm text-gray-600 hover:text-orange-500 transition-colors">
                  Cómo funciona
                </a>
              </li>
              <li>
                <a href="#sostenibilidad" className="text-sm text-gray-600 hover:text-orange-500 transition-colors">
                  Sostenibilidad (ODS)
                </a>
              </li>
              <li>
                <a href="#contacto" className="text-sm text-gray-600 hover:text-orange-500 transition-colors">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 4 - Idioma */}
          <div>
            <h3 className="font-semibold mb-4">Idioma</h3>
            <div className="flex gap-3">
              <button className="text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors">
                ES
              </button>
              <button className="text-sm text-gray-600 hover:text-orange-500 transition-colors">
                CAT
              </button>
              <button className="text-sm text-gray-600 hover:text-orange-500 transition-colors">
                EN
              </button>
            </div>
          </div>

          {/* Columna 5 - Social */}
          <div>
            <h3 className="font-semibold mb-4">Social</h3>
            <div className="flex gap-4">
              <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Subfooter */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="text-xs text-gray-600">
              © TerretaShop – Plataforma de comercio local
            </p>
            <p className="text-xs text-gray-600">
              Hecho para impulsar la economía de proximidad
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
