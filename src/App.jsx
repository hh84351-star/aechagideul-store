import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ShopPage from './components/ShopPage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import AdminPage from './components/AdminPage';
import GoodsDetailModal from './components/GoodsDetailModal';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import Footer from './components/Footer';

import { 
  INITIAL_CHARACTERS, 
  INITIAL_BANNERS, 
  INITIAL_PRODUCTS, 
  INITIAL_INQUIRIES 
} from './data/initialData';

import { 
  getProducts, 
  saveProductsToStorage, 
  getInquiries, 
  saveInquiriesToStorage 
} from './lib/supabase';

export default function App() {
  // Navigation active tab: 'shop' (default) | 'about' | 'contact' | 'admin'
  const [activeTab, setActiveTab] = useState('shop');

  // App Data States
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [banners, setBanners] = useState(INITIAL_BANNERS);
  const [inquiries, setInquiries] = useState(INITIAL_INQUIRIES);

  // User Interactive States
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('aechagi_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('aechagi_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedProductModal, setSelectedProductModal] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutDisabledMode, setIsCheckoutDisabledMode] = useState(false);

  // Load Hybrid Data on Mount
  useEffect(() => {
    async function loadData() {
      const prodData = await getProducts();
      if (prodData && prodData.length > 0) setProducts(prodData);

      const inqData = await getInquiries();
      if (inqData && inqData.length > 0) setInquiries(inqData);
    }
    loadData();
  }, []);

  // Save changes
  useEffect(() => {
    saveProductsToStorage(products);
  }, [products]);

  useEffect(() => {
    saveInquiriesToStorage(inquiries);
  }, [inquiries]);

  useEffect(() => {
    localStorage.setItem('aechagi_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('aechagi_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Wishlist Toggle
  const handleToggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const handleRemoveWishlist = (id) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  // Cart Operations
  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const option = product.selectedOption || (product.options ? product.options[0] : '기본');
      const existingIndex = prevCart.findIndex(
        (item) => item.id === product.id && item.selectedOption === option
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        return [...prevCart, { ...product, selectedOption: option, quantity: 1 }];
      }
    });
  };

  const handleUpdateCartQuantity = (id, option, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveCartItem(id, option);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.selectedOption === option
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const handleRemoveCartItem = (id, option) => {
    setCart((prev) =>
      prev.filter((item) => !(item.id === id && item.selectedOption === option))
    );
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Inquiry operations
  const handleSendInquiry = (newInquiry) => {
    setInquiries((prev) => [newInquiry, ...prev]);
  };

  // Reset to default data
  const handleResetData = () => {
    if (window.confirm('모든 데이터(상품, 배너, 문의 내역)를 초기 데이터로 복원하시겠습니까?')) {
      setProducts(INITIAL_PRODUCTS);
      setBanners(INITIAL_BANNERS);
      setInquiries(INITIAL_INQUIRIES);
      localStorage.clear();
      alert('데이터가 성공적으로 리셋되었습니다!');
    }
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistIds = wishlist.map((w) => w.id);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 font-sans">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartItemsCount={totalCartCount}
        wishlistItemsCount={wishlist.length}
        openCart={() => {
          setIsCheckoutDisabledMode(false);
          setIsCartOpen(true);
        }}
        openWishlist={() => setIsWishlistOpen(true)}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {activeTab === 'shop' && (
          <ShopPage
            products={products}
            banners={banners}
            characters={INITIAL_CHARACTERS}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onSelectProduct={(product) => setSelectedProductModal(product)}
          />
        )}

        {activeTab === 'about' && (
          <AboutPage
            characters={INITIAL_CHARACTERS}
            onNavigateToShop={() => setActiveTab('shop')}
          />
        )}

        {activeTab === 'contact' && (
          <ContactPage
            onSendInquiry={handleSendInquiry}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPage
            products={products}
            setProducts={setProducts}
            banners={banners}
            setBanners={setBanners}
            inquiries={inquiries}
            setInquiries={setInquiries}
            characters={INITIAL_CHARACTERS}
            onResetData={handleResetData}
            onNavigateToShop={() => setActiveTab('shop')}
          />
        )}
      </main>

      {/* Product Detail Modal */}
      {selectedProductModal && (
        <GoodsDetailModal
          product={selectedProductModal}
          character={INITIAL_CHARACTERS.find((c) => c.id === selectedProductModal.characterId)}
          isWishlisted={wishlistIds.includes(selectedProductModal.id)}
          onToggleWishlist={handleToggleWishlist}
          onClose={() => setSelectedProductModal(null)}
          onAddToCart={handleAddToCart}
          onOpenCart={(disabledMode = false) => {
            setIsCheckoutDisabledMode(disabledMode);
            setIsCartOpen(true);
          }}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        isCheckoutDisabled={isCheckoutDisabledMode}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlist}
        onRemoveWishlist={handleRemoveWishlist}
        onAddToCart={handleAddToCart}
      />

      {/* Footer */}
      <Footer onNavigate={(tab) => setActiveTab(tab)} />
    </div>
  );
}
