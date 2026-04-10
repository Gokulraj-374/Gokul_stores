const { initializeApp } = require("firebase/app");
const { getFirestore, collection, doc, setDoc } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyAYlYfVVjhetAnkiUSziFWoWU06HSPhX3g",
  authDomain: "gokul-stores.firebaseapp.com",
  projectId: "gokul-stores",
  storageBucket: "gokul-stores.firebasestorage.app",
  messagingSenderId: "340192412818",
  appId: "1:340192412818:web:708734e7aff4e47f21d24b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const categories = [
  { id: '1', name: 'Snacks', icon: 'Cookie' },
  { id: '3', name: 'Groceries', icon: 'ShoppingBasket' },
  { id: '4', name: 'Drinks', icon: 'CupSoda' },
  { id: '5', name: 'Vegetables', icon: 'Leaf' },
];

const IMAGES = {
  lays_classic: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&q=80&w=600',
  lays_masala: 'https://images.unsplash.com/photo-1621447509374-f20387401c9b?auto=format&fit=crop&q=80&w=600',
  kurkure: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&q=80&w=600',
  haldiram_mixture: 'https://images.unsplash.com/photo-1626082896492-766af4eb6501?auto=format&fit=crop&q=80&w=600',
  marie_gold: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=600',
  oreo: 'https://images.unsplash.com/photo-1540331031772-bf933c077d71?auto=format&fit=crop&q=80&w=600',
  parle_g: 'https://images.unsplash.com/photo-1622728448386-896865668d27?auto=format&fit=crop&q=80&w=600',
  dairy_milk: 'https://images.unsplash.com/photo-1610450942365-53894451731d?auto=format&fit=crop&q=80&w=600',
  kit_kat: 'https://images.unsplash.com/photo-1517060195029-e8853622ee89?auto=format&fit=crop&q=80&w=600',
  munch: 'https://images.unsplash.com/photo-1526344966-89049886b28d?auto=format&fit=crop&q=80&w=600',
  rice_raw: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600',
  rice_basmati: 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?auto=format&fit=crop&q=80&w=600',
  wheat_flour: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600',
  toor_dal: 'https://images.unsplash.com/photo-1585933228913-da9895006d6b?auto=format&fit=crop&q=80&w=600',
  urad_dal: 'https://images.unsplash.com/photo-1505253308343-7f2a12130635?auto=format&fit=crop&q=80&w=600',
  sugar: 'https://images.unsplash.com/photo-1626844131082-256783844137?auto=format&fit=crop&q=80&w=600',
  salt: 'https://images.unsplash.com/photo-1518110903958-ed4fc9211c2f?auto=format&fit=crop&q=80&w=600',
  oil: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=600',
  ghee: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&q=80&w=600',
  turmeric: 'https://images.unsplash.com/photo-1615485499763-71887e1f4ede?auto=format&fit=crop&q=80&w=600',
  chilli_powder: 'https://images.unsplash.com/photo-1599940824399-b87987cb36a5?auto=format&fit=crop&q=80&w=600',
  cola: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=600',
  pepsi: 'https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?auto=format&fit=crop&q=80&w=600',
  sprite: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&q=80&w=600',
  maaza: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&q=80&w=600',
  tropicana: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=600',
  red_bull: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?auto=format&fit=crop&q=80&w=600',
  sting: 'https://images.unsplash.com/photo-1531390650125-9f5b66d7cc8c?auto=format&fit=crop&q=80&w=600',
  milk: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=600',
  water: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&q=80&w=600',
  coconut: 'https://images.unsplash.com/photo-1526344966-89049886b28d?auto=format&fit=crop&q=80&w=600',
  potato: 'https://images.unsplash.com/photo-1518977676601-b53f02ac6d31?auto=format&fit=crop&q=80&w=600',
  tomato: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600',
  onion: 'https://images.unsplash.com/photo-1580201092675-a0bcbc10438a?auto=format&fit=crop&q=80&w=600',
  carrot: 'https://images.unsplash.com/photo-1444731964746-611030d42e52?auto=format&fit=crop&q=80&w=600',
  spinach: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=600',
  garlic: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&q=80&w=600',
  ginger: 'https://images.unsplash.com/photo-1599940824399-b87987cb36a5?auto=format&fit=crop&q=80&w=600',
  green_chilli: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&q=80&w=600'
};

const initialProducts = [
  // Snacks
  { id: 's1', name: 'Lays Classic', price: 20, category_id: '1', category_name: 'Snacks', image_url: IMAGES.lays_classic, in_stock: true },
  { id: 's2', name: 'Lays Magic Masala', price: 20, category_id: '1', category_name: 'Snacks', image_url: IMAGES.lays_masala, in_stock: true },
  { id: 's3', name: 'Lays Cream & Onion', price: 20, category_id: '1', category_name: 'Snacks', image_url: IMAGES.lays_classic, in_stock: true },
  { id: 's4', name: 'Kurkure Masala', price: 15, category_id: '1', category_name: 'Snacks', image_url: IMAGES.kurkure, in_stock: true },
  { id: 's9', name: 'Haldiram Mixture', price: 45, category_id: '1', category_name: 'Snacks', image_url: IMAGES.haldiram_mixture, in_stock: true },
  { id: 's16', name: 'Marie Gold', price: 25, category_id: '1', category_name: 'Snacks', image_url: IMAGES.marie_gold, in_stock: true },
  { id: 's18', name: 'Oreo Biscuit', price: 35, category_id: '1', category_name: 'Snacks', image_url: IMAGES.oreo, in_stock: true },
  { id: 's24', name: 'Parle-G', price: 10, category_id: '1', category_name: 'Snacks', image_url: IMAGES.parle_g, in_stock: true },
  { id: 's38', name: 'Dairy Milk Silk', price: 80, category_id: '1', category_name: 'Snacks', image_url: IMAGES.dairy_milk, in_stock: true },
  { id: 's41', name: 'KitKat', price: 30, category_id: '1', category_name: 'Snacks', image_url: IMAGES.kit_kat, in_stock: true },
  { id: 's42', name: 'Munch', price: 10, category_id: '1', category_name: 'Snacks', image_url: IMAGES.munch, in_stock: true },
  // Groceries
  { id: 'g1', name: 'Raw Rice 1kg', price: 60, category_id: '3', category_name: 'Groceries', image_url: IMAGES.rice_raw, in_stock: true },
  { id: 'g3', name: 'Basmati Rice 1kg', price: 120, category_id: '3', category_name: 'Groceries', image_url: IMAGES.rice_basmati, in_stock: true },
  { id: 'g6', name: 'Wheat Flour 1kg', price: 55, category_id: '3', category_name: 'Groceries', image_url: IMAGES.wheat_flour, in_stock: true },
  { id: 'g14', name: 'Toor Dal 500g', price: 90, category_id: '3', category_name: 'Groceries', image_url: IMAGES.toor_dal, in_stock: true },
  { id: 'g15', name: 'Urad Dal 500g', price: 85, category_id: '3', category_name: 'Groceries', image_url: IMAGES.urad_dal, in_stock: true },
  { id: 'g25', name: 'Sugar 1kg', price: 45, category_id: '3', category_name: 'Groceries', image_url: IMAGES.sugar, in_stock: true },
  { id: 'g27', name: 'Salt 1kg', price: 20, category_id: '3', category_name: 'Groceries', image_url: IMAGES.salt, in_stock: true },
  { id: 'g29', name: 'Sunflower Oil 1L', price: 140, category_id: '3', category_name: 'Groceries', image_url: IMAGES.oil, in_stock: true },
  { id: 'g34', name: 'Pure Ghee 200ml', price: 210, category_id: '3', category_name: 'Groceries', image_url: IMAGES.ghee, in_stock: true },
  { id: 'g37', name: 'Turmeric Powder 100g', price: 35, category_id: '3', category_name: 'Groceries', image_url: IMAGES.turmeric, in_stock: true },
  { id: 'g38', name: 'Chilli Powder 100g', price: 40, category_id: '3', category_name: 'Groceries', image_url: IMAGES.chilli_powder, in_stock: true },
  // Drinks
  { id: 'd1', name: 'Coca Cola 750ml', price: 45, category_id: '4', category_name: 'Drinks', image_url: IMAGES.cola, in_stock: true },
  { id: 'd4', name: 'Pepsi 750ml', price: 45, category_id: '4', category_name: 'Drinks', image_url: IMAGES.pepsi, in_stock: true },
  { id: 'd7', name: 'Sprite 750ml', price: 45, category_id: '4', category_name: 'Drinks', image_url: IMAGES.sprite, in_stock: true },
  { id: 'd21', name: 'Maaza 1.2L', price: 85, category_id: '4', category_name: 'Drinks', image_url: IMAGES.maaza, in_stock: true },
  { id: 'd25', name: 'Tropicana Apple 1L', price: 110, category_id: '4', category_name: 'Drinks', image_url: IMAGES.tropicana, in_stock: true },
  { id: 'd41', name: 'Red Bull 250ml', price: 115, category_id: '4', category_name: 'Drinks', image_url: IMAGES.red_bull, in_stock: true },
  { id: 'd45', name: 'Sting Energy 250ml', price: 20, category_id: '4', category_name: 'Drinks', image_url: IMAGES.sting, in_stock: true },
  { id: 'd54', name: 'Fresh Milk 500ml', price: 28, category_id: '4', category_name: 'Drinks', image_url: IMAGES.milk, in_stock: true },
  { id: 'd71', name: 'Mineral Water 1L', price: 20, category_id: '4', category_name: 'Drinks', image_url: IMAGES.water, in_stock: true },
  { id: 'd91', name: 'Tender Coconut', price: 50, category_id: '4', category_name: 'Drinks', image_url: IMAGES.coconut, in_stock: true },
  // Vegetables
  { id: 'v1', name: 'Potato 1kg', price: 45, category_id: '5', category_name: 'Vegetables', image_url: IMAGES.potato, in_stock: true },
  { id: 'v2', name: 'Tomato 1kg', price: 30, category_id: '5', category_name: 'Vegetables', image_url: IMAGES.tomato, in_stock: true },
  { id: 'v3', name: 'Onion 1kg', price: 40, category_id: '5', category_name: 'Vegetables', image_url: IMAGES.onion, in_stock: true },
  { id: 'v4', name: 'Carrot 500g', price: 35, category_id: '5', category_name: 'Vegetables', image_url: IMAGES.carrot, in_stock: true },
  { id: 'v5', name: 'Fresh Spinach', price: 15, category_id: '5', category_name: 'Vegetables', image_url: IMAGES.spinach, in_stock: true },
  { id: 'v6', name: 'Garlic 200g', price: 40, category_id: '5', category_name: 'Vegetables', image_url: IMAGES.garlic, in_stock: true },
  { id: 'v7', name: 'Ginger 200g', price: 30, category_id: '5', category_name: 'Vegetables', image_url: IMAGES.ginger, in_stock: true },
  { id: 'v8', name: 'Green Chilli 100g', price: 15, category_id: '5', category_name: 'Vegetables', image_url: IMAGES.green_chilli, in_stock: true }
];

async function seedDatabase() {
  console.log('Seeding categories...');
  for (const category of categories) {
    await setDoc(doc(db, 'categories', category.id), category);
    console.log(`  ✓ ${category.name}`);
  }
  console.log('Seeding products...');
  for (const product of initialProducts) {
    await setDoc(doc(db, 'products', product.id), product);
    console.log(`  ✓ ${product.name}`);
  }
  console.log('\nDatabase seeded successfully! All products restored.');
  process.exit(0);
}

seedDatabase().catch(err => { console.error(err); process.exit(1); });
