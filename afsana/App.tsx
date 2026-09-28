
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductPage } from './components/ProductPage';
import { CartPage } from './components/CartPage';
import { CheckoutPage } from './components/CheckoutPage';
import { WebGLBackground } from './components/WebGLBackground';
import { Footer } from './components/Footer';
import { Product, CartItem, Order } from './types';

const INITIAL_PRODUCTS: Product[] = [
  { 
    id: 'tee-01',
    title: 'KIKU PLAIN GREY TEE', 
    price: '$22.00', 
    category: 'Essentials', 
    description: 'Perfect grey flat-lay t-shirt. Ideal for AI Try-On.',
    images: [
      '/image3.jfif',
      '/image3.jfif',
      '/image3.jfif'
    ],
    colors: ['Grey'],
    sizes: ['S', 'M', 'L']
  },
  { 
    id: 'jacket-01',
    title: 'KIKU LUCKY CAT GRAPHIC TEE', 
    price: '$35.00', 
    category: 'T-Shirts', 
    description: 'Dark grey graphic t-shirt featuring a Japanese Lucky Cat (Maneki-neko) design.',
    images: [
      '/image1.jfif',
      '/image1.jfif',
      '/image1.jfif'
    ],
    colors: ['Dark Grey'],
    sizes: ['S', 'M', 'L']
  },
  { 
    id: 'jacket-02',
    title: 'KIKU GOOD FORTUNE TANUKI TEE', 
    price: '$35.00', 
    category: 'T-Shirts', 
    description: 'Olive green graphic t-shirt featuring a Tanuki and "Good Fortune" text.',
    images: [
      '/image2.jfif',
      '/image2.jfif',
      '/image2.jfif'
    ],
    colors: ['Olive Green'],
    sizes: ['S', 'M', 'L', 'XL']
  },
  { 
    id: 'tee-04',
    title: 'NEW ARRIVAL TEE 4', 
    price: '$28.00', 
    category: 'T-Shirts', 
    description: 'A premium new addition to the AFSANA collection.',
    images: ['/image4.jfif', '/image4.jfif', '/image4.jfif'],
    colors: ['Mixed'],
    sizes: ['S', 'M', 'L', 'XL']
  },
  { 
    id: 'tee-05',
    title: 'NEW ARRIVAL TEE 5', 
    price: '$28.00', 
    category: 'T-Shirts', 
    description: 'A premium new addition to the AFSANA collection.',
    images: ['/image5.jfif', '/image5.jfif', '/image5.jfif'],
    colors: ['Mixed'],
    sizes: ['S', 'M', 'L', 'XL']
  },
  { 
    id: 'tee-06',
    title: 'NEW ARRIVAL TEE 6', 
    price: '$28.00', 
    category: 'T-Shirts', 
    description: 'A premium new addition to the AFSANA collection.',
    images: ['/image6.jfif', '/image6.jfif', '/image6.jfif'],
    colors: ['Mixed'],
    sizes: ['S', 'M', 'L', 'XL']
  },
  { 
    id: 'tee-07',
    title: 'NEW ARRIVAL TEE 7', 
    price: '$28.00', 
    category: 'T-Shirts', 
    description: 'A premium new addition to the AFSANA collection.',
    images: ['/image7.jfif', '/image7.jfif', '/image7.jfif'],
    colors: ['Mixed'],
    sizes: ['S', 'M', 'L', 'XL']
  },
  { 
    id: 'tee-08',
    title: 'NEW ARRIVAL TEE 8', 
    price: '$28.00', 
    category: 'T-Shirts', 
    description: 'A premium new addition to the AFSANA collection.',
    images: ['/image8.jfif', '/image8.jfif', '/image8.jfif'],
    colors: ['Mixed'],
    sizes: ['S', 'M', 'L', 'XL']
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<'store' | 'product' | 'cart' | 'checkout'>('store');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
    } catch (e) {
      return 'dark';
    }
  });
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [globalScrollY, setGlobalScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setGlobalScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      // ignore
    }
    document.documentElement.className = theme;
    document.body.className = `${theme} bg-slate-50 dark:bg-slate-950`;
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const addToCart = (product: Product, size: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id && item.selectedSize === size);
      if (existing) {
        return prev.map(item => item === existing ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1, selectedSize: size }];
    });
  };

  const updateQuantity = (id: string, size: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === id && item.selectedSize === size) {
        const next = item.quantity + delta;
        // Fix for Problem #4: Don't allow less than 1 quantity
        if (next < 1) return item;
        return { ...item, quantity: next };
      }
      return item;
    }));
  };

  const removeItem = (id: string, size: string) => {
    setCart(prev => prev.filter(item => !(item.product.id === id && item.selectedSize === size)));
  };

  const handleOrderSubmit = (customerData: any) => {
    const newOrder: Order = {
      id: `AFS-ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      customer: customerData,
      items: [...cart],
      total: cartTotal,
      status: 'Pending',
      timestamp: new Date().toISOString()
    };
    setOrders([newOrder, ...orders]);
    setCart([]);
    setView('store');
    try {
      alert("ORDER SECURED");
    } catch (e) {
      console.log("ORDER SECURED");
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => {
    const price = parseFloat(item.product.price.replace('$', ''));
    return sum + price * item.quantity;
  }, 0) + (cart.length > 0 ? 15 : 0);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${theme === 'dark' ? 'dark' : 'light'} bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white selection:bg-rose-500 selection:text-white`}>
      <WebGLBackground scrollY={globalScrollY} theme={theme} />

      <Navbar 
        onHome={() => { setView('store'); setSelectedProduct(null); }} 
        onEnterCommand={() => {}}
        onOpenCart={() => setView('cart')}
        cartCount={cartCount}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="relative z-10">
        {view === 'cart' ? (
          <CartPage 
            items={cart} 
            onUpdateQuantity={updateQuantity} 
            onRemove={removeItem} 
            onCheckout={() => setView('checkout')} 
            onContinueShopping={() => setView('store')} 
          />
        ) : view === 'checkout' ? (
          <CheckoutPage 
            total={cartTotal} 
            onBack={() => setView('cart')} 
            onOrderSubmit={handleOrderSubmit} 
          />
        ) : view === 'product' && selectedProduct ? (
          <ProductPage 
            product={selectedProduct} 
            onBack={() => { setView('store'); setSelectedProduct(null); }}
            onAddToCart={(size) => addToCart(selectedProduct, size)}
          />
        ) : (
          <>
            <Hero />
            
            <section id="shop" className="py-16 md:py-32 px-4 sm:px-6 max-w-7xl mx-auto relative">
              <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-20 gap-8">
                <div className="max-w-2xl reveal-up">
                  <p className="text-rose-500 font-black text-[10px] tracking-[0.4em] mb-4 uppercase">The Vision</p>
                  <h2 className="text-3xl md:text-6xl font-black italic tracking-tighter mb-4 md:mb-6 uppercase leading-none">Curated Silhouettes</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg font-light leading-relaxed">Technical innovation meets urban uniform. Every asset engineered for the modern nomad.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-12 gap-y-10 sm:gap-y-16">
                {products.map((item, idx) => (
                  <div 
                    key={item.id} 
                    className="group cursor-pointer reveal-up" 
                    onClick={() => { setSelectedProduct(item); setView('product'); }}
                  >
                    <div className="relative overflow-hidden mb-4 sm:mb-6 aspect-3/4 glass p-1 transition-all duration-700">
                      <img 
                        src={item.images[0]} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0" 
                      />
                      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-slate-950 dark:bg-white text-white dark:text-black px-2 sm:px-4 py-1 text-[8px] sm:text-[10px] font-black italic">
                        {item.price}
                      </div>
                    </div>
                    <p className="text-[7px] sm:text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1">{item.category}</p>
                    <h3 className="text-xs sm:text-lg font-black italic tracking-tight group-hover:text-rose-500 transition-colors uppercase leading-tight sm:leading-none">{item.title}</h3>
                  </div>
                ))}
              </div>
            </section>
            <section id="contact" className="py-16 md:py-32 px-4 sm:px-6 max-w-7xl mx-auto relative border-t border-slate-200 dark:border-white/5 mt-16 md:mt-32">
              <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
                <div className="flex-1 reveal-up">
                  <p className="text-rose-500 font-black text-[10px] tracking-[0.4em] mb-4 uppercase">Direct Link</p>
                  <h2 className="text-3xl md:text-6xl font-black italic tracking-tighter mb-6 uppercase leading-none">Initiate Contact</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg font-light leading-relaxed mb-8">
                    Have questions about the technical atelier or need support with your order? Our team is available 24/7.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                        <svg className="w-5 h-5 text-slate-950 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email</p>
                        <p className="text-sm font-bold mt-1">support@afsana.tech</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                        <svg className="w-5 h-5 text-slate-950 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Location</p>
                        <p className="text-sm font-bold mt-1">Cyber City, Neo Tokyo</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 glass p-8 sm:p-10 rounded-2xl border-rose-500/10 shadow-xl reveal-up">
                  <form className="flex flex-col gap-6" onSubmit={(e) => { e.preventDefault(); alert('Transmission Sent. We will contact you shortly.'); }}>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Subject Name</label>
                      <input type="text" required className="w-full bg-slate-100 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500 transition-colors" placeholder="ENTER NAME" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Comms Channel (Email)</label>
                      <input type="email" required className="w-full bg-slate-100 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500 transition-colors" placeholder="ENTER EMAIL" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Transmission Data</label>
                      <textarea required rows={4} className="w-full bg-slate-100 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500 transition-colors resize-none" placeholder="ENTER MESSAGE..."></textarea>
                    </div>
                    <button type="submit" className="w-full bg-rose-600 text-white font-black uppercase tracking-widest text-xs py-4 rounded-xl hover:bg-rose-700 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-rose-600/20 mt-2">
                      Transmit Message
                    </button>
                  </form>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {view === 'store' && (
        <div className="fixed bottom-[5%] right-10 text-[10vw] font-black italic text-slate-200 dark:text-white/5 pointer-events-none select-none z-0 hidden lg:block transition-colors duration-500">
          AFSANA
        </div>
      )}

      <Footer />
    </div>
  );
};

export default App;
