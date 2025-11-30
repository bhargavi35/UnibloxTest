import React, { useState, useEffect } from 'react';
import { useCart } from '../../hooks/useCart';

export const Cart: React.FC = () => {
  const {
    cart,
    products,
    updateCartItem,
    removeFromCart,
    applyDiscount,
    removeDiscount,
    checkout,
    isCheckoutLoading,
    discountError,
    clearDiscountError,
    availableDiscounts,
    nextDiscountAt,
    loadAvailableDiscounts,
    generateTestDiscount,
    isGeneratingTestDiscount,
    discountsLoading,
  } = useCart();

  const [discountCode, setDiscountCode] = useState('');
  const [showAvailableDiscounts, setShowAvailableDiscounts] = useState(false);
  const [lastGeneratedCode, setLastGeneratedCode] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔄 Cart component mounted, loading available discounts...');
    loadAvailableDiscounts();
  }, [loadAvailableDiscounts]);

  // ✅ Auto-apply discount when lastGeneratedCode changes
  useEffect(() => {
    if (lastGeneratedCode && !cart?.discountCode) {
      console.log('🔄 Auto-applying last generated discount code:', lastGeneratedCode);
      applyDiscount(lastGeneratedCode);
    }
  }, [lastGeneratedCode, cart?.discountCode, applyDiscount]);

  const handleApplyDiscount = () => {
    if (discountCode.trim()) {
      console.log('🔄 Applying discount code:', discountCode);
      applyDiscount(discountCode);
    }
  };

  const handleCheckout = () => {
    console.log('🔄 Starting checkout process...');
    checkout();
  };

  const handleDiscountCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDiscountCode(e.target.value);
    if (discountError) {
      clearDiscountError();
    }
  };

  const handleGenerateTestDiscount = async () => {
    const testCode = `TEST${Date.now().toString(36).toUpperCase()}`;
    console.log('🔄 Generating test discount code:', testCode);
    
    try {
      // ✅ Clear any previous errors
      clearDiscountError();
      
      // ✅ Generate the test discount
      await generateTestDiscount(testCode);
      
      // ✅ Store the last generated code for auto-application
      setLastGeneratedCode(testCode);
      
      // ✅ Populate the input field
      setDiscountCode(testCode);
      
      console.log('✅ Test discount generated successfully:', testCode);
      
    } catch (error) {
      console.error('❌ Error generating test discount:', error);
      // Error is already handled by the mutation
    }
  };

  // ✅ Apply discount from available list
  const applyDiscountFromList = (code: string) => {
    setDiscountCode(code);
    applyDiscount(code);
    setShowAvailableDiscounts(false);
  };

  if (!cart || !products) return <div>Loading cart...</div>;

  const safeProducts = Array.isArray(products) ? products : [];
  const cartItems = Array.isArray(cart.items) ? cart.items : [];

  const cartItemsWithProducts = cartItems.map(item => ({
    ...item,
    product: safeProducts.find(p => p.id === item.productId),
  }));

  const total = Number(cart.total || 0);
  const discountAmount = Number(cart.discountAmount || 0);
  const finalAmount = total - discountAmount;

  console.log('📊 Cart state:', {
    cartItems: cartItems.length,
    availableDiscounts: availableDiscounts.length,
    nextDiscountAt,
    total,
    discountAmount,
    currentDiscountCode: cart.discountCode,
    lastGeneratedCode
  });

  // ✅ FIX 1: Don't show any discount sections when cart is empty
  const isCartEmpty = cartItemsWithProducts.length === 0;
  
  // ✅ FIX 2: Don't show available discounts when a coupon is already applied
  const showAvailableDiscountsSection = !isCartEmpty && availableDiscounts.length > 0 && !cart.discountCode;
  
  // ✅ FIX 3: Don't show discount opportunity when cart is empty or coupon applied
  const showDiscountOpportunity = !isCartEmpty && nextDiscountAt !== null && nextDiscountAt > 0 && !cart.discountCode;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h2>
      
      {/* ✅ Test discount button - Only show when cart has items */}
      {!isCartEmpty && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-yellow-800 text-sm font-medium">Developer Tools</span>
              <p className="text-yellow-700 text-xs mt-1">
                Generate and auto-apply a test discount code
              </p>
            </div>
            <button
              onClick={handleGenerateTestDiscount}
              disabled={isGeneratingTestDiscount}
              className="bg-yellow-500 text-white px-3 py-2 rounded text-sm hover:bg-yellow-600 disabled:bg-gray-400 transition-colors"
            >
              {isGeneratingTestDiscount ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                  Generating...
                </div>
              ) : (
                'Generate Test Discount'
              )}
            </button>
          </div>
          
          {/* ✅ Show last generated code info */}
          {lastGeneratedCode && (
            <div className="mt-2 p-2 bg-yellow-100 rounded">
              <p className="text-yellow-800 text-xs">
                <strong>Last Generated:</strong> {lastGeneratedCode}
                {cart.discountCode === lastGeneratedCode && (
                  <span className="ml-2 text-green-600">✓ Applied</span>
                )}
              </p>
            </div>
          )}
        </div>
      )}
      
      {isCartEmpty ? (
        <p className="text-gray-500">Your cart is empty</p>
      ) : (
        <>
          <div className="space-y-4">
            {cartItemsWithProducts.map(item => (
              <div key={item.productId} className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.product?.image || '/placeholder-image.jpg'}
                    alt={item.product?.name || 'Product'}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold">{item.product?.name || 'Unknown Product'}</h3>
                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateCartItem({ productId: item.productId, quantity: Math.max(0, item.quantity - 1) })}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateCartItem({ productId: item.productId, quantity: item.quantity + 1 })}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ✅ Discount Information Banner - Only show when no coupon applied and cart has items */}
          {showDiscountOpportunity && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-blue-900">Discount Opportunity!</h4>
                  <p className="text-blue-700 text-sm">
                    Complete {nextDiscountAt} more order{nextDiscountAt > 1 ? 's' : ''} to receive a 10% discount code
                  </p>
                </div>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {nextDiscountAt} order{nextDiscountAt > 1 ? 's' : ''} away
                </div>
              </div>
            </div>
          )}

          {/* ✅ Available Discounts Section - Only show when no coupon applied and cart has items */}
          {showAvailableDiscountsSection && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-green-900">Available Discount Codes!</h4>
                  <p className="text-green-700 text-sm">
                    You have {availableDiscounts.length} discount code{availableDiscounts.length > 1 ? 's' : ''} available
                  </p>
                </div>
                <button
                  onClick={() => setShowAvailableDiscounts(!showAvailableDiscounts)}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                >
                  {showAvailableDiscounts ? 'Hide Codes' : 'View Codes'}
                </button>
              </div>

              {showAvailableDiscounts && (
                <div className="mt-3 space-y-2">
                  {discountsLoading ? (
                    <div className="text-center py-2 text-gray-500">Loading discounts...</div>
                  ) : (
                    availableDiscounts.map((discount, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-3 rounded border">
                        <div>
                          <span className="font-mono text-lg font-bold">{discount.code}</span>
                          <span className="ml-2 text-green-600">({discount.discountPercent}% OFF)</span>
                        </div>
                        <button
                          onClick={() => applyDiscountFromList(discount.code)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* ✅ Discount Code Input Section - Always show when cart has items */}
          {!isCartEmpty && (
            <div className="mt-6">
              {cart.discountCode ? (
                <div className="flex items-center justify-between bg-green-50 p-3 rounded">
                  <div>
                    <span className="text-green-800 font-semibold">
                      Discount applied: {cart.discountCode}
                    </span>
                    <span className="text-green-600 ml-2">
                      (-${discountAmount.toFixed(2)})
                    </span>
                  </div>
                  <button
                    onClick={() => removeDiscount()}
                    className="text-green-800 hover:text-green-900 font-medium transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={discountCode}
                      onChange={handleDiscountCodeChange}
                      placeholder="Enter discount code"
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleApplyDiscount}
                      disabled={!discountCode.trim()}
                      className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {discountError && (
                    <div className="text-red-600 text-sm bg-red-50 p-2 rounded border border-red-200">
                      {discountError}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Order Summary */}
          <div className="mt-6 border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-semibold">${total.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount:</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-xl font-bold mt-2 pt-2 border-t">
              <span>Total Amount:</span>
              <span className="text-green-600">${finalAmount.toFixed(2)}</span>
            </div>
            
            {/* Savings Information - Only show when discount is applied */}
            {discountAmount > 0 && (
              <div className="bg-green-50 p-3 rounded mt-2">
                <p className="text-green-800 text-sm text-center">
                  🎉 You saved ${discountAmount.toFixed(2)} with your discount!
                </p>
              </div>
            )}
          </div>

          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            disabled={isCheckoutLoading}
            className="mt-6 w-full bg-primary-600 text-white py-3 px-4 rounded-md hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold text-lg"
          >
            {isCheckoutLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing Order...
              </div>
            ) : (
              `Proceed to Checkout - $${finalAmount.toFixed(2)}`
            )}
          </button>
        </>
      )}
    </div>
  );
};