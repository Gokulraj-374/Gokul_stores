/* cspell:word Gokul Nagar, beforeinstallprompt, firebasestorage, firestore, mobilesdk, appinvite, onroad, onroadbreakdown */
import React, { useState, useEffect } from 'react';
import { AppProvider, useAppStore } from './store';
import { 
  Home, ShoppingBag, ShoppingCart, Phone, Settings, 
  Leaf, Truck, ShieldCheck, ChevronDown, ChevronUp, 
  Plus, Minus, Trash2, MapPin, Clock, 
  Image as ImageIcon, X, MessageCircle, Coffee, 
  ShoppingBasket, GlassWater, Cookie, Search, 
  ClipboardList, Calendar, Star, Pencil, Sparkles, Share2,
  User as UserIcon, LogOut, LogIn, Loader2, Mail, Lock, Eye, EyeOff,
  CheckCircle, AlertCircle, Heart, WifiOff, FileDown
} from 'lucide-react';
import { Product } from './types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'Cookie': return Cookie;
    case 'Coffee': return Coffee;
    case 'ShoppingBasket': return ShoppingBasket;
    case 'CupSoda': return GlassWater;
    case 'Leaf': return Leaf;
    default: return ShoppingBag;
  }
};

const sanitizeUnsplashUrl = (url: string) => {
  if (!url) return url;

  // If it's a direct Unsplash CDN link, ensure it has optimization params
  if (url.includes('images.unsplash.com')) {
    const baseUrl = url.split('?')[0];
    return `${baseUrl}?auto=format&fit=crop&q=80&w=600`;
  }

  return url;
};

const getImageUrl = (url: string, categoryName: string, productName: string = '') => {
  if (url && url.startsWith('http')) {
    // Optimize Unsplash URLs if they don't already have parameters
    if (url.includes('images.unsplash.com') && !url.includes('?')) {
      return `${url}?auto=format&fit=crop&q=80&w=600`;
    }
    // Handle Unsplash source/photo URLs that might be missing params
    if (url.includes('unsplash.com') && !url.includes('auto=format')) {
      if (!url.includes('?')) return `${url}?auto=format&fit=crop&q=80&w=600`;
      return `${url}&auto=format&fit=crop&q=80&w=600`;
    }
    return url;
  }
  if (url && url.startsWith('/')) return url; // Local assets
  
  // High-quality fallbacks based on product name/category
  const name = (productName || '').toLowerCase();
  const cat = (categoryName || '').toLowerCase();
  
  // Keyword mapping for common products
  if (name.includes('lays') || name.includes('chips')) return 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&q=80&w=600';
  if (name.includes('kurkure')) return 'https://images.unsplash.com/photo-1600359756133-1ec626572714?auto=format&fit=crop&q=80&w=600';
  if (name.includes('milk')) return 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=600';
  if (name.includes('juice') || name.includes('maaza') || name.includes('tropicana')) return 'https://images.unsplash.com/photo-1621506289937-4c721a931791?auto=format&fit=crop&q=80&w=600';
  if (name.includes('cola') || name.includes('pepsi') || name.includes('drink')) return 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=600';
  if (name.includes('chocolate') || name.includes('dairy milk') || name.includes('silk')) return 'https://images.unsplash.com/photo-1623126908029-58cb08a2b272?auto=format&fit=crop&q=80&w=600';
  if (name.includes('rice')) return 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600';
  if (name.includes('water')) return 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&q=80&w=600';
  if (name.includes('potato')) return 'https://images.unsplash.com/photo-1518977676601-b53f02ac6d31?auto=format&fit=crop&q=80&w=600';
  if (name.includes('tomato')) return 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=600';
  if (name.includes('onion')) return 'https://images.unsplash.com/photo-1508747703725-7197771375a0?auto=format&fit=crop&q=80&w=600';
  if (name.includes('carrot')) return 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=600';
  if (name.includes('biscuit') || name.includes('cookie') || name.includes('oreo')) return 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=600';
  
  // Category fallbacks
  if (cat.includes('vegetable')) return 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600';
  if (cat.includes('snack')) return 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&q=80&w=600';
  if (cat.includes('drink') || cat.includes('bev')) return 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&q=80&w=600';
  if (cat.includes('grocer')) return 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600';

  const seed = (url || '').replace('IMAGE:', '');
  const placeholderText = productName || categoryName || 'product';
  return `https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600`; // High-quality store fallback
  // return `https://picsum.photos/seed/${seed || placeholderText}/600/600`;
};

const FeatureItem = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
  <div className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
    {icon}
    <span className="ml-3 font-medium text-gray-800">{text}</span>
  </div>
);

const StarRating = ({ product, onRate }: { product: Product, onRate: (rating: number) => void }) => {
  const reviews = product.reviews || [];
  const average = reviews.length > 0 ? reviews.reduce((a, b) => a + b.rating, 0) / reviews.length : 0;
  const [hoveredStar, setHoveredStar] = useState(0);

  return (
    <div className="flex items-center gap-1 mb-2">
      <div className="flex">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            onClick={() => onRate(star)}
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
            className="focus:outline-none p-0.5"
          >
            <Star 
              size={14} 
              className={`${
                star <= (hoveredStar || average) 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'text-gray-300'
              } transition-colors`} 
            />
          </button>
        ))}
      </div>
      <span className="text-xs text-gray-500 ml-1">
        {reviews.length > 0 ? `(${average.toFixed(1)})` : '(New)'}
      </span>
    </div>
  );
};

const RelatedProducts = ({ currentProductId, categoryId, categoryName }: { currentProductId: string, categoryId: string, categoryName: string }) => {
  const { products } = useAppStore();
  const related = products
    .filter(p => p.category_id === categoryId && p.id !== currentProductId)
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-1">
        <Sparkles size={10} className="text-emerald-500" /> Related items
      </p>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {related.map(p => (
          <div key={p.id} className="flex-none w-16 group cursor-pointer">
            <div className="h-16 rounded-lg overflow-hidden border border-gray-100 mb-1 group-hover:border-emerald-200 transition-colors">
              <img 
                src={getImageUrl(p.image_url, categoryName, p.name)} 
                alt={p.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform" 
              />
            </div>
            <p className="text-[8px] font-bold text-gray-600 truncate">{p.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProductCard = ({ product, categoryName, onEdit }: { product: Product, categoryName: string, onEdit?: (product: Product) => void, key?: React.Key }) => {
  const { addToCart, rateProduct, wishlist, toggleWishlist } = useAppStore();
  const [quantity, setQuantity] = useState(1);
  const [showRelated, setShowRelated] = useState(false);
  
  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuantity(1);
    showToast(`Added ${product.name} to cart!`, 'success');
  };

  const { showToast } = useAppStore();

  const [showReviews, setShowReviews] = useState(false);

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col relative group/card">
      <div className="h-32 bg-gray-100 relative overflow-hidden">
        <img 
          src={getImageUrl(product.image_url, categoryName, product.name)} 
          alt={product.name}
          className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
          referrerPolicy="no-referrer"
          loading="lazy"
          decoding="async"
        />
        {product.in_stock === false && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-2">
            <div className="bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg border border-rose-400 animate-pulse">
              Out of Stock
            </div>
          </div>
        )}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <button
             onClick={() => toggleWishlist(product.id)}
             className={`p-1.5 rounded-full shadow-sm transition-all ${
               wishlist.includes(product.id) 
                 ? 'bg-rose-500 text-white scale-110' 
                 : 'bg-white/90 text-gray-600 hover:text-rose-500 hover:bg-white'
             }`}
          >
            <Heart size={14} fill={wishlist.includes(product.id) ? "currentColor" : "none"} />
          </button>

          {onEdit && (
            <button
              onClick={() => onEdit(product)}
              className="bg-white/90 p-1.5 rounded-full text-gray-600 hover:text-emerald-600 hover:bg-white shadow-sm transition-colors"
            >
              <Pencil size={14} />
            </button>
          )}
        </div>
        
        <button 
          onClick={() => setShowRelated(!showRelated)}
          className="absolute bottom-2 left-2 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white p-1 rounded-md transition-all opacity-0 group-hover/card:opacity-100"
          title="See Related"
        >
          <Sparkles size={12} />
        </button>
      </div>
      <div className="p-3 flex flex-col grow">
        <h4 className="font-bold text-sm text-gray-800 mb-1 line-clamp-2">{product.name}</h4>
        <div className="flex items-center justify-between">
          <StarRating product={product} onRate={(rating) => rateProduct(product.id, rating)} />
          <button 
            onClick={() => setShowReviews(true)}
            className="text-[10px] text-emerald-600 font-bold hover:underline"
          >
            {product.reviews?.length || 0} reviews
          </button>
        </div>
        <div className="text-lg font-bold text-emerald-600 mb-2 mt-auto">₹{product.price}</div>
        
        <div className="flex items-center justify-between mb-3 bg-gray-50 rounded-lg p-1 border border-gray-100">
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-white rounded-md transition-colors"
          >
            <Minus size={16} />
          </button>
          <span className="font-bold text-gray-800">{quantity}</span>
          <button 
            onClick={() => setQuantity(quantity + 1)}
            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-white rounded-md transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>

        <button 
          onClick={handleAddToCart}
          disabled={product.in_stock === false}
          className={`w-full py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            product.in_stock === false 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
              : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm active:scale-95'
          }`}
        >
          <ShoppingCart size={16} /> {product.in_stock === false ? 'Out of Stock' : 'Add'}
        </button>

        {showRelated && (
          <RelatedProducts 
            currentProductId={product.id} 
            categoryId={product.category_id} 
            categoryName={categoryName} 
          />
        )}
      </div>

      {showReviews && (
        <ReviewModal 
          product={product} 
          onClose={() => setShowReviews(false)} 
        />
      )}
    </div>
  );
};

const ReviewModal = ({ product, onClose }: { product: Product, onClose: () => void }) => {
  const { user, addReview, uploadReviewPhoto, userProfile, showToast } = useAppStore();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const reviews = product.reviews || [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files as FileList);
      setFiles(prev => [...prev, ...selectedFiles]);
      
      selectedFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return showToast('Please login to leave a review', 'error');
    if (rating === 0) return showToast('Please select a rating', 'error');

    setIsSubmitting(true);
    setIsUploading(true);

    try {
      const photoUrls: string[] = [];
      for (const file of files) {
        const url = await uploadReviewPhoto(file);
        photoUrls.push(url);
      }
      setIsUploading(false);

      await addReview(product.id, rating, comment, photoUrls);
      onClose();
    } catch (err) {
      showToast('Failed to submit review', 'error');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-60 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="p-5 border-b flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
            <p className="text-sm text-gray-500">Customer Reviews ({reviews.length})</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto grow p-5 space-y-6">
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Sparkles size={40} className="mx-auto mb-2 opacity-20" />
                <p>Be the first to review this product!</p>
              </div>
            ) : (
              reviews.map(review => (
                <div key={review.id} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-gray-900 text-sm">{review.userName}</span>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} size={10} className={s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-700 mb-3">{review.comment}</p>
                  {review.photos && review.photos.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                      {review.photos.map((photo, i) => (
                        <img key={i} src={photo} className="w-20 h-20 rounded-lg object-cover bg-white shadow-sm border border-gray-100 flex-none" />
                      ))}
                    </div>
                  )}
                  <span className="text-[9px] text-gray-400 mt-2 block">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>

          {user && (
            <form onSubmit={handleSubmit} className="border-t pt-6 space-y-4">
              <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <Pencil size={18} className="text-emerald-600" /> Leave a Review
              </h4>
              
              <div className="flex gap-2">
                {[1,2,3,4,5].map(s => (
                  <button 
                    key={s} 
                    type="button" 
                    onClick={() => setRating(s)}
                    className="focus:outline-none transform active:scale-90 transition-transform"
                  >
                    <Star size={32} className={s <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} />
                  </button>
                ))}
              </div>

              <textarea 
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Share your experience with this product..."
                className="w-full border rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-gray-50 h-24 resize-none"
                required
              />

              <div className="space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs text-gray-700">
                  <ImageIcon size={14} className="text-emerald-600" /> Add Photos
                </div>
                <div className="flex flex-wrap gap-2">
                  {previews.map((preview, i) => (
                    <div key={i} className="relative w-16 h-16">
                      <img src={preview} className="w-full h-full object-cover rounded-xl shadow-sm border" />
                      <button 
                        type="button"
                        onClick={() => removeFile(i)}
                        className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 shadow-md hover:bg-red-600"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <label className="w-16 h-16 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-emerald-300 hover:bg-emerald-50 transition-all text-gray-400">
                    <Plus size={20} />
                    <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-700 transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    {isUploading ? 'Uploading Photos...' : 'Saving Review...'}
                  </>
                ) : 'Submit Review'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const Toast = () => {
  const { toast } = useAppStore();
  if (!toast) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-100 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className={`px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border ${
        toast.type === 'error' ? 'bg-red-50 border-red-100 text-red-800' : 
        toast.type === 'info' ? 'bg-blue-50 border-blue-100 text-blue-800' :
        'bg-emerald-50 border-emerald-100 text-emerald-800'
      }`}>
        {toast.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
        <span className="font-bold text-sm tracking-tight">{toast.message}</span>
      </div>
    </div>
  );
};

const ProductSkeleton = () => (
  <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col animate-pulse">
    <div className="h-32 bg-gray-200" />
    <div className="p-3 flex flex-col grow gap-2">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
      <div className="h-6 bg-gray-200 rounded w-1/3 mt-auto" />
      <div className="h-8 bg-gray-200 rounded w-full mt-2" />
    </div>
  </div>
);

const CategorySplashCard = ({ title, subtitle, image, color, textColor, onClick, colSpan = 1 }: { title: string, subtitle: string, image: string, color: string, textColor: string, onClick: () => void, colSpan?: number }) => (
  <button 
    onClick={onClick}
    className={`relative overflow-hidden rounded-4xl p-5 sm:p-6 text-left group transition-all duration-500 hover:shadow-lg hover:-translate-y-1 active:scale-95 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ${colSpan === 2 ? 'col-span-2 h-44 sm:h-48' : 'col-span-1 h-56 sm:h-64'}`}
    style={{ background: color }}
  >
    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-white/60 via-transparent to-transparent opacity-60"></div>
    
    <div className={`relative z-10 flex h-full ${colSpan === 2 ? 'flex-row items-center justify-between' : 'flex-col justify-between'}`}>
      <div className={colSpan === 2 ? 'w-1/2 xs:w-3/5 pr-2' : 'w-full'}>
        <h4 className={`text-xl xs:text-2xl sm:text-3xl font-black uppercase tracking-tighter italic leading-none mb-1 drop-shadow-sm ${textColor}`}>{title}</h4>
        <p className={`text-[9px] xs:text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-3 sm:mb-4 opacity-80 ${textColor}`}>{subtitle}</p>
        
        <div className={`inline-flex items-center gap-1.5 sm:gap-2 bg-white/70 backdrop-blur-md text-[9px] sm:text-[10px] font-black px-3 sm:px-4 py-1.5 sm:py-2 rounded-full uppercase tracking-widest border border-white shadow-sm transition-all group-hover:bg-white group-hover:shadow-md ${textColor} ${colSpan === 2 ? '' : 'mt-auto'}`}>
          Shop Now
        </div>
      </div>
    </div>
    
    <img 
      src={image} 
      alt={title} 
      className={`absolute pointer-events-none mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-105 group-hover:-rotate-3 object-contain ${
        colSpan === 2 
          ? 'w-44 sm:w-56 max-w-[55%] right-[-10px] bottom-[-10px] sm:right-2 sm:bottom-[-10px]' 
          : 'w-44 sm:w-52 max-w-[90%] right-[-20px] bottom-[-10px] sm:right-[-10px] sm:bottom-[-10px]'
      }`}
    />
  </button>
);

const CategoryIntro = ({ navigate }: { navigate: (page: string, params?: any) => void }) => {
  return (
    <div className="px-4 sm:px-6 mb-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 shadow-inner">
          <Sparkles size={20} />
        </div>
        <h3 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tighter italic">Categories</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <CategorySplashCard 
          title="Groceries" 
          subtitle="Daily Kitchen Staples" 
          image="/splash_groceries.png"
          color="linear-gradient(135deg, #f0fdf4 0%, #d1fae5 100%)"
          textColor="text-emerald-900"
          onClick={() => navigate('products', { categoryId: '3' })}
          colSpan={2}
        />
        <CategorySplashCard 
          title="Snacks" 
          subtitle="Treat Yourself" 
          image="/splash_snacks.png"
          color="linear-gradient(135deg, #fffbeb 0%, #fef08a 100%)"
          textColor="text-amber-900"
          onClick={() => navigate('products', { categoryId: '1' })}
        />
        <CategorySplashCard 
          title="Juice" 
          subtitle="Pure Refreshment" 
          image="/splash_juice.png"
          color="linear-gradient(135deg, #fdf2f8 0%, #fbcfe8 100%)"
          textColor="text-pink-900"
          onClick={() => navigate('products', { categoryId: '4' })}
        />
        <CategorySplashCard 
          title="Vegetables" 
          subtitle="Organic & Fresh" 
          image="/splash_vegetables.png"
          color="linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)"
          textColor="text-teal-900"
          onClick={() => navigate('products', { categoryId: '5' })}
          colSpan={2}
        />
      </div>
    </div>
  );
};

const HomeScreen = ({ navigate, installPrompt, onInstall }: { navigate: (page: string, params?: any) => void, installPrompt: any, onInstall: () => void }) => {
  const { categories, storeSettings } = useAppStore();
  
  return (
    <div className="pb-24">
      {/* Welcome Section */}
      <div className="p-6 text-center pt-8 bg-white">
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-2 tracking-tighter uppercase italic leading-none">
          {(() => {
            const words = storeSettings.storeName.split(' ');
            if (words.length > 1) {
              return <>{words[0]} <span className="text-emerald-600">{words.slice(1).join(' ')}</span></>;
            }
            return words[0];
          })()}
        </h1>
        <p className="text-gray-400 mb-8 font-semibold text-xs uppercase tracking-widest">{storeSettings.storeTagline}</p>
        
        {/* Main Banner */}
        <div className="relative group px-2 max-w-xl mx-auto">
          <div className="overflow-hidden rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.12)] border-2 border-white transition-all duration-700 group-hover:shadow-[0_35px_70px_rgba(5,150,105,0.2)]">
            <img 
              src="/banner.png" 
              alt="Fresh Groceries & Vegetables" 
              className="w-full h-48 sm:h-56 object-cover transition-transform duration-[2s] group-hover:scale-110"
            />
          </div>
          <div className="absolute inset-0 rounded-3xl ring-1 ring-black/5 pointer-events-none"></div>
        </div>
      </div>

      <CategoryIntro navigate={navigate} />

    </div>
  );
};

const ProductsScreen = ({ initialCategoryId, searchQuery }: { initialCategoryId?: string, searchQuery?: string }) => {
  const { user, isAdmin, storeSettings, updateStoreSettings, products, categories, updateProduct, orders, updateOrderStatus, showToast } = useAppStore();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    [initialCategoryId || categories[0]?.id]: true
  });
  const [itemsPerPage, setItemsPerPage] = useState<Record<string, number>>({});
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    if (products.length > 0) {
      const timer = setTimeout(() => setIsFirstLoad(false), 500);
      return () => clearTimeout(timer);
    }
  }, [products]);

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const loadMore = (id: string) => {
    setItemsPerPage(prev => ({ ...prev, [id]: (prev[id] || 8) + 8 }));
  };

  const filteredProducts = searchQuery 
    ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : products;

  return (
    <div className="pb-24 p-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Our Products</h2>
      
      {searchQuery && filteredProducts.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <p className="text-lg">No products found matching "{searchQuery}"</p>
        </div>
      )}

      {categories.map(category => {
        const categoryProducts = filteredProducts.filter(p => p.category_id === category.id);
        if (categoryProducts.length === 0) return null;
        
        const isExpanded = searchQuery ? true : expandedSections[category.id];
        const limit = itemsPerPage[category.id] || 8;
        const visibleProducts = categoryProducts.slice(0, limit);
        const hasMore = categoryProducts.length > limit;
        const Icon = getCategoryIcon(category.icon);

        return (
          <div key={category.id} className="mb-4 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <button 
              onClick={() => toggleSection(category.id)}
              className="w-full bg-emerald-600 p-4 flex items-center justify-between text-white"
            >
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <Icon size={24} />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-lg">{category.name}</h3>
                  <p className="text-emerald-100 text-sm">{categoryProducts.length} items</p>
                </div>
              </div>
              {isExpanded ? <ChevronUp size={28} /> : <ChevronDown size={28} />}
            </button>
            
            {isExpanded && (
              <div className="p-4 bg-gray-50">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {isFirstLoad && products.length === 0 ? (
                    Array(4).fill(0).map((_, i) => <ProductSkeleton key={i} />)
                  ) : (
                    visibleProducts.map(product => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        categoryName={category.name} 
                        onEdit={isAdmin ? (p) => { setEditingProduct(p); setIsModalOpen(true); } : undefined}
                      />
                    ))
                  )}
                </div>
                
                {hasMore && (
                  <button 
                    onClick={() => loadMore(category.id)}
                    className="w-full mt-4 bg-emerald-100 text-emerald-700 py-3 rounded-xl font-bold hover:bg-emerald-200 transition-colors"
                  >
                    Load More
                  </button>
                )}
                <p className="text-center text-gray-500 text-sm mt-3">
                  Showing {visibleProducts.length} of {categoryProducts.length}
                </p>
              </div>
            )}
          </div>
        );
      })}

      {isModalOpen && editingProduct && (
        <ProductModal 
          initialProduct={editingProduct}
          onClose={() => { setIsModalOpen(false); setEditingProduct(undefined); }} 
          onSave={(p) => { 
            updateProduct(p); 
            setIsModalOpen(false); 
            setEditingProduct(undefined);
          }} 
        />
      )}
    </div>
  );
};

const CartScreen = ({ navigate }: { navigate: (page: string) => void }) => {
  const { cartItems, updateCartItemQuantity, removeFromCart, cartTotal, placeOrder, userProfile, storeSettings } = useAppStore();

  const handleWhatsAppOrder = () => {
    if (cartItems.length === 0) return;
    
    let message = `Hello Gokul Stores!%0A%0A`;
    
    if (userProfile && userProfile.name) {
      message += `*Customer:* ${userProfile.name}%0A`;
      if (userProfile.phone) message += `*Phone:* ${userProfile.phone}%0A`;
      if (userProfile.address) message += `*Address:* ${userProfile.address}%0A`;
      message += `%0A`;
    }

    message += `I would like to order:%0A%0A`;
    cartItems.forEach(item => {
      message += `• ${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}%0A`;
    });
    message += `%0ATotal: ₹${cartTotal}%0A%0APlease confirm availability and delivery time. Thank you!`;
    
    const whatsappPhone = storeSettings.mainPhone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${whatsappPhone}?text=${message}`, '_blank');
    
    placeOrder();
    navigate('orders');
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-gray-500">
        <ShoppingCart size={80} className="mb-4 opacity-50" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p>Add some items to get started!</p>
      </div>
    );
  }

  return (
    <div className="pb-24 p-4 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Shopping Cart</h2>
      
      <div className="space-y-4">
        {cartItems.map(item => (
          <div key={item.id} className="flex flex-col sm:flex-row sm:items-center bg-white p-3 rounded-xl shadow-sm border border-gray-100 gap-3">
            <img
              src={getImageUrl(item.image_url, item.category_name, item.name)} 
              alt={item.name} 
              className="w-16 h-16 rounded-lg object-cover bg-gray-100 sm:mr-4"
              referrerPolicy="no-referrer"
            />
            <div className="grow">
              <h4 className="font-bold text-gray-800">{item.name}</h4>
              <div className="text-emerald-600 font-medium mb-2">₹{item.price}</div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 text-gray-700"
                >
                  <Minus size={16} />
                </button>
                <span className="font-bold w-4 text-center">{item.quantity}</span>
                <button 
                  onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center hover:bg-emerald-700 text-white"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 sm:gap-1 ml-0 sm:ml-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-50 w-full sm:w-auto">
              <div className="font-bold text-lg text-gray-900">₹{item.price * item.quantity}</div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:text-red-700 p-2 sm:p-2.5 bg-red-50 sm:bg-transparent hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center"
                title="Delete item"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
        <span className="text-xl font-bold text-gray-800">Total Amount:</span>
        <span className="text-3xl font-bold text-emerald-600">₹{cartTotal}</span>
      </div>

      <button 
        onClick={handleWhatsAppOrder}
        className="w-full mt-6 bg-[#25D366] text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-colors shadow-lg shadow-green-200"
      >
        <MessageCircle size={24} /> Order via WhatsApp
      </button>
    </div>
  );
};

const ContactScreen = () => {
  const { storeSettings } = useAppStore();

  return (
    <div className="pb-24 p-4 max-w-md mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Contact Us</h2>
      
      <img 
        src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400" 
        alt="Shop Owner" 
        className="w-32 h-32 rounded-full object-cover mx-auto mb-8 shadow-md border-4 border-white"
      />

      <div className="space-y-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
            <Phone size={28} />
          </div>
          <div className="grow">
            <p className="text-sm text-gray-500 mb-1">Main Phone</p>
            <p className="font-bold text-gray-900">{storeSettings.mainPhone}</p>
          </div>
          <a 
            href={`tel:${storeSettings.mainPhone.replace(/\s+/g, '')}`}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700"
          >
            Call
          </a>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
            <Phone size={28} />
          </div>
          <div className="grow">
            <p className="text-sm text-gray-500 mb-1">Secondary Phone</p>
            <p className="font-bold text-gray-900">{storeSettings.secondaryPhone}</p>
          </div>
          <a 
            href={`tel:${storeSettings.secondaryPhone.replace(/\s+/g, '')}`}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700"
          >
            Call
          </a>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
            <MapPin size={28} />
          </div>
          <div className="grow">
            <p className="text-sm text-gray-500 mb-1">Address</p>
            <p className="font-bold text-gray-900 text-sm">{storeSettings.address}</p>
          </div>
          <a 
            href={storeSettings.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 whitespace-nowrap"
          >
            Open Maps
          </a>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
            <Clock size={28} />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Store Hours</p>
            <p className="font-bold text-gray-900">Monday - Sunday</p>
            <p className="font-bold text-gray-900">{storeSettings.hoursMondaySunday}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductModal = ({ onClose, onSave, initialProduct }: { onClose: () => void, onSave: (p: Product) => void, initialProduct?: Product }) => {
  const { categories, showToast, uploadProductPhoto } = useAppStore();
  const [name, setName] = useState(initialProduct?.name || '');
  const [price, setPrice] = useState(initialProduct?.price?.toString() || '');
  const [categoryId, setCategoryId] = useState(initialProduct?.category_id || categories[0]?.id || '');
  const [imageUrl, setImageUrl] = useState(initialProduct?.image_url === 'IMAGE:placeholder' ? '' : (initialProduct?.image_url || ''));
  const [stock, setStock] = useState(initialProduct?.stock?.toString() || '0');
  const [inStock, setInStock] = useState(initialProduct?.in_stock !== false);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      showToast('Uploading image...', 'info');
      const url = await uploadProductPhoto(file);
      setImageUrl(url);
      showToast('Image uploaded successfully!', 'success');
    } catch (error) {
      console.error('Image upload failed:', error);
      showToast('Failed to upload image. Please try again.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return showToast('Please fill required fields', 'error');
    
    onSave({
      id: initialProduct?.id || Date.now().toString(),
      name,
      price: parseInt(price, 10),
      stock: parseInt(stock, 10),
      category_id: categoryId,
      category_name: categories.find(c => c.id === categoryId)?.name || '',
      image_url: imageUrl || 'IMAGE:placeholder',
      in_stock: inStock,
      reviews: initialProduct?.reviews || []
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold">{initialProduct ? 'Edit Product' : 'Add New Product'}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto grow space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Product Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="Enter product name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Price (₹)</label>
            <input 
              type="number" 
              value={price} 
              onChange={e => setPrice(e.target.value)}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="Enter price"
              required
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Stock Quantity</label>
            <input 
              type="number" 
              value={stock} 
              onChange={e => {
                const val = e.target.value;
                setStock(val);
                if (parseInt(val, 10) > 0) setInStock(true);
                else if (parseInt(val, 10) === 0) setInStock(false);
              }}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="Enter current stock"
              required
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                    categoryId === cat.id 
                      ? 'bg-emerald-600 text-white border-emerald-600' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${inStock ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                {inStock ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">In Stock Status</p>
                <p className="text-xs text-gray-500">{inStock ? 'Available for purchase' : 'Marked as out of stock'}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setInStock(!inStock)}
              className={`w-14 h-7 rounded-full transition-all relative ${inStock ? 'bg-emerald-500' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${inStock ? 'right-1' : 'left-1'}`}></div>
            </button>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Product Image</label>
            <div className="relative border-2 border-dashed border-emerald-200 rounded-xl p-4 text-center hover:bg-emerald-50 transition-colors">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              {isUploading ? (
                <div className="flex flex-col items-center gap-2 text-emerald-600 py-2">
                  <Loader2 className="animate-spin" size={24} />
                  <span className="text-sm font-bold">Uploading...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-500 py-2">
                  <ImageIcon className="text-emerald-500 mb-1" size={28} />
                  <span className="text-sm font-bold">Tap to upload image</span>
                  <span className="text-xs">JPEG, PNG, WebP up to 5MB</span>
                </div>
              )}
            </div>
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-px grow bg-gray-200"></div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">OR PASTE URL</span>
                <div className="h-px grow bg-gray-200"></div>
              </div>
              <div className="flex gap-2">
                <input 
                  type="text"
                  value={imageUrl} 
                  onChange={e => setImageUrl(sanitizeUnsplashUrl(e.target.value))}
                  onPaste={e => {
                    e.preventDefault();
                    const pasted = e.clipboardData.getData('text');
                    setImageUrl(sanitizeUnsplashUrl(pasted));
                  }}
                  className="flex-1 border rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                  placeholder="Paste direct image address..."
                />
                <button
                  type="button"
                  onClick={() => window.open(`https://unsplash.com/s/photos/${encodeURIComponent(name || 'product')}`, '_blank')}
                  className="px-3 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors flex items-center gap-1 text-xs font-bold"
                  title="Search Unsplash"
                >
                  <Search size={14} />
                  Find
                </button>
              </div>
              <p className="mt-2 text-[10px] text-gray-500 leading-relaxed px-1">
                <span className="text-emerald-600 font-bold">Pro Tip:</span> On Unsplash, <span className="underline italic">Right-Click</span> the image and select <span className="font-bold">"Copy image address"</span> for the best results.
              </p>
            </div>

            {imageUrl && imageUrl !== 'IMAGE:placeholder' && (
              <div className="mt-3 relative rounded-lg overflow-hidden h-36 border border-gray-200 group">
                <img 
                  src={imageUrl} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                  onError={e => { (e.target as HTMLImageElement).style.opacity = '0.3'; }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button 
                    type="button"
                    onClick={() => window.open(imageUrl, '_blank')}
                    className="p-2 bg-white rounded-full text-gray-800 hover:bg-gray-100 transition-colors"
                    title="View Full Size"
                  >
                    <Search size={16} />
                  </button>
                  <button 
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="p-2 bg-white rounded-full text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Remove Image"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>
        
        <div className="p-4 border-t bg-gray-50 flex gap-3">
          <button 
            type="button" 
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="button"
            onClick={handleSubmit} 
            disabled={isUploading}
            className="flex-1 py-3 px-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-md disabled:bg-emerald-400"
          >
            Save Product
          </button>
        </div>
      </div>
    </div>
  );
};

const AuthScreen = () => {
   const { signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword, loading, showToast } = useAppStore();
   const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [name, setName] = useState('');
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [success, setSuccess] = useState<string | null>(null);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

   const resetState = () => {
      setError(null);
      setSuccess(null);
      setIsSubmitting(false);
      setValidationErrors({});
   };

   const validateEmail = (email: string) => {
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     return emailRegex.test(email);
   };

   const validateSignup = () => {
     const errors: Record<string, string> = {};

     if (!name.trim()) {
       errors.name = 'Full name is required';
     }
     if (!email.trim()) {
       errors.email = 'Email is required';
     } else if (!validateEmail(email)) {
       errors.email = 'Please enter a valid email address';
     }
     if (!password) {
       errors.password = 'Password is required';
     } else if (password.length < 6) {
       errors.password = 'Password must be at least 6 characters';
     }
     if (password !== confirmPassword) {
       errors.confirmPassword = 'Passwords do not match';
     }

     setValidationErrors(errors);
     return Object.keys(errors).length === 0;
   };

   const validateLogin = () => {
     const errors: Record<string, string> = {};

     if (!email.trim()) {
       errors.email = 'Email is required';
     } else if (!validateEmail(email)) {
       errors.email = 'Please enter a valid email address';
     }
     if (!password) {
       errors.password = 'Password is required';
     }

     setValidationErrors(errors);
     return Object.keys(errors).length === 0;
   };

   const validateForgot = () => {
     const errors: Record<string, string> = {};

     if (!email.trim()) {
       errors.email = 'Email is required';
     } else if (!validateEmail(email)) {
       errors.email = 'Please enter a valid email address';
     }

     setValidationErrors(errors);
     return Object.keys(errors).length === 0;
   };

   const handleGoogleSignIn = async () => {
      try {
        resetState();
        setIsSubmitting(true);
        await signInWithGoogle();
        showToast('Successfully signed in with Google!', 'success');
        setIsSubmitting(false);
      } catch (err: any) {
        console.error('Google sign-in error:', err);
        // More user-friendly error messages
        let errorMsg = 'Google sign-in failed';
        if (err.code === 'auth/popup-closed-by-user') {
          errorMsg = 'Google sign-in was cancelled';
        } else if (err.code === 'auth/popup-blocked') {
          errorMsg = 'Pop-up was blocked. Please allow pop-ups and try again.';
        } else if (err.message) {
          errorMsg = err.message;
        }
        setError(errorMsg);
        setIsSubmitting(false);
      }
    };

   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     resetState();

     // Validate before submitting
     let isValid = false;
     if (authMode === 'signup') {
       isValid = validateSignup();
     } else if (authMode === 'login') {
       isValid = validateLogin();
     } else if (authMode === 'forgot') {
       isValid = validateForgot();
     }

     if (!isValid) {
       return;
     }

     setIsSubmitting(true);

      try {
        if (authMode === 'login') {
          await signInWithEmail(email, password);
          showToast('Welcome back!', 'success');
          setIsSubmitting(false);
        } else if (authMode === 'signup') {
          await signUpWithEmail(email, password, name);
          // Clear form after successful signup
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          setName('');
          setIsSubmitting(false);
          setSuccess('Account created successfully! Welcome to Gokul Stores!');
          setTimeout(() => {
            setAuthMode('login');
            resetState();
          }, 2000);
        } else if (authMode === 'forgot') {
          await resetPassword(email);
          setEmail('');
          setSuccess('Password reset link has been sent to your email. Check your inbox!');
          setTimeout(() => {
            setAuthMode('login');
            resetState();
          }, 3000);
        }
      } catch (err: any) {
        console.error('Auth error:', err);
        let errorMsg = 'Authentication failed';

        // More user-friendly Firebase error messages
        if (err.code === 'auth/user-not-found') {
          errorMsg = 'No account found with this email address';
        } else if (err.code === 'auth/wrong-password') {
          errorMsg = 'Incorrect password';
        } else if (err.code === 'auth/email-already-in-use') {
          errorMsg = 'An account with this email already exists';
        } else if (err.code === 'auth/weak-password') {
          errorMsg = 'Password is too weak. Use at least 6 characters';
        } else if (err.code === 'auth/invalid-email') {
          errorMsg = 'Invalid email address';
        } else if (err.code === 'auth/too-many-requests') {
          errorMsg = 'Too many failed attempts. Please try again later';
        } else if (err.message) {
          errorMsg = err.message;
        }

        setError(errorMsg);
        setIsSubmitting(false);
      }
   };

   const handleModeChange = (mode: 'login' | 'signup' | 'forgot') => {
     setAuthMode(mode);
     resetState();
     // Clear form fields
     setEmail('');
     setPassword('');
     setConfirmPassword('');
     setName('');
     setShowPassword(false);
     setShowConfirmPassword(false);
   };

   return (
     <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center p-4 sm:p-8 mb-12">
       <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/50 p-8 sm:p-10 relative transition-all duration-500">
         {/* Background Decorative Elements */}
         <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-100/50 rounded-full blur-3xl -z-10"></div>
         <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-50/50 rounded-full blur-3xl -z-10"></div>

         <div className="text-center mb-8">
           <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-emerald-200 rotate-3 group-hover:rotate-6 transition-transform">
             <ShoppingBasket size={32} />
           </div>
           <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">
             {authMode === 'login' ? 'Welcome Back' : authMode === 'signup' ? 'Create Account' : 'Reset Password'}
           </h2>
           <p className="text-gray-500 text-sm mt-2 font-medium">
             {authMode === 'login' ? 'Sign in to continue shopping' : authMode === 'signup' ? 'Join us and start shopping' : 'Enter your email to reset your password'}
           </p>
         </div>

         {error && (
           <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl mb-6 text-sm font-medium flex items-start gap-3 animate-shake">
             <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse shrink-0 mt-1"></div>
             <span>{error}</span>
           </div>
         )}

         {success && (
           <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-2xl mb-6 text-sm font-medium flex items-start gap-3">
             <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-pulse shrink-0 mt-1"></div>
             <span>{success}</span>
           </div>
         )}

         <form onSubmit={handleSubmit} className="space-y-4">
           {authMode === 'signup' && (
             <div className="relative group">
               <UserIcon className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
               <input
                 type="text"
                 placeholder="Full Name"
                 value={name}
                 onChange={(e) => {
                   setName(e.target.value);
                   if (validationErrors.name) setValidationErrors(prev => ({ ...prev, name: '' }));
                 }}
                 className={`w-full bg-gray-50/50 border-2 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:bg-white transition-all text-sm font-medium ${
                   validationErrors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-100 focus:border-emerald-500'
                 }`}
               />
               {validationErrors.name && <p className="text-xs text-red-600 mt-1 ml-1">{validationErrors.name}</p>}
             </div>
           )}

           <div className="relative group">
             <Mail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
             <input
               type="email"
               placeholder="Email Address"
               value={email}
               onChange={(e) => {
                 setEmail(e.target.value);
                 if (validationErrors.email) setValidationErrors(prev => ({ ...prev, email: '' }));
               }}
               className={`w-full bg-gray-50/50 border-2 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:bg-white transition-all text-sm font-medium ${
                 validationErrors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-100 focus:border-emerald-500'
               }`}
             />
             {validationErrors.email && <p className="text-xs text-red-600 mt-1 ml-1">{validationErrors.email}</p>}
           </div>

           {authMode !== 'forgot' && (
             <div className="relative group">
               <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
               <input
                 type={showPassword ? 'text' : 'password'}
                 placeholder="Password"
                 value={password}
                 onChange={(e) => {
                   setPassword(e.target.value);
                   if (validationErrors.password) setValidationErrors(prev => ({ ...prev, password: '' }));
                 }}
                 className={`w-full bg-gray-50/50 border-2 rounded-2xl py-3.5 pl-12 pr-12 focus:outline-none focus:bg-white transition-all text-sm font-medium ${
                   validationErrors.password ? 'border-red-300 focus:border-red-500' : 'border-gray-100 focus:border-emerald-500'
                 }`}
               />
               <button
                 type="button"
                 onClick={() => setShowPassword(!showPassword)}
                 className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
               >
                 {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
               </button>
               {validationErrors.password && <p className="text-xs text-red-600 mt-1 ml-1">{validationErrors.password}</p>}
             </div>
           )}

           {authMode === 'signup' && (
             <div className="relative group">
               <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
               <input
                 type={showConfirmPassword ? 'text' : 'password'}
                 placeholder="Confirm Password"
                 value={confirmPassword}
                 onChange={(e) => {
                   setConfirmPassword(e.target.value);
                   if (validationErrors.confirmPassword) setValidationErrors(prev => ({ ...prev, confirmPassword: '' }));
                 }}
                 className={`w-full bg-gray-50/50 border-2 rounded-2xl py-3.5 pl-12 pr-12 focus:outline-none focus:bg-white transition-all text-sm font-medium ${
                   validationErrors.confirmPassword ? 'border-red-300 focus:border-red-500' : 'border-gray-100 focus:border-emerald-500'
                 }`}
               />
               <button
                 type="button"
                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                 className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
               >
                 {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
               </button>
               {validationErrors.confirmPassword && <p className="text-xs text-red-600 mt-1 ml-1">{validationErrors.confirmPassword}</p>}
             </div>
           )}

           {authMode === 'login' && (
             <div className="text-right">
               <button
                 type="button"
                 onClick={() => handleModeChange('forgot')}
                 className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline underline-offset-4"
               >
                 Forgot Password?
               </button>
             </div>
           )}

           <button
             type="submit"
             disabled={isSubmitting || loading}
             className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-200 hover:bg-emerald-700 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 overflow-hidden relative"
           >
             {isSubmitting || loading ? (
               <>
                 <Loader2 className="animate-spin" size={20} />
                 <span>{authMode === 'login' ? 'Signing In...' : authMode === 'signup' ? 'Creating Account...' : 'Sending...'}</span>
               </>
             ) : (
               <span>{authMode === 'login' ? 'Sign In' : authMode === 'signup' ? 'Create Account' : 'Send Reset Link'}</span>
             )}
           </button>
         </form>

         <div className="relative my-8">
           <div className="absolute inset-0 flex items-center">
             <div className="w-full border-t border-gray-100"></div>
           </div>
           <div className="relative flex justify-center text-xs uppercase">
             <span className="bg-white px-4 text-gray-400 font-black tracking-widest">Or continue with</span>
           </div>
         </div>

         <button
           onClick={handleGoogleSignIn}
           disabled={isSubmitting || loading}
           className="w-full bg-white border-2 border-gray-100 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition-all text-gray-700 shadow-sm disabled:opacity-50 active:scale-95 group"
         >
           <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5 group-hover:scale-110 transition-transform" alt="Google" />
           <span className="text-sm">{isSubmitting ? 'Signing in...' : 'Google Account'}</span>
         </button>

         <div className="mt-8 text-center pt-6 border-t border-gray-100 space-y-2">
           {authMode !== 'login' && authMode !== 'signup' && (
             <button
               onClick={() => handleModeChange('login')}
               className="w-full text-sm text-gray-500 font-medium hover:text-emerald-600 transition-colors py-2"
             >
               Back to Sign In
             </button>
           )}

           {(authMode === 'login' || authMode === 'forgot') && (
             <p className="text-sm text-gray-500 font-medium">
               Don't have an account?
               <button
                 onClick={() => handleModeChange('signup')}
                 className="ml-2 text-emerald-600 font-black hover:text-emerald-700 transition-colors"
               >
                 Sign Up
               </button>
             </p>
           )}

           {authMode === 'signup' && (
             <p className="text-sm text-gray-500 font-medium">
               Already have an account?
               <button
                 onClick={() => handleModeChange('login')}
                 className="ml-2 text-emerald-600 font-black hover:text-emerald-700 transition-colors"
               >
                 Sign In
               </button>
             </p>
           )}
         </div>
       </div>
     </div>
   );
 };

const ProfileScreen = ({ navigate }: { navigate: (page: string) => void }) => {
   const { userProfile, updateProfile, signOut, showToast } = useAppStore();
   const [name, setName] = useState(userProfile?.name || '');
   const [phone, setPhone] = useState(userProfile?.phone || '');
   const [address, setAddress] = useState(userProfile?.address || '');
   const [isSaving, setIsSaving] = useState(false);

   useEffect(() => {
     if (userProfile) {
       setName(userProfile.name);
       setPhone(userProfile.phone);
       setAddress(userProfile.address);
     }
   }, [userProfile]);

   const handleSave = async (e: React.FormEvent) => {
     e.preventDefault();
     if (!name.trim()) {
       showToast('Please enter your name', 'error');
       return;
     }

     setIsSaving(true);
     try {
       // Call updateProfile which returns a promise
       await updateProfile({ name, phone, address });
       showToast('Profile updated successfully!', 'success');

       // Navigate after successful save
       setTimeout(() => navigate('home'), 1000);
     } catch (err: any) {
       console.error("Profile save error:", err);
       showToast('Failed to update profile. Please try again.', 'error');
     } finally {
       setIsSaving(false);
     }
   };

  return (
    <div className="pb-24 p-6 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Your Profile</h2>
        <button 
          onClick={() => {
            signOut();
            navigate('home');
          }}
          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Sign Out"
        >
          <LogOut size={24} />
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-2xl uppercase">
            {name.charAt(0) || userProfile?.email.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">{name || 'User'}</h3>
            <p className="text-sm text-gray-500">{userProfile?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)}
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
            <input 
              type="tel" 
              value={phone} 
              onChange={e => setPhone(e.target.value)}
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="e.g. +91 98765 43210"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Delivery Address</label>
            <textarea 
              value={address} 
              onChange={e => setAddress(e.target.value)}
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none h-24"
              placeholder="House No, Street, Landmark, City..."
            />
          </div>
          <button 
            type="submit"
            disabled={isSaving}
            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
          >
            {isSaving && <Loader2 className="animate-spin" size={18} />}
            {isSaving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>

      <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
        <p className="text-sm text-emerald-800">
          <strong>Tip:</strong> Your saved name and address will be automatically included in your WhatsApp orders for faster delivery.
        </p>
      </div>
    </div>
  );
};

const OrdersScreen = () => {
  const { orders } = useAppStore();

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-gray-500">
        <ClipboardList size={80} className="mb-4 opacity-50" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No past orders</h2>
        <p>Your order history will appear here.</p>
      </div>
    );
  }

  return (
    <div className="pb-24 p-4 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Order History</h2>
      
      <div className="space-y-6">
        {orders.map(order => {
          const getStatusColor = (status: string) => {
            switch(status) {
              case 'placed': return 'bg-blue-100 text-blue-800';
              case 'processing': return 'bg-yellow-100 text-yellow-800';
              case 'out_for_delivery': return 'bg-purple-100 text-purple-800';
              case 'delivered': return 'bg-green-100 text-green-800';
              default: return 'bg-gray-100 text-gray-800';
            }
          };

          const getStatusText = (status: string) => {
            if (!status) return 'Placed';
            return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
          };

          return (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-emerald-50 p-4 border-b border-emerald-100 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-emerald-800 font-bold">{order.id}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-emerald-600 mt-1">
                    <Calendar size={12} className="mr-1" />
                    {new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-lg font-bold text-emerald-600">₹{order.total}</p>
                </div>
              </div>
              
              <div className="p-4 space-y-3">
              {order.items.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3">
                    <img 
                      src={getImageUrl(item.image_url, item.category_name, item.name)} 
                      alt={item.name} 
                      className="w-10 h-10 rounded object-cover bg-gray-100"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium text-gray-900">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
};

const WishlistScreen = ({ navigate }: { navigate: (page: string) => void }) => {
  const { wishlist, products, categories } = useAppStore();
  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  if (wishlistProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-gray-500 px-6 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Heart size={48} className="text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
        <p className="max-w-xs">Save items you love and they'll appear here for quick access later.</p>
        <button 
          onClick={() => navigate('products')}
          className="mt-8 bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="pb-24 p-4 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Heart size={32} className="text-rose-500 fill-rose-500 transition-transform hover:scale-110" />
        <h2 className="text-3xl font-bold text-gray-900">Your Wishlist</h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {wishlistProducts.map(product => {
          const category = categories.find(c => c.id === product.category_id);
          return (
            <ProductCard 
              key={product.id} 
              product={product} 
              categoryName={category?.name || ''} 
            />
          );
        })}
      </div>
    </div>
  );
};

const AdminScreen = () => {
  const { products, categories, orders, addProduct, updateProduct, deleteProduct, updateOrderStatus, seedDatabase, fixMissingImages, isAdmin, user, storeSettings, updateStoreSettings, showToast } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [adminTab, setAdminTab] = useState<'products' | 'orders' | 'settings'>('products');
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  
  // Settings form state
  const [sName, setSName] = useState(storeSettings.storeName);
  const [sTagline, setSTagline] = useState(storeSettings.storeTagline);
  const [sMainPhone, setSMainPhone] = useState(storeSettings.mainPhone);
  const [sSecondaryPhone, setSSecondaryPhone] = useState(storeSettings.secondaryPhone);
  const [sAddress, setSAddress] = useState(storeSettings.address);
  const [sMapsUrl, setSMapsUrl] = useState(storeSettings.mapsUrl);
  const [sHours, setSHours] = useState(storeSettings.hoursMondaySunday);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  useEffect(() => {
    setSName(storeSettings.storeName);
    setSTagline(storeSettings.storeTagline);
    setSMainPhone(storeSettings.mainPhone);
    setSSecondaryPhone(storeSettings.secondaryPhone);
    setSAddress(storeSettings.address);
    setSMapsUrl(storeSettings.mapsUrl);
    setSHours(storeSettings.hoursMondaySunday);
  }, [storeSettings]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      await updateStoreSettings({
        storeName: sName,
        storeTagline: sTagline,
        mainPhone: sMainPhone,
        secondaryPhone: sSecondaryPhone,
        address: sAddress,
        mapsUrl: sMapsUrl,
        hoursMondaySunday: sHours
      });
      showToast('Settings updated successfully!');
    } catch (err) {
      showToast('Failed to update settings', 'error');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const generateInventoryPDF = () => {
    const doc = new jsPDF();
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    // --- Header ---
    doc.setFillColor(5, 150, 105); // emerald-600
    doc.rect(0, 0, 210, 32, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(storeSettings.storeName, 14, 14);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Inventory Report', 14, 22);
    doc.text(`Generated: ${dateStr} at ${timeStr}`, 14, 28);

    // --- Summary Stats ---
    const totalProducts = products.length;
    const outOfStock = products.filter(p => (p.stock ?? 0) <= 0).length;
    const lowStock = products.filter(p => (p.stock ?? 0) > 0 && (p.stock ?? 0) < 5).length;
    const inStock = totalProducts - outOfStock - lowStock;
    const totalStockValue = products.reduce((acc, p) => acc + (p.price * (p.stock ?? 0)), 0);

    doc.setTextColor(17, 24, 39); // gray-900
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary', 14, 42);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Products: ${totalProducts}`, 14, 50);
    doc.text(`In Stock: ${inStock}`, 14, 56);
    doc.text(`Low Stock (< 5): ${lowStock}`, 80, 50);
    doc.text(`Out of Stock: ${outOfStock}`, 80, 56);
    doc.text(`Total Inventory Value: \u20B9${totalStockValue.toLocaleString('en-IN')}`, 14, 62);

    // --- Table ---
    const tableRows = products.map((p, i) => {
      const stock = p.stock ?? 0;
      const status = stock <= 0 ? 'Out of Stock' : stock < 5 ? `Low (${stock})` : `${stock}`;
      return [(i + 1).toString(), p.name, p.category_name, `\u20B9${p.price}`, status];
    });

    autoTable(doc, {
      startY: 70,
      head: [['#', 'Product Name', 'Category', 'Price', 'Stock']],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [5, 150, 105], textColor: 255, fontStyle: 'bold', fontSize: 9 },
      bodyStyles: { fontSize: 8, textColor: [17, 24, 39] },
      alternateRowStyles: { fillColor: [240, 253, 244] },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 35 },
        3: { cellWidth: 22, halign: 'right' },
        4: { cellWidth: 30, halign: 'center' },
      },
      didDrawCell: (data) => {
        // Color the Stock column by status
        if (data.section === 'body' && data.column.index === 4) {
          const val = String(data.cell.raw);
          if (val === 'Out of Stock') {
            doc.setTextColor(220, 38, 38); // red
          } else if (val.startsWith('Low')) {
            doc.setTextColor(217, 119, 6); // amber
          } else {
            doc.setTextColor(5, 150, 105); // green
          }
        }
      }
    });

    // --- Footer ---
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(107, 114, 128);
      doc.text(`${storeSettings.storeName} | Confidential`, 14, 290);
      doc.text(`Page ${i} of ${pageCount}`, 196, 290, { align: 'right' });
    }

    const filename = `inventory_${now.toISOString().slice(0, 10)}.pdf`;
    doc.save(filename);
    showToast('Inventory PDF downloaded!', 'success');
  };

  // Debug logging
  console.log("AdminScreen Render:");
  console.log("  User:", user ? { email: user.email, uid: user.uid } : null);
  console.log("  isAdmin:", isAdmin);
  console.log("  User Email:", user?.email);

  if (!user) {
    console.log("AdminScreen: No user, showing login");
    return <AuthScreen />;
  }

  if (!isAdmin) {
    console.log("AdminScreen: User not admin, access denied");
    console.log("  Checked emails include:", ['manojponnaiyan151@gmail.com']);
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center p-6">
        <ShieldCheck size={80} className="text-red-500 mb-4 opacity-50" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
        <p className="text-gray-500">Only authorized administrators can access this dashboard.</p>
        <p className="text-xs text-gray-400 mt-4">Logged in as: {user.email}</p>
        <p className="text-xs text-gray-400 mt-2">Authorized admins: manojponnaiyan151@gmail.com</p>
      </div>
    );
  }


  return (
    <div className="pb-32 p-4 max-w-4xl mx-auto relative min-h-screen">
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-1">Admin Dashboard v5</h2>
            <p className="text-gray-500">Manage your store and orders</p>
          </div>
           <div className="flex gap-2 flex-wrap">
            <button
              onClick={generateInventoryPDF}
              className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-200 transition-colors flex items-center gap-1"
              title="Download Inventory PDF Report"
            >
              <FileDown size={16} /> Export PDF
            </button>
            <button
              onClick={() => fixMissingImages()}
              className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-200 transition-colors flex items-center gap-1"
              title="Fix products with missing or placeholder images"
            >
              <ImageIcon size={16} /> Fix Images
            </button>
            <button
              onClick={() => seedDatabase()}
              className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-200 transition-colors"
            >
              Seed DB
            </button>
          </div>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button 
            onClick={() => setAdminTab('products')}
            className={`flex-1 py-2 rounded-lg font-bold text-sm transition-colors ${adminTab === 'products' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Products ({products.length})
          </button>
          <button 
            onClick={() => setAdminTab('orders')}
            className={`flex-1 py-2 rounded-lg font-bold text-sm transition-colors ${adminTab === 'orders' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Orders ({orders.length})
          </button>
          <button 
            onClick={() => setAdminTab('settings')}
            className={`flex-1 py-2 rounded-lg font-bold text-sm transition-colors ${adminTab === 'settings' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Settings
          </button>
        </div>
      </div>

      {adminTab === 'products' && (
        <div className="space-y-3">
          {products.map(product => {
            const category = categories.find(c => c.id === product.category_id);
            return (
              <div key={product.id} className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4">
                <img 
                  src={getImageUrl(product.image_url, category?.name || '', product.name)} 
                  alt={product.name} 
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover bg-gray-100 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="grow min-w-[120px]">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-bold text-gray-900 line-clamp-1">{product.name}</h4>
                    {product.stock <= 0 ? (
                      <span className="text-[7px] bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded font-black uppercase tracking-widest border border-rose-200">Out of Stock</span>
                    ) : product.stock < 5 ? (
                      <span className="text-[7px] bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded font-black uppercase tracking-widest border border-amber-200">Low Stock: {product.stock}</span>
                    ) : (
                      <span className="text-[7px] bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded font-black uppercase tracking-widest border border-emerald-200">{product.stock} in stock</span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500">{category?.name || 'Unknown'}</p>
                </div>
                
                <div className="flex items-center justify-between w-full sm:w-auto gap-4 sm:gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 mt-2 sm:mt-0 border-gray-50">
                  <div className="font-bold text-emerald-600 text-lg shrink-0 text-left sm:text-right sm:min-w-[70px]">₹{product.price}</div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => { setEditingProduct(product); setIsModalOpen(true); }}
                      className="p-2 sm:p-2 text-gray-500 hover:text-emerald-600 transition-colors bg-gray-100 hover:bg-emerald-50 rounded-lg flex items-center justify-center gap-1 min-w-[40px] h-10"
                      title="Edit Product"
                    >
                      <Pencil size={18} />
                      <span className="text-[10px] font-bold hidden sm:inline">Edit</span>
                    </button>
                    <button 
                      onClick={() => setProductToDelete(product)}
                      className="p-2 sm:p-2 text-rose-500 hover:text-white transition-colors bg-rose-50 hover:bg-rose-600 rounded-lg flex items-center justify-center gap-1 min-w-[40px] h-10 border border-rose-100"
                      title="Delete Product"
                    >
                      <Trash2 size={18} />
                      <span className="text-[10px] font-bold hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          
          <button 
            onClick={() => { setEditingProduct(undefined); setIsModalOpen(true); }}
            className="fixed bottom-28 right-6 w-14 h-14 bg-emerald-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-emerald-700 transition-colors z-10"
          >
            <Plus size={28} />
          </button>
        </div>
      )}

      {productToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-100 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
                <Trash2 className="text-rose-500" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Product?</h3>
              <p className="text-gray-500 mb-6 text-sm">
                Are you sure you want to remove <span className="font-bold text-gray-800">"{productToDelete.name}"</span>? This action cannot be undone.
              </p>
              
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => {
                    deleteProduct(productToDelete.id);
                    setProductToDelete(null);
                    showToast('Product deleted', 'success');
                  }}
                  className="w-full py-3.5 bg-rose-600 text-white rounded-2xl font-bold hover:bg-rose-700 transition-all shadow-lg active:scale-95"
                >
                  Yes, Delete Product
                </button>
                <button 
                  onClick={() => setProductToDelete(null)}
                  className="w-full py-3.5 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-all active:scale-95"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {adminTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <ClipboardList size={48} className="mx-auto mb-2 opacity-20" />
              <p>No orders yet</p>
            </div>
          ) : (
            orders.map(order => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{order.id}</span>
                    <p className="text-sm text-gray-600 font-medium">
                      {new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-emerald-600">₹{order.total}</p>
                    <p className="text-xs text-gray-400">{order.items.length} items</p>
                  </div>
                </div>
                
                <div className="p-4 bg-emerald-50/30">
                  <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-tight">Update Status</p>
                  <div className="flex flex-wrap gap-2">
                    {(['placed', 'processing', 'out_for_delivery', 'delivered'] as const).map(status => (
                      <button
                        key={status}
                        onClick={() => updateOrderStatus(order.id, status)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                          order.status === status 
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm scale-105' 
                          : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300'
                        }`}
                      >
                        {status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 border-t space-y-2">
                  {order.items.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">{item.name} <span className="text-gray-400 font-normal">x{item.quantity}</span></span>
                      <span className="font-medium text-gray-900">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {adminTab === 'settings' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">Store Name</label>
                <input 
                  type="text" 
                  value={sName} 
                  onChange={e => setSName(e.target.value)}
                  className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Gokul Stores"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">Tagline</label>
                <input 
                  type="text" 
                  value={sTagline} 
                  onChange={e => setSTagline(e.target.value)}
                  className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Fresh Groceries • Vegetables"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Main Phone</label>
                <input 
                  type="text" 
                  value={sMainPhone} 
                  onChange={e => setSMainPhone(e.target.value)}
                  className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Secondary Phone</label>
                <input 
                  type="text" 
                  value={sSecondaryPhone} 
                  onChange={e => setSSecondaryPhone(e.target.value)}
                  className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">Address</label>
                <textarea 
                  value={sAddress} 
                  onChange={e => setSAddress(e.target.value)}
                  className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none h-20"
                  placeholder="Full store address"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">Google Maps URL</label>
                <input 
                  type="text" 
                  value={sMapsUrl} 
                  onChange={e => setSMapsUrl(e.target.value)}
                  className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="https://maps.google.com/..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">Store Hours</label>
                <input 
                  type="text" 
                  value={sHours} 
                  onChange={e => setSHours(e.target.value)}
                  className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="6:00 AM - 10:00 PM"
                />
              </div>
            </div>
            
            <button 
              type="submit"
              disabled={isSavingSettings}
              className="w-full mt-6 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
            >
              {isSavingSettings && <Loader2 className="animate-spin" size={18} />}
              {isSavingSettings ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
        </div>
      )}

      {isModalOpen && (
        <ProductModal 
          initialProduct={editingProduct}
          onClose={() => { setIsModalOpen(false); setEditingProduct(undefined); }} 
          onSave={(p) => { 
            if (editingProduct) updateProduct(p);
            else addProduct(p); 
            setIsModalOpen(false); 
            setEditingProduct(undefined);
          }} 
        />
      )}
    </div>
  );
};

const NavItem = ({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
      isActive ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-900'
    }`}
  >
    {icon}
    <span className="text-[10px] font-semibold">{label}</span>
  </button>
);

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 z-1000 bg-white flex flex-col items-center justify-center p-8 animate-out fade-out duration-1000 ease-in-out fill-mode-forwards">
      <div className="flex flex-col items-center max-w-sm w-full space-y-8">
        <div className="w-48 h-48 relative animate-splash-logo">
           <img 
             src="/logo.png" 
             alt="Gokul Stores Logo" 
             className="w-full h-full object-contain"
           />
        </div>
      </div>
      <div className="absolute bottom-12 flex flex-col items-center gap-4 animate-pulse">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce"></div>
        </div>
      </div>
    </div>
  );
};

const AppContent = () => {
  const [currentTab, setCurrentTab] = useState('home');
  const [navParams, setNavParams] = useState<any>({});
  const { cartCount, user, loading, isAdmin, storeSettings, wishlist, isOnline } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [adminClickCount, setAdminClickCount] = useState(0);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2800); // Slightly longer than 2.5s for smooth finish
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallApp = async () => {
    if (!installPrompt) return;
    // Show the install prompt
    installPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setInstallPrompt(null);
    }
  };

  const navigate = (tab: string, params?: any) => {
    setCurrentTab(tab);
    if (params) setNavParams(params);
    else setNavParams({});
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="animate-spin text-emerald-600 mx-auto mb-4" size={48} />
          <p className="text-gray-500 font-medium">Loading Gokul Stores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pt-16">
      {showSplash && <SplashScreen />}
      <Toast />
      {!isOnline && (
        <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
          <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
            <WifiOff size={48} className="text-rose-600" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">Connection Lost</h2>
          <p className="text-gray-500 max-w-xs mb-8">
            Gokul Stores requires an active internet connection to browse products and place orders.
          </p>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95"
            >
              Try to Reconnect
            </button>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-4">
              Checking your signal...
            </p>
          </div>
        </div>
      )}
      <header className="fixed top-0 left-0 right-0 bg-emerald-600 text-white h-16 z-40 flex items-center px-4 shadow-lg border-b border-emerald-500/30">
        <div className="w-full max-w-7xl mx-auto flex items-center gap-4">
          <div 
             onClick={() => navigate('home')}
             className="flex items-center cursor-pointer group"
          >
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-2 group-hover:bg-white/30 transition-all">
              <ShoppingBasket size={18} />
            </div>
            <h1 className="text-lg font-black tracking-tighter uppercase italic leading-none whitespace-nowrap">
              {(() => {
                const words = storeSettings.storeName.split(' ');
                if (words.length > 1) {
                  return <>{words[0]} <span className="opacity-70 font-bold">{words.slice(1).join(' ')}</span></>;
                }
                return words[0];
              })()}
            </h1>
          </div>

          <div className="flex-1 relative max-w-md mx-auto">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value && currentTab !== 'products') {
                  navigate('products');
                }
              }}
              className="w-full bg-white/10 text-white placeholder-emerald-100/60 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 transition-all border border-white/10 focus:ring-4 focus:ring-emerald-500/20"
            />
            <Search className="absolute left-3 top-2.5 text-emerald-100/80" size={18} />
          </div>

           <div className="flex items-center gap-2">
             {installPrompt && (
               <button
                 onClick={handleInstallApp}
                 className="hidden md:flex bg-white/20 text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm items-center gap-1 hover:bg-white hover:text-emerald-700 transition-all border border-white/10"
               >
                 Install
               </button>
             )}
             {user && (
               <>
                 <button
                   onClick={() => navigate('wishlist')}
                   className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border border-white/10 active:scale-95 relative ${
                     currentTab === 'wishlist' ? 'bg-white text-emerald-600' : 'bg-white/10 hover:bg-white/20'
                   }`}
                 >
                   <Heart size={20} fill={currentTab === 'wishlist' ? "currentColor" : "none"} />
                   {wishlist.length > 0 && (
                     <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-emerald-600">
                       {wishlist.length}
                     </span>
                   )}
                 </button>
                 <button
                   onClick={() => navigate('profile')}
                   className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border border-white/10 active:scale-95 ${
                     currentTab === 'profile' ? 'bg-white text-emerald-600' : 'bg-white/10 hover:bg-white/20'
                   }`}
                 >
                   <UserIcon size={20} />
                 </button>
               </>
             )}
             {user && isAdmin && (
               <button
                 onClick={() => navigate('admin')}
                 className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border border-white/10 active:scale-95 ${
                   currentTab === 'admin' ? 'bg-white text-emerald-600' : 'bg-white/10 hover:bg-white/20'
                 }`}
                 title="Admin Dashboard"
               >
                 <ShieldCheck size={20} />
               </button>
             )}
           </div>
        </div>
      </header>

      <main>
        {currentTab === 'home' && <HomeScreen navigate={navigate} installPrompt={installPrompt} onInstall={handleInstallApp} />}
        {currentTab === 'products' && <ProductsScreen initialCategoryId={navParams?.categoryId} searchQuery={searchQuery} />}
        {currentTab === 'cart' && <CartScreen navigate={navigate} />}
        {currentTab === 'orders' && <OrdersScreen />}
        {currentTab === 'contact' && <ContactScreen />}
        {currentTab === 'admin' && <AdminScreen />}
        {currentTab === 'wishlist' && <WishlistScreen navigate={navigate} />}
        {currentTab === 'profile' && (user ? <ProfileScreen navigate={navigate} /> : <AuthScreen />)}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-50 overflow-x-auto">
        <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2 relative">
          <NavItem 
            icon={<Home size={20} />} 
            label="Home" 
            isActive={currentTab === 'home'} 
            onClick={() => navigate('home')} 
          />
          <NavItem 
            icon={<ShoppingBag size={20} />} 
            label="Shop" 
            isActive={currentTab === 'products'} 
            onClick={() => navigate('products')} 
          />
          <NavItem 
            icon={
              <div className="relative">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
            } 
            label="Cart" 
            isActive={currentTab === 'cart'} 
            onClick={() => navigate('cart')} 
          />
          <NavItem 
            icon={<ClipboardList size={20} />} 
            label="Orders" 
            isActive={currentTab === 'orders'} 
            onClick={() => navigate('orders')} 
          />
          <NavItem 
            icon={<UserIcon size={20} />} 
            label="Profile" 
            isActive={currentTab === 'profile'}
            onClick={() => navigate('profile')}
          />
        </div>
      </nav>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
