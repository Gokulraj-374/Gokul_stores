/* cspell:word Nagar */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, CartItem, Order, UserProfile, StoreSettings, Review } from './types';
import { categories as initialCategories, initialProducts } from './data';
import { db, auth } from './firebase';
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile as updateFirebaseProfile
} from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

interface AppContextType {
  categories: Category[];
  products: Product[];
  cartItems: CartItem[];
  orders: Order[];
  user: User | null;
  userProfile: UserProfile | null;
  isOnline: boolean;
  storeSettings: StoreSettings;
  isAdmin: boolean;
  loading: boolean;
  addToCart: (product: Product, quantity?: number) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  placeOrder: () => void;
  rateProduct: (productId: string, rating: number) => void;
  addReview: (productId: string, rating: number, comment: string, photos: string[]) => Promise<void>;
  uploadReviewPhoto: (file: File) => Promise<string>;
  uploadProductPhoto: (file: File) => Promise<string>;
  seedDatabase: () => Promise<void>;
  fixMissingImages: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  updateStoreSettings: (settings: StoreSettings) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  cartTotal: number;
  cartCount: number;
  toast: { message: string, type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Edit this list to grant admin access to specific emails
const ADMIN_EMAILS = ['manojponnaiyan151@gmail.com'];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [products, setProducts] = useState<Product[]>(initialProducts); 
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    storeName: 'Gokul Stores',
    storeTagline: 'Fresh Groceries • Vegetables',
    mainPhone: '+91 75503 89202',
    secondaryPhone: '+91 93617 00374',
    address: 'Gokul Stores, 123 Main Street, Gandhi Nagar, Delhi - 110031',
    mapsUrl: 'https://maps.app.goo.gl/xGuTtQnL5DhKV5ga9',
    hoursMondaySunday: '6:00 AM - 10:00 PM'
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Added to wishlist', 'success');
        return [...prev, productId];
      }
    });
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const isAdmin = user ? ADMIN_EMAILS.includes(user.email || '') : false;

  useEffect(() => {
  
    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      // Clean up previous profile listener if exists
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      setUser(currentUser);
      
      if (currentUser) {
        unsubscribeProfile = onSnapshot(doc(db, 'profiles', currentUser.uid), (snapshot) => {
          if (snapshot.exists()) {
            setUserProfile(snapshot.data() as UserProfile);
          } else {
            const newProfile: UserProfile = {
              uid: currentUser.uid,
              name: currentUser.displayName || '',
              email: currentUser.email || '',
              phone: '',
              address: ''
            };
            setDoc(doc(db, 'profiles', currentUser.uid), newProfile).catch(err => {
              console.error("Failed to create initial profile:", err);
            });
            setUserProfile(newProfile);
          }
          setLoading(false);
        }, (error) => {
          console.error("Profile synchronization error:", error);
          setLoading(false);
        });
      } else {
        setUserProfile(null);
      }
    });

    const unsubscribeCategories = onSnapshot(collection(db, 'categories'), (snapshot) => {
      const categoriesData: Category[] = [];
      snapshot.forEach((doc) => {
        categoriesData.push(doc.data() as Category);
      });
      if (categoriesData.length > 0) {
        setCategories(categoriesData);
      }
    });

    const unsubscribeProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      const productsData: Product[] = [];
      snapshot.forEach((doc) => {
        productsData.push(doc.data() as Product);
      });
      if (productsData.length > 0) {
        setProducts(productsData);
      }
    });

    const unsubscribeOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const ordersData: Order[] = [];
      snapshot.forEach((doc) => {
        ordersData.push(doc.data() as Order);
      });
      ordersData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setOrders(ordersData);
    });

    const unsubscribeSettings = onSnapshot(doc(db, 'settings', 'store'), (snapshot) => {
      if (snapshot.exists()) {
        setStoreSettings(snapshot.data() as StoreSettings);
      }
    });

    const handleOnline = () => {
      setIsOnline(true);
      showToast('Back online! Connection restored.', 'success');
    };
    const handleOffline = () => {
      setIsOnline(false);
      showToast('Connection lost. Please check your internet.', 'error');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
      unsubscribeCategories();
      unsubscribeProducts();
      unsubscribeOrders();
      unsubscribeSettings();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signInWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      if (result.user) {
        await updateFirebaseProfile(result.user, { displayName: name });
        const newProfile: UserProfile = {
          uid: result.user.uid,
          name: name,
          email: email,
          phone: '',
          address: ''
        };
        await setDoc(doc(db, 'profiles', result.user.uid), newProfile);
        setUserProfile(newProfile);
      }
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

   const updateProfile = async (updates: Partial<UserProfile>) => {
     if (!user) throw new Error('No user logged in');
     const currentProfile = userProfile || { uid: user.uid, name: user.displayName || '', email: user.email || '', phone: '', address: '' };
     const newProfile = { ...currentProfile, ...updates } as UserProfile;

     // Update local state immediately for better UX
     setUserProfile(newProfile);

     try {
       // Save to Firestore
       await setDoc(doc(db, 'profiles', user.uid), newProfile, { merge: true });
     } catch (error) {
       console.error("Failed to sync profile to Firestore:", error);
       throw error;
     }
   };

  const updateStoreSettings = async (settings: StoreSettings) => {
    setStoreSettings(settings);
    await setDoc(doc(db, 'settings', 'store'), settings);
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    // Inventory check
    if (product.stock <= 0) {
      showToast('Sorry, this item is out of stock', 'error');
      return;
    }

    setCartItems(prev => {
      const existing = prev.find(p => p.id === product.id);
      const currentQuantity = existing ? existing.quantity : 0;
      
      if (currentQuantity + quantity > product.stock) {
        showToast(`Only ${product.stock} units available in stock`, 'info');
        return prev;
      }

      if (existing) {
        return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + quantity } : p);
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const updateCartItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev => prev.map(p => p.id === productId ? { ...p, quantity } : p));
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(p => p.id !== productId));
  };

  const addProduct = async (product: Product) => {
    await setDoc(doc(db, 'products', product.id), product);
  };

  const updateProduct = async (product: Product) => {
    await setDoc(doc(db, 'products', product.id), product);
  };

  const deleteProduct = async (productId: string) => {
    await deleteDoc(doc(db, 'products', productId));
    showToast('Product deleted successfully');
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    await updateDoc(doc(db, 'orders', orderId), { status });
  };

  const placeOrder = async () => {
    if (cartItems.length === 0) return;
    const newOrder: Order = {
      id: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      items: [...cartItems],
      total: cartTotal,
      status: 'placed',
      date: new Date().toISOString()
    };
    
    try {
      // 1. Create the order
      await setDoc(doc(db, 'orders', newOrder.id), newOrder);
      
      // 2. Decrement stock for each item
      for (const item of cartItems) {
        const productRef = doc(db, 'products', item.id);
        const newStock = Math.max(0, item.stock - item.quantity);
        await updateDoc(productRef, { 
          stock: newStock,
          in_stock: newStock > 0 
        });
      }

      setCartItems([]);
      showToast('Order placed successfully!', 'success');
    } catch (error) {
      console.error("Order placement failed:", error);
      showToast('Failed to place order. Please try again.', 'error');
    }
  };

  const rateProduct = async (productId: string, rating: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const newRating: Review = {
      id: `REV-${Date.now()}`,
      productId,
      userId: user?.uid || 'anonymous',
      userName: userProfile?.name || user?.displayName || 'Anonymous',
      rating,
      comment: '',
      photos: [],
      date: new Date().toISOString()
    };

    const updatedReviews = [...(product.reviews || []), newRating];
    await updateDoc(doc(db, 'products', productId), { reviews: updatedReviews });
  };

  const addReview = async (productId: string, rating: number, comment: string, photos: string[]) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    if (!user) throw new Error("Must be logged in to leave a review");

    const newReview: Review = {
      id: `REV-${Date.now()}`,
      productId,
      userId: user.uid,
      userName: userProfile?.name || user.displayName || 'Anonymous',
      rating,
      comment,
      photos,
      date: new Date().toISOString()
    };

    const updatedReviews = [...(product.reviews || []), newReview];
    await updateDoc(doc(db, 'products', productId), { reviews: updatedReviews });
  };

  const uploadReviewPhoto = async (file: File): Promise<string> => {
    const storageRef = ref(storage, `reviews/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const uploadProductPhoto = async (file: File): Promise<string> => {
    const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const seedDatabase = async () => {
    for (const cat of initialCategories) {
      await setDoc(doc(db, 'categories', cat.id), cat);
    }
    for (const prod of initialProducts) {
      await setDoc(doc(db, 'products', prod.id), prod);
    }
    showToast('Database seeded successfully!');
  };

  const fixMissingImages = async () => {
    const updatedProducts = products.map(prod => {
      const name = prod.name.toLowerCase();
      
      let newUrl = prod.image_url;
      // High-accuracy professional mapping
      if (name.includes('lays classic')) newUrl = 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&q=80&w=600';
      else if (name.includes('lays masala') || name.includes('magic masala')) newUrl = 'https://images.unsplash.com/photo-1621447509374-f20387401c9b?auto=format&fit=crop&q=80&w=600';
      else if (name.includes('kurkure')) newUrl = 'https://images.unsplash.com/photo-1600359756133-1ec626572714?auto=format&fit=crop&q=80&w=600';
      else if (name.includes('haldiram')) newUrl = 'https://images.unsplash.com/photo-1626082896492-766af4eb6501?auto=format&fit=crop&q=80&w=600';
      else if (name.includes('marie gold')) newUrl = 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=600';
      else if (name.includes('oreo')) newUrl = 'https://images.unsplash.com/photo-1540331031772-bf933c077d71?auto=format&fit=crop&q=80&w=600';
      else if (name.includes('parle-g')) newUrl = 'https://images.unsplash.com/photo-1622728448386-896865668d27?auto=format&fit=crop&q=80&w=600';
      else if (name.includes('dairy milk')) newUrl = 'https://images.unsplash.com/photo-1623126908029-58cb08a2b272?auto=format&fit=crop&q=80&w=600';
      else if (name.includes('kitkat')) newUrl = 'https://images.unsplash.com/photo-1517060195029-e8853622ee89?auto=format&fit=crop&q=80&w=600';
      else if (name.includes('munch')) newUrl = 'https://images.unsplash.com/photo-1526344966-89049886b28d?auto=format&fit=crop&q=80&w=600';
      else if (name.includes('rice')) newUrl = 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600';
      else if (name.includes('flour')) newUrl = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600';
      else if (name.includes('dal')) newUrl = 'https://images.unsplash.com/photo-1585933228913-da9895006d6b?auto=format&fit=crop&q=80&w=600';
      else if (name.includes('sugar')) newUrl = 'https://images.unsplash.com/photo-1626844131082-256783844137?auto=format&fit=crop&q=80&w=600';
      else if (name.includes('salt')) newUrl = 'https://images.unsplash.com/photo-1518110903958-ed4fc9211c2f?auto=format&fit=crop&q=80&w=600';
      else if (name.includes('oil')) newUrl = 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=600';
      else if (name.includes('ghee')) newUrl = 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&q=80&w=600';
      else if (name.includes('turmeric')) newUrl = 'https://images.unsplash.com/photo-1615485499763-71887e1f4ede?auto=format&fit=crop&q=80&w=600';
      else if (name.includes('chilli powder')) newUrl = 'https://images.unsplash.com/photo-1599940824399-b87987cb36a5?auto=format&fit=crop&q=80&w=600';
      else if (name.includes('cola') || name.includes('pepsi')) newUrl = 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=600';
      else if (name.includes('sprite')) newUrl = 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&q=80&w=600';
      else if (name.includes('milk')) newUrl = 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=600';
      else if (name.includes('water')) newUrl = 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&q=80&w=600';
      else if (name.includes('potato')) newUrl = '/potato.png';
      else if (name.includes('tomato')) newUrl = 'https://images.unsplash.com/photo-1596460117916-f3066202e0c9?auto=format&fit=crop&q=80&w=600';
      else if (name.includes('onion')) newUrl = 'https://images.unsplash.com/photo-1508747703725-7197771375a0?auto=format&fit=crop&q=80&w=600';
      else if (name.includes('carrot')) newUrl = 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=600';
      else if (name.includes('green chilli')) newUrl = '/green_chilli.png';
      
      if (newUrl !== prod.image_url) {
        return { ...prod, image_url: newUrl };
      }
      return null;
    }).filter(p => p !== null) as Product[];

    if (updatedProducts.length === 0) {
      showToast('No missing images found!', 'info');
      return;
    }

    for (const p of updatedProducts) {
      await updateDoc(doc(db, 'products', p.id), { image_url: p.image_url });
    }
    showToast(`Updated ${updatedProducts.length} product images!`);
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <AppContext.Provider value={{
      categories,
      products,
      cartItems,
      orders,
      user,
      userProfile,
      storeSettings,
      isAdmin,
      isOnline,
      loading,
      addToCart,
      updateCartItemQuantity,
      removeFromCart,
      addProduct,
      updateProduct,
      deleteProduct,
      updateOrderStatus,
      placeOrder,
      rateProduct,
      addReview,
      uploadReviewPhoto,
      uploadProductPhoto,
      seedDatabase,
      fixMissingImages,
      updateProfile,
      updateStoreSettings,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      resetPassword,
      signOut,
      cartTotal,
      cartCount,
      toast,
      showToast,
      wishlist,
      toggleWishlist
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
};
