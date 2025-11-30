import React, { useState } from 'react';
import type { Product } from '../../types';
import { useCart } from '../../hooks/useCart';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, isAdding } = useCart();
  const [localLoading, setLocalLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleAddToCart = async () => {
    try {
      setLocalLoading(true);
      await addToCart({ productId: product.id, quantity: 1 });
    } catch (err) {
      console.error('Add to cart failed', err);
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
        }}
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{product.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">
            ${typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
          </span>
          <span className={`text-sm ${product.stock > 0 ? 'text-gray-500' : 'text-red-500'}`}>
            {product.stock} in stock
          </span>
        </div>
        
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isAdding || localLoading}
          className="mt-4 w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {product.stock === 0
            ? 'Out of Stock'
            : (isAdding || localLoading)
            ? 'Adding...'
            : 'Add to Cart'}
        </button>

        <button
          onClick={() => setShowDetails(true)}
          className="mt-2 w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
        >
          View Details
        </button>

        {/* Product Details Modal */}
        {showDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{product.name}</h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded mb-4"
              />
              <p className="text-gray-600 mb-4">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
                <span className="text-sm text-gray-500">{product.stock} in stock</span>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAdding || localLoading}
                className="mt-4 w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {product.stock === 0
                  ? 'Out of Stock'
                  : (isAdding || localLoading)
                  ? 'Adding...'
                  : 'Add to Cart'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};