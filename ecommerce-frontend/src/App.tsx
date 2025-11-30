import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProductCard } from './components/products/ProductCard';
import { Cart } from './components/cart/Cart';
import { useCart } from './hooks/useCart';
import './App.css';
import ErrorBoundary from './components/ErrorBoundary';
import { AdminPanel } from './components/admin/AdminPanel';

const queryClient = new QueryClient();

function AppContent() {
  const { products, isLoading, cartError, productsError } = useCart();
  const [activeTab, setActiveTab] = useState<'products' | 'cart' | 'admin'>('products');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Ecommerce Store
          </h1>
          <nav className="flex justify-center space-x-4">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-md ${activeTab === 'products'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab('cart')}
              className={`px-4 py-2 rounded-md ${activeTab === 'cart'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
            >
              Shopping Cart
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-4 py-2 rounded-md ${activeTab === 'admin'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
            >
              Admin
            </button>
          </nav>
        </header>

        <main>
          {isLoading ? (
            <div className="text-center py-20">Loading data...</div>
          ) : cartError || productsError ? (
            <div className="text-center py-20 text-red-600">
              Error loading data. Open developer console for details.
            </div>
          ) : (
            <>
              {activeTab === 'products' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {(Array.isArray(products) ? products : []).map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}

              {activeTab === 'cart' && <Cart />}
              {activeTab === 'admin' && <AdminPanel />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;