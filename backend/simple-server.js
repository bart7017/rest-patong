const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3003;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3001', // Client
    'http://localhost:3002', // Admin
    'http://localhost:3000', // Fallback
    'http://127.0.0.1:3001', // Client IP
    'http://127.0.0.1:3002', // Admin IP
    'http://127.0.0.1:3000'  // Fallback IP
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Data storage
const dataDir = path.join(__dirname, 'data');
const dishesFile = path.join(dataDir, 'dishes.json');
const categoriesFile = path.join(dataDir, 'categories.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initial data
const initialDishes = [
  {
    _id: '6',
    name: { fr: 'French Tacos Signature', en: 'Signature French Tacos', th: 'เฟรนช์ทาโค่ซิกเนเจอร์', ru: 'Фирменный французский такос', de: 'Signature French Tacos' },
    description: { fr: 'Notre French Tacos signature avec poulet, frites, sauce fromagère', en: 'Our signature French Tacos with chicken, fries, cheese sauce', th: 'เฟรนช์ทาโค่ซิกเนเจอร์ของเรากับไก่ เฟรนช์ฟราย ซอสชีส', ru: 'Наш фирменный французский такос с курицей, картофелем фри и сырным соусом', de: 'Unser Signature French Tacos mit Hähnchen, Pommes, Käsesauce' },
    category: '3',
    price: { amount: 280, currency: 'THB' },
    images: [],
    tags: { isNew: true, isPopular: false, isChefSpecial: true },
    dietary: { isVegetarian: false, isVegan: false, isSpicy: false, spicyLevel: 0 },
    isActive: true,
    preparationTime: 15,
    order: 1
  },
  {
    _id: '7',
    name: { fr: 'French Tacos Personnalisable', en: 'Customizable French Tacos', th: 'เฟรนช์ทาโค่ปรับแต่งได้', ru: 'Настраиваемый французский такос', de: 'Anpassbare French Tacos' },
    description: { fr: 'Créez votre French Tacos sur mesure en choisissant vos ingrédients préférés', en: 'Create your custom French Tacos by choosing your favorite ingredients', th: 'สร้างเฟรนช์ทาโค่ของคุณเองโดยเลือกส่วนผสมที่คุณชอบ', ru: 'Создайте свой французский такос, выбрав любимые ингредиенты', de: 'Erstellen Sie Ihren French Tacos nach Wunsch mit Ihren Lieblingszutaten' },
    category: '3',
    price: { amount: 220, currency: 'THB' },
    images: [],
    tags: { isNew: true, isPopular: true, isChefSpecial: false },
    dietary: { isVegetarian: false, isVegan: false, isSpicy: false, spicyLevel: 0 },
    isActive: true,
    preparationTime: 12,
    order: 2
  },
  {
    _id: '8',
    name: { fr: 'Burger Classique', en: 'Classic Burger', th: 'เบอร์เกอร์คลาสสิค', ru: 'Классический бургер', de: 'Klassischer Burger' },
    description: { fr: 'Burger beef avec salade, tomate, cornichons et sauce', en: 'Beef burger with lettuce, tomato, pickles and sauce', th: 'เบอร์เกอร์เนื้อกับผักสลัด มะเขือเทศ หัวไชเท้า และซอส', ru: 'Говяжий бургер с салатом, помидором, солеными огурцами и соусом', de: 'Rindfleisch-Burger mit Salat, Tomate, Gurken und Sauce' },
    category: '3',
    price: { amount: 250, currency: 'THB' },
    images: [],
    tags: { isNew: false, isPopular: true, isChefSpecial: false },
    dietary: { isVegetarian: false, isVegan: false, isSpicy: false, spicyLevel: 0 },
    isActive: true,
    preparationTime: 18,
    order: 3
  }
];

const initialCategories = [
  {
    _id: '1',
    name: { fr: 'Entrées', en: 'Appetizers', th: 'อาหารเรียกน้ำย่อย', ru: 'Закуски', de: 'Vorspeisen' },
    description: { fr: 'Délicieuses entrées pour commencer', en: 'Delicious starters', th: 'อาหารเรียกน้ำย่อยอร่อย', ru: 'Вкусные закуски', de: 'Köstliche Vorspeisen' },
    icon: '🥗',
    order: 1,
    isActive: true,
    dishCount: 8
  },
  {
    _id: '2',
    name: { fr: 'Soupes', en: 'Soups', th: 'ซุป', ru: 'Супы', de: 'Suppen' },
    description: { fr: 'Soupes traditionnelles thaï', en: 'Traditional Thai soups', th: 'ซุปไทยแบบดั้งเดิม', ru: 'Традиционные тайские супы', de: 'Traditionelle Thai-Suppen' },
    icon: '🍜',
    order: 2,
    isActive: true,
    dishCount: 6
  },
  {
    _id: '3',
    name: { fr: 'Plats principaux', en: 'Main dishes', th: 'อาหารจานหลัก', ru: 'Основные блюда', de: 'Hauptgerichte' },
    description: { fr: 'Nos spécialités principales', en: 'Our main specialties', th: 'อาหารพิเศษหลักของเรา', ru: 'Наши основные деликатесы', de: 'Unsere Hauptspezialitäten' },
    icon: '🍛',
    order: 3,
    isActive: true,
    dishCount: 15
  },
  {
    _id: '4',
    name: { fr: 'Desserts', en: 'Desserts', th: 'ของหวาน', ru: 'Десерты', de: 'Nachspeisen' },
    description: { fr: 'Desserts traditionnels thaï', en: 'Traditional Thai desserts', th: 'ของหวานไทยแบบดั้งเดิม', ru: 'Традиционные тайские десерты', de: 'Traditionelle Thai-Desserts' },
    icon: '🍨',
    order: 4,
    isActive: true,
    dishCount: 5
  }
];

// Helper functions
function loadData(file, initialData) {
  try {
    const data = fs.readFileSync(file, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    fs.writeFileSync(file, JSON.stringify(initialData, null, 2));
    return initialData;
  }
}

function saveData(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Dishes routes
app.get('/api/dishes', (req, res) => {
  const dishes = loadData(dishesFile, initialDishes);
  res.json(dishes);
});

app.get('/api/dishes/:id', (req, res) => {
  const dishes = loadData(dishesFile, initialDishes);
  const dish = dishes.find(d => d._id === req.params.id);
  
  if (!dish) {
    return res.status(404).json({ error: 'Dish not found' });
  }
  
  res.json(dish);
});

app.post('/api/dishes', (req, res) => {
  const dishes = loadData(dishesFile, initialDishes);
  const newDish = {
    _id: Date.now().toString(),
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  dishes.push(newDish);
  saveData(dishesFile, dishes);
  
  res.status(201).json(newDish);
});

app.put('/api/dishes/:id', (req, res) => {
  const dishes = loadData(dishesFile, initialDishes);
  const index = dishes.findIndex(d => d._id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Dish not found' });
  }
  
  dishes[index] = {
    ...dishes[index],
    ...req.body,
    updatedAt: new Date()
  };
  
  saveData(dishesFile, dishes);
  res.json(dishes[index]);
});

app.delete('/api/dishes/:id', (req, res) => {
  const dishes = loadData(dishesFile, initialDishes);
  const filteredDishes = dishes.filter(d => d._id !== req.params.id);
  
  saveData(dishesFile, filteredDishes);
  res.json({ message: 'Dish deleted successfully' });
});

// Categories routes
app.get('/api/categories', (req, res) => {
  const categories = loadData(categoriesFile, initialCategories);
  res.json(categories);
});

app.get('/api/categories/:id', (req, res) => {
  const categories = loadData(categoriesFile, initialCategories);
  const category = categories.find(c => c._id === req.params.id);
  
  if (!category) {
    return res.status(404).json({ error: 'Category not found' });
  }
  
  res.json(category);
});

app.post('/api/categories', (req, res) => {
  const categories = loadData(categoriesFile, initialCategories);
  const newCategory = {
    _id: Date.now().toString(),
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  categories.push(newCategory);
  saveData(categoriesFile, categories);
  
  res.status(201).json(newCategory);
});

app.put('/api/categories/:id', (req, res) => {
  const categories = loadData(categoriesFile, initialCategories);
  const index = categories.findIndex(c => c._id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Category not found' });
  }
  
  categories[index] = {
    ...categories[index],
    ...req.body,
    updatedAt: new Date()
  };
  
  saveData(categoriesFile, categories);
  res.json(categories[index]);
});

app.delete('/api/categories/:id', (req, res) => {
  const categories = loadData(categoriesFile, initialCategories);
  const filteredCategories = categories.filter(c => c._id !== req.params.id);
  
  saveData(categoriesFile, filteredCategories);
  res.json({ message: 'Category deleted successfully' });
});

// Analytics routes
app.get('/api/analytics', (req, res) => {
  const dishes = loadData(dishesFile, initialDishes);
  const categories = loadData(categoriesFile, initialCategories);
  
  // Simuler des vues pour les plats existants
  const dishesWithViews = dishes.map((dish, index) => {
    // Attribuer des vues simulées basées sur l'index et popularity
    let views = Math.floor(Math.random() * 500) + 100; // Entre 100 et 600
    
    if (dish.tags?.isPopular) views += Math.floor(Math.random() * 300) + 200; // Bonus pour populaires
    if (dish.tags?.isChefSpecial) views += Math.floor(Math.random() * 200) + 100; // Bonus pour spécialités
    
    return { ...dish, views };
  });
  
  // Trier par vues décroissantes et prendre le top 5
  const topDishes = dishesWithViews
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)
    .map((dish, index) => ({
      name: dish.name,
      views: dish.views,
      trend: Math.floor(Math.random() * 30) + 5, // Entre 5% et 35% d'augmentation
      languages: [
        { code: 'fr', percentage: 35 + Math.floor(Math.random() * 20) },
        { code: 'en', percentage: 25 + Math.floor(Math.random() * 20) },
        { code: 'th', percentage: 15 + Math.floor(Math.random() * 15) },
        { code: 'ru', percentage: 10 + Math.floor(Math.random() * 10) },
        { code: 'de', percentage: 5 + Math.floor(Math.random() * 10) }
      ]
    }));
  
  // Calculer les stats globales
  const totalViews = dishesWithViews.reduce((sum, dish) => sum + dish.views, 0);
  const totalDishes = dishes.length;
  const activeDishes = dishes.filter(dish => dish.isActive).length;
  
  const analytics = {
    overview: {
      totalViews: totalViews,
      uniqueVisitors: Math.floor(totalViews * 0.75), // ~75% de visiteurs uniques
      avgSessionTime: 3.8 + Math.random() * 1.4, // Entre 3.8 et 5.2 minutes
      conversionRate: 12.5 + Math.random() * 8, // Entre 12.5% et 20.5%
      trends: {
        views: Math.floor(Math.random() * 20) + 5, // +5% à +25%
        visitors: Math.floor(Math.random() * 15) + 3, // +3% à +18%
        sessionTime: Math.floor(Math.random() * 10) - 5 // -5% à +5%
      }
    },
    topDishes: topDishes,
    languageStats: [
      { language: 'English', code: 'en', flag: '🇬🇧', percentage: 45, views: Math.floor(totalViews * 0.45), trend: 10 },
      { language: 'Français', code: 'fr', flag: '🇫🇷', percentage: 25, views: Math.floor(totalViews * 0.25), trend: 5 },
      { language: 'ไทย', code: 'th', flag: '🇹🇭', percentage: 15, views: Math.floor(totalViews * 0.15), trend: 15 },
      { language: 'Русский', code: 'ru', flag: '🇷🇺', percentage: 10, views: Math.floor(totalViews * 0.10), trend: 8 },
      { language: 'Deutsch', code: 'de', flag: '🇩🇪', percentage: 5, views: Math.floor(totalViews * 0.05), trend: 3 }
    ],
    timeAnalytics: {
      hourly: Array.from({ length: 18 }, (_, i) => {
        const hour = i + 6; // 6h à 23h
        const baseViews = hour >= 11 && hour <= 14 ? 300 : hour >= 18 && hour <= 21 ? 400 : 150;
        return {
          hour,
          views: baseViews + Math.floor(Math.random() * 200)
        };
      }),
      daily: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => ({
        day,
        views: 1500 + Math.floor(Math.random() * 1000)
      })),
      weekly: ['S1', 'S2', 'S3', 'S4'].map(week => ({
        week,
        views: 8000 + Math.floor(Math.random() * 3000)
      }))
    },
    searchTerms: [
      { term: 'tacos', count: 567, trend: 28 },
      { term: 'burger', count: 423, trend: 15 },
      { term: 'pizza', count: 234, trend: 12 },
      { term: 'salade', count: 189, trend: 8 }
    ],
    deviceStats: {
      mobile: 85,
      tablet: 10,
      desktop: 5
    },
    metadata: {
      totalDishes,
      activeDishes,
      categories: categories.length,
      lastUpdated: new Date().toISOString()
    }
  };
  
  res.json(analytics);
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Papy Restaurant API - Simple Version',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      dishes: '/api/dishes',
      categories: '/api/categories'
    }
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Simple API Server running on http://localhost:${PORT}`);
  console.log(`🔗 Also available on http://127.0.0.1:${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/health`);
  console.log(`🍽️ Dishes: http://localhost:${PORT}/api/dishes`);
  console.log(`🏷️ Categories: http://localhost:${PORT}/api/categories`);
});