import React, { useState, useEffect } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems, 
  isCheckoutDisabled = false,
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart 
}) {
  const [selectedItemKeys, setSelectedItemKeys] = useState([]);

  // Select all items by default when cart opens
  useEffect(() => {
    if (isOpen) {
      setSelectedItemKeys(cartItems.map((item) => `${item.id}-${item.selectedOption}`));
    }
  }, [isOpen, cartItems]);

  if (!isOpen) return null;

  const toggleCheckItem = (key) => {
    setSelectedItemKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const selectedCartItems = cartItems.filter((item) =>
    selectedItemKeys.includes(`${item.id}-${item.selectedOption}`)
  );

  const subtotal = selectedCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShippingThreshold = 30000;
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 3000;
  const grandTotal = subtotal + shippingFee;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 border-b border-sky-100 flex items-center justify-between bg-sky-50/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-sky-600" />
              <h2 className="text-lg font-black text-slate-900">장바구니</h2>
              <span className="text-xs font-bold px-2 py-0.5 bg-sky-100 text-sky-800 rounded-full">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}개
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-900 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Gauge */}
          <div className="bg-[#EBF5FF] p-3.5 border-b border-sky-100/60">
            <div className="flex justify-between text-xs font-bold text-sky-900 mb-1">
              <span>
                {subtotal >= freeShippingThreshold
                  ? '🎉 무료 배송 조건이 충족되었습니다!'
                  : `무료 배송까지 ${(freeShippingThreshold - subtotal).toLocaleString()}원 남았습니다.`}
              </span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full bg-sky-200/60 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-sky-500 h-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-12">
                <ShoppingBag className="w-12 h-12 stroke-[1.5] mb-3 text-slate-300" />
                <p className="text-sm font-semibold">장바구니가 비어 있습니다.</p>
                <p className="text-xs text-slate-400 mt-1">마음에 드는 굿즈를 담아보세요!</p>
              </div>
            ) : (
              cartItems.map((item) => {
                const itemKey = `${item.id}-${item.selectedOption}`;
                const isChecked = selectedItemKeys.includes(itemKey);

                return (
                  <div
                    key={itemKey}
                    className="p-3.5 bg-white rounded-2xl border border-sky-100 shadow-xs flex items-center gap-3"
                  >
                    {/* Item Left Checkbox */}
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleCheckItem(itemKey)}
                      className="w-4 h-4 rounded text-sky-500 border-slate-300 focus:ring-sky-400 cursor-pointer"
                    />

                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded-xl border border-slate-100 bg-slate-50"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {item.name}
                      </h4>
                      {item.selectedOption && (
                        <span className="text-[10px] text-slate-400 block">
                          옵션: {item.selectedOption}
                        </span>
                      )}
                      <span className="text-xs font-black text-slate-900 block mt-0.5">
                        ₩ {(item.price * item.quantity).toLocaleString()}
                      </span>

                      {/* Quantity Controller */}
                      <div className="flex items-center gap-2 mt-1.5">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.selectedOption, item.quantity - 1)}
                          className="w-4 h-4 rounded bg-slate-100 border text-xs font-bold flex items-center justify-center text-slate-600 hover:bg-slate-200"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="text-xs font-bold text-slate-800">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.selectedOption, item.quantity + 1)}
                          className="w-4 h-4 rounded bg-slate-100 border text-xs font-bold flex items-center justify-center text-slate-600 hover:bg-slate-200"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id, item.selectedOption)}
                      className="text-slate-400 hover:text-rose-500 p-1"
                      title="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Cart Footer & Disabled Checkout State ("준비 중입니다") */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-slate-100 space-y-4 bg-white shadow-lg">
              <div className="space-y-1 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>선택 상품 금액 ({selectedCartItems.length}개)</span>
                  <span className="font-bold text-slate-900">₩ {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>배송비</span>
                  <span className="font-bold text-slate-900">
                    {shippingFee === 0 ? '무료' : `₩ ${shippingFee.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-100">
                  <span>총 결제 예정 금액</span>
                  <span className="text-sky-600 text-base">₩ {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Button: Disabled state displays "준비 중입니다" */}
              <button
                disabled={true}
                className="w-full py-3.5 bg-slate-300 text-slate-600 font-extrabold text-xs rounded-2xl shadow-none cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                <span>준비 중입니다</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
