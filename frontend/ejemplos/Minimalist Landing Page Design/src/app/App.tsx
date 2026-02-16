import { 
  ShoppingBag, 
  Store, 
  Heart, 
  Award, 
  MapPin, 
  Users, 
  Sparkles,
  UserPlus,
  Search,
  HandshakeIcon,
  Leaf,
  TrendingUp,
  RotateCcw,
  ArrowRight
} from 'lucide-react';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <span className="font-bold text-xl">TerretaShop</span>
            </div>
            <div className="flex gap-3">
              <button className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors">
                ES
              </button>
              <button className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                CAT
              </button>
              <button className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                EN
              </button>
            </div>
          </div>

          {/* Hero Content */}
          <div className="text-center max-w-4xl mx-auto pb-20 pt-12">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-gray-900">
              El mercado local de tu ciudad
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Compra productos cercanos, de calidad, directamente de personas como tú.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <a 
                href="/comprar" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30"
              >
                <ShoppingBag className="w-5 h-5" />
                Comprar
              </a>
              <a 
                href="/vender" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-900 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:text-orange-500 transition-colors"
              >
                <Store className="w-5 h-5" />
                Vender
              </a>
            </div>

            <p className="text-sm text-gray-500">
              Accede o crea tu cuenta para empezar →{' '}
              <a href="/login" className="text-orange-500 hover:underline">
                terreta.shop/login
              </a>
            </p>
          </div>
        </div>

        {/* Decorative element */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent"></div>
      </section>

      {/* Qué es TerretaShop */}
      <section id="que-es" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-gray-900">
                ¿Qué es TerretaShop?
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                TerretaShop es una plataforma pensada para conectar a las personas de una ciudad entre sí. Aquí puedes comprar productos cercanos, apoyar a productores locales y descubrir lo que se crea a tu alrededor.
              </p>
            </div>
            <div className="relative h-80 rounded-2xl overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1668434484181-00a60e9bf14b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2NhbCUyMGZhcm1lcnMlMjBtYXJrZXQlMjBmcmVzaCUyMHByb2R1Y2V8ZW58MXx8fHwxNzcwNjI1MjMyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Mercado local"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            <div className="bg-orange-50 p-8 rounded-2xl border border-orange-100">
              <MapPin className="w-12 h-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Producto cercano</h3>
              <p className="text-gray-600">
                Compra a personas de tu propia ciudad.
              </p>
            </div>
            
            <div className="bg-orange-50 p-8 rounded-2xl border border-orange-100">
              <Award className="w-12 h-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Calidad real</h3>
              <p className="text-gray-600">
                Productos hechos con cuidado, sin grandes intermediarios.
              </p>
            </div>
            
            <div className="bg-orange-50 p-8 rounded-2xl border border-orange-100">
              <Heart className="w-12 h-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Impacto local</h3>
              <p className="text-gray-600">
                Apoyas directamente a gente de tu entorno.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Para Compradores */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Compra diferente. Compra local.
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <MapPin className="w-7 h-7 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Cerca de ti</h3>
              <p className="text-gray-600">
                Encuentra productos hechos en tu ciudad.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Más humano</h3>
              <p className="text-gray-600">
                Detrás de cada producto hay una persona.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="w-7 h-7 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Mejor calidad</h3>
              <p className="text-gray-600">
                Menos industrial, más auténtico.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Para Vendedores */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">
              Si los mercados habituales no funcionan, apóyate en tu ciudad.
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              TerretaShop te permite mostrar lo que haces y venderlo directamente a personas de tu entorno, sin depender de grandes plataformas.
            </p>
            <a 
              href="/login" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30"
            >
              Quiero vender
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section id="como-funciona" className="py-20 bg-gradient-to-br from-orange-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Cómo funciona
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/30">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold">
                  Paso 1
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Regístrate</h3>
              <p className="text-gray-600">
                Crea tu cuenta en menos de un minuto.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/30">
                <Search className="w-8 h-8 text-white" />
              </div>
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold">
                  Paso 2
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Explora o publica</h3>
              <p className="text-gray-600">
                Compra productos cercanos o empieza a vender los tuyos.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/30">
                <HandshakeIcon className="w-8 h-8 text-white" />
              </div>
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold">
                  Paso 3
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Conecta con tu ciudad</h3>
              <p className="text-gray-600">
                Apoya la economía local de forma directa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sostenibilidad / ODS */}
      <section id="sostenibilidad" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">
              Compromiso con el entorno
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              TerretaShop impulsa el consumo de proximidad, reduce el transporte innecesario y fomenta economías locales más sostenibles.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Consumo responsable</h3>
              <p className="text-sm text-gray-600">
                Compra consciente y sostenible
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Store className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Apoyo al comercio local</h3>
              <p className="text-sm text-gray-600">
                Fortalece tu comunidad
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Reducción de huella</h3>
              <p className="text-sm text-gray-600">
                Menos transporte, menos emisiones
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <RotateCcw className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Economía circular</h3>
              <p className="text-sm text-gray-600">
                Comunidad y proximidad
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-orange-500 to-orange-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
            Forma parte de la Terreta
          </h2>
          <p className="text-xl text-orange-100 mb-10">
            Compra, vende y conecta con la gente de tu ciudad.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/comprar" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-orange-500 rounded-lg hover:bg-gray-50 transition-colors shadow-xl"
            >
              <ShoppingBag className="w-5 h-5" />
              Comprar
            </a>
            <a 
              href="/vender" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-orange-700 text-white rounded-lg hover:bg-orange-800 transition-colors border-2 border-orange-600 shadow-xl"
            >
              <Store className="w-5 h-5" />
              Vender
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
