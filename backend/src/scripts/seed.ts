import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDatabase } from '../config/database';
import { User } from '../models/User';
import { Category } from '../models/Category';
import { Dish } from '../models/Dish';
import { MenuAnalytics } from '../models/MenuAnalytics';

// Données des catégories multilingues
const categoriesData = [
  {
    name: {
      fr: 'Entrées',
      en: 'Appetizers',
      th: 'อาหารเรียกน้ำย่อย',
      ru: 'Закуски',
      de: 'Vorspeisen'
    },
    description: {
      fr: 'Délicieuses entrées pour commencer votre repas',
      en: 'Delicious appetizers to start your meal',
      th: 'อาหารเรียกน้ำย่อยอร่อยเพื่อเริ่มต้นมื้ออาหาร',
      ru: 'Вкусные закуски для начала трапезы',
      de: 'Köstliche Vorspeisen für den Start Ihrer Mahlzeit'
    },
    icon: '🍤',
    sortOrder: 1,
    isActive: true
  },
  {
    name: {
      fr: 'Soupes',
      en: 'Soups',
      th: 'ซุป',
      ru: 'Супы',
      de: 'Suppen'
    },
    description: {
      fr: 'Soupes traditionnelles thaïlandaises',
      en: 'Traditional Thai soups',
      th: 'ซุปไทยแบบดั้งเดิม',
      ru: 'Традиционные тайские супы',
      de: 'Traditionelle thailändische Suppen'
    },
    icon: '🍜',
    sortOrder: 2,
    isActive: true
  },
  {
    name: {
      fr: 'Plats Principaux',
      en: 'Main Courses',
      th: 'อาหารจานหลัก',
      ru: 'Основные блюда',
      de: 'Hauptgerichte'
    },
    description: {
      fr: 'Nos spécialités thaïlandaises authentiques',
      en: 'Our authentic Thai specialties',
      th: 'อาหารไทยแท้ของเรา',
      ru: 'Наши аутентичные тайские блюда',
      de: 'Unsere authentischen thailändischen Spezialitäten'
    },
    icon: '🍛',
    sortOrder: 3,
    isActive: true
  },
  {
    name: {
      fr: 'Desserts',
      en: 'Desserts',
      th: 'ของหวาน',
      ru: 'Десерты',
      de: 'Desserts'
    },
    description: {
      fr: 'Desserts traditionnels et modernes',
      en: 'Traditional and modern desserts',
      th: 'ของหวานแบบดั้งเดิมและสมัยใหม่',
      ru: 'Традиционные и современные десерты',
      de: 'Traditionelle und moderne Desserts'
    },
    icon: '🍰',
    sortOrder: 4,
    isActive: true
  },
  {
    name: {
      fr: 'Boissons',
      en: 'Beverages',
      th: 'เครื่องดื่ม',
      ru: 'Напитки',
      de: 'Getränke'
    },
    description: {
      fr: 'Boissons fraîches et cocktails tropicaux',
      en: 'Fresh drinks and tropical cocktails',
      th: 'เครื่องดื่มสดใหม่และค็อกเทลเขตร้อน',
      ru: 'Свежие напитки и тропические коктейли',
      de: 'Frische Getränke und tropische Cocktails'
    },
    icon: '🥤',
    sortOrder: 5,
    isActive: true
  }
];

// Données des plats
const dishesData = [
  // ENTRÉES
  {
    name: {
      fr: 'Rouleaux de Printemps',
      en: 'Spring Rolls',
      th: 'ปอเปี๊ยะสด',
      ru: 'Спринг-роллы',
      de: 'Frühlingsrollen'
    },
    description: {
      fr: 'Rouleaux frais aux crevettes et légumes croquants, sauce sweet chili',
      en: 'Fresh rolls with shrimp and crispy vegetables, sweet chili sauce',
      th: 'ปอเปี๊ยะสดกุ้งและผักกรอบ พร้อมน้ำจิ้มหวาน',
      ru: 'Свежие роллы с креветками и хрустящими овощами, соус сладкий чили',
      de: 'Frische Rollen mit Garnelen und knackigem Gemüse, süße Chilisauce'
    },
    price: { amount: 120, currency: 'THB' },
    categoryName: 'Entrées',
    preparationTime: 10,
    dietary: { isVegetarian: false, isVegan: false, isSpicy: false },
    tags: { isNew: true, isPopular: false, isChefSpecial: false },
    allergens: ['crustaceans'],
    isActive: true
  },
  {
    name: {
      fr: 'Salade de Papaye Verte',
      en: 'Green Papaya Salad',
      th: 'ส้มตำ',
      ru: 'Салат из зеленой папайи',
      de: 'Grüner Papayasalat'
    },
    description: {
      fr: 'Salade épicée de papaye verte râpée, tomates cerises, haricots verts',
      en: 'Spicy shredded green papaya salad with cherry tomatoes, green beans',
      th: 'ส้มตำไทยรสจัด มะเขือเทศเชอร์รี่ ถั่วฝักยาว',
      ru: 'Острый салат из тертой зеленой папайи с помидорами черри, зеленой фасолью',
      de: 'Scharfer geraspelter grüner Papayasalat mit Kirschtomaten, grünen Bohnen'
    },
    price: { amount: 80, currency: 'THB' },
    categoryName: 'Entrées',
    preparationTime: 8,
    dietary: { isVegetarian: true, isVegan: true, isSpicy: true, spicyLevel: 3 },
    tags: { isNew: false, isPopular: true, isChefSpecial: false },
    allergens: [],
    isActive: true
  },

  // SOUPES
  {
    name: {
      fr: 'Tom Yum Kung',
      en: 'Tom Yum Kung',
      th: 'ต้มยำกุ้ง',
      ru: 'Том Ям Кунг',
      de: 'Tom Yum Kung'
    },
    description: {
      fr: 'Soupe épicée aux crevettes, citronnelle, galanga, feuilles de lime',
      en: 'Spicy shrimp soup with lemongrass, galangal, lime leaves',
      th: 'ต้มยำกุ้งรสจัดจ้าน ตะไคร้ ข่า ใบมะกรูด',
      ru: 'Острый креветочный суп с лемонграссом, галангалом, листьями лайма',
      de: 'Scharfe Garnelensuppe mit Zitronengras, Galgant, Limettenblättern'
    },
    price: { amount: 220, currency: 'THB' },
    categoryName: 'Soupes',
    preparationTime: 15,
    dietary: { isVegetarian: false, isVegan: false, isSpicy: true, spicyLevel: 4 },
    tags: { isNew: false, isPopular: true, isChefSpecial: true },
    allergens: ['crustaceans'],
    isActive: true
  },
  {
    name: {
      fr: 'Tom Kha Gai',
      en: 'Tom Kha Gai',
      th: 'ต้มข่าไก่',
      ru: 'Том Кха Гай',
      de: 'Tom Kha Gai'
    },
    description: {
      fr: 'Soupe de poulet au lait de coco, galanga, champignons',
      en: 'Chicken soup with coconut milk, galangal, mushrooms',
      th: 'ต้มข่าไก่กะทิ ข่า เห็ด',
      ru: 'Куриный суп с кокосовым молоком, галангалом, грибами',
      de: 'Hühnersuppe mit Kokosmilch, Galgant, Pilzen'
    },
    price: { amount: 180, currency: 'THB' },
    categoryName: 'Soupes',
    preparationTime: 12,
    dietary: { isVegetarian: false, isVegan: false, isSpicy: false },
    tags: { isNew: false, isPopular: true, isChefSpecial: false },
    allergens: [],
    isActive: true
  },

  // PLATS PRINCIPAUX
  {
    name: {
      fr: 'Pad Thai',
      en: 'Pad Thai',
      th: 'ผัดไทย',
      ru: 'Пад Тай',
      de: 'Pad Thai'
    },
    description: {
      fr: 'Nouilles de riz sautées aux crevettes, tofu, germes de soja, cacahuètes',
      en: 'Stir-fried rice noodles with shrimp, tofu, bean sprouts, peanuts',
      th: 'ผัดไทยกุ้ง เต้าหู้ ถั่วงอก ถั่วลิสง',
      ru: 'Жареная рисовая лапша с креветками, тофу, ростками фасоли, арахисом',
      de: 'Gebratene Reisnudeln mit Garnelen, Tofu, Sojasprossen, Erdnüssen'
    },
    price: { amount: 160, currency: 'THB' },
    categoryName: 'Plats Principaux',
    preparationTime: 12,
    dietary: { isVegetarian: false, isVegan: false, isSpicy: false },
    tags: { isNew: false, isPopular: true, isChefSpecial: false },
    allergens: ['crustaceans', 'nuts', 'soy'],
    isActive: true
  },
  {
    name: {
      fr: 'Curry Vert au Poulet',
      en: 'Green Chicken Curry',
      th: 'แกงเขียวหวานไก่',
      ru: 'Зеленое куриное карри',
      de: 'Grünes Hühnchen-Curry'
    },
    description: {
      fr: 'Curry vert épicé au poulet, aubergines thaï, basilic, lait de coco',
      en: 'Spicy green curry with chicken, Thai eggplant, basil, coconut milk',
      th: 'แกงเขียวหวานไก่ มะเขือ โหระพา กะทิ',
      ru: 'Острое зеленое карри с курицей, тайскими баклажанами, базиликом, кокосовым молоком',
      de: 'Scharfes grünes Curry mit Huhn, thailändischen Auberginen, Basilikum, Kokosmilch'
    },
    price: { amount: 200, currency: 'THB' },
    categoryName: 'Plats Principaux',
    preparationTime: 18,
    dietary: { isVegetarian: false, isVegan: false, isSpicy: true, spicyLevel: 3 },
    tags: { isNew: false, isPopular: true, isChefSpecial: true },
    allergens: [],
    isActive: true
  },
  {
    name: {
      fr: 'Poisson Entier Grillé',
      en: 'Grilled Whole Fish',
      th: 'ปลาเผา',
      ru: 'Жареная целая рыба',
      de: 'Ganzer gegrillter Fisch'
    },
    description: {
      fr: 'Poisson frais grillé aux herbes thaï, sauce tamarind épicée',
      en: 'Fresh grilled fish with Thai herbs, spicy tamarind sauce',
      th: 'ปลาเผาสมุนไพรไทย น้ำจิ้มมะขาม',
      ru: 'Свежая жареная рыба с тайскими травами, острым соусом тамаринд',
      de: 'Frischer gegrillter Fisch mit thailändischen Kräutern, scharfer Tamarindensauce'
    },
    price: { amount: 450, currency: 'THB' },
    categoryName: 'Plats Principaux',
    preparationTime: 25,
    dietary: { isVegetarian: false, isVegan: false, isSpicy: true, spicyLevel: 2 },
    tags: { isNew: true, isPopular: false, isChefSpecial: true },
    allergens: ['fish'],
    isActive: true
  },

  // DESSERTS
  {
    name: {
      fr: 'Riz Gluant à la Mangue',
      en: 'Mango Sticky Rice',
      th: 'ข้าวเหนียวมะม่วง',
      ru: 'Клейкий рис с манго',
      de: 'Klebreis mit Mango'
    },
    description: {
      fr: 'Riz gluant sucré au lait de coco, mangue fraîche, graines de sésame',
      en: 'Sweet sticky rice with coconut milk, fresh mango, sesame seeds',
      th: 'ข้าวเหนียวหวานกะทิ มะม่วงสุก งาขาว',
      ru: 'Сладкий клейкий рис с кокосовым молоком, свежим манго, семенами кунжута',
      de: 'Süßer Klebreis mit Kokosmilch, frischer Mango, Sesamsamen'
    },
    price: { amount: 120, currency: 'THB' },
    categoryName: 'Desserts',
    preparationTime: 5,
    dietary: { isVegetarian: true, isVegan: true, isSpicy: false },
    tags: { isNew: false, isPopular: true, isChefSpecial: false },
    allergens: ['sesame'],
    isActive: true
  },

  // BOISSONS
  {
    name: {
      fr: 'Thé Thaï Glacé',
      en: 'Thai Iced Tea',
      th: 'ชาไทยเย็น',
      ru: 'Холодный тайский чай',
      de: 'Eisiger thailändischer Tee'
    },
    description: {
      fr: 'Thé noir épicé au lait concentré sucré, servi sur glace',
      en: 'Spiced black tea with sweet condensed milk, served over ice',
      th: 'ชาดำเครื่องเทศ นมข้นหวาน เสิร์ฟเย็น',
      ru: 'Пряный черный чай со сладким сгущенным молоком, подается со льдом',
      de: 'Gewürzter schwarzer Tee mit süßer Kondensmilch, über Eis serviert'
    },
    price: { amount: 60, currency: 'THB' },
    categoryName: 'Boissons',
    preparationTime: 3,
    dietary: { isVegetarian: true, isVegan: false, isSpicy: false },
    tags: { isNew: false, isPopular: true, isChefSpecial: false },
    allergens: ['milk'],
    isActive: true
  },
  {
    name: {
      fr: 'Cocktail Tropical',
      en: 'Tropical Cocktail',
      th: 'ค็อกเทลเขตร้อน',
      ru: 'Тропический коктейль',
      de: 'Tropischer Cocktail'
    },
    description: {
      fr: 'Mélange de fruits tropicaux frais, rhum blanc, sirop de coco',
      en: 'Fresh tropical fruit mix, white rum, coconut syrup',
      th: 'ผลไม้เขตร้อนสด รัม ไซรัปมะพร้าว',
      ru: 'Смесь свежих тропических фруктов, белый ром, кокосовый сироп',
      de: 'Frische tropische Früchtemischung, weißer Rum, Kokossirup'
    },
    price: { amount: 180, currency: 'THB' },
    categoryName: 'Boissons',
    preparationTime: 5,
    dietary: { isVegetarian: true, isVegan: true, isSpicy: false },
    tags: { isNew: true, isPopular: false, isChefSpecial: false },
    allergens: ['alcohol'],
    isActive: true
  }
];

// Fonction de seeding
async function seedDatabase() {
  try {
    console.log('🌱 Début du seeding de la base de données...');
    
    // Connexion à la base de données
    await connectDatabase();
    console.log('✅ Connexion à MongoDB établie');

    // Nettoyer les données existantes
    console.log('🧹 Nettoyage des données existantes...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Dish.deleteMany({});
    await MenuAnalytics.deleteMany({});
    console.log('✅ Données nettoyées');

    // 1. Créer un utilisateur admin
    console.log('👤 Création de l\'utilisateur admin...');
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const adminUser = new User({
      name: 'Administrateur Restaurant',
      email: 'admin@restaurant-patong.com',
      password: hashedPassword,
      role: 'admin',
      language: 'fr',
      isActive: true
    });
    await adminUser.save();
    console.log('✅ Utilisateur admin créé: admin@restaurant-patong.com / admin123');

    // 2. Créer les catégories
    console.log('📂 Création des catégories...');
    const savedCategories = [];
    for (const categoryData of categoriesData) {
      const category = new Category(categoryData);
      const savedCategory = await category.save();
      savedCategories.push(savedCategory);
      console.log(`  ✅ ${categoryData.name.fr} créée`);
    }

    // 3. Créer les plats
    console.log('🍽️ Création des plats...');
    const savedDishes = [];
    for (const dishData of dishesData) {
      // Trouver la catégorie correspondante
      const category = savedCategories.find(cat => 
        cat.name.fr === dishData.categoryName
      );
      
      if (category) {
        const dish = new Dish({
          ...dishData,
          category: category._id
        });
        delete dish.categoryName; // Supprimer le champ temporaire
        const savedDish = await dish.save();
        savedDishes.push(savedDish);
        console.log(`  ✅ ${dishData.name.fr} créé`);
      }
    }

    // 4. Créer quelques données analytics de simulation
    console.log('📊 Création des données analytics...');
    const languages = ['fr', 'en', 'th', 'ru', 'de'];
    const actions = ['view', 'detail_view', 'search', 'favorite'];
    
    // Générer 100 entrées analytics pour les 7 derniers jours
    for (let i = 0; i < 100; i++) {
      const randomDish = savedDishes[Math.floor(Math.random() * savedDishes.length)];
      const randomLanguage = languages[Math.floor(Math.random() * languages.length)];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      
      // Date aléatoire dans les 7 derniers jours
      const randomDate = new Date();
      randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 7));
      
      const analytics = new MenuAnalytics({
        dishId: randomDish._id,
        action: randomAction,
        language: randomLanguage,
        sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: randomDate,
        dayOfWeek: randomDate.getDay(),
        hourOfDay: randomDate.getHours(),
        deviceType: Math.random() > 0.8 ? 'tablet' : 'mobile',
        viewDuration: randomAction.includes('view') ? Math.floor(Math.random() * 300) + 10 : undefined
      });
      
      await analytics.save();
    }
    console.log('✅ 100 entrées analytics créées');

    console.log('\n🎉 SEEDING TERMINÉ AVEC SUCCÈS !');
    console.log('\n📋 RÉSUMÉ :');
    console.log(`   👤 1 utilisateur admin`);
    console.log(`   📂 ${savedCategories.length} catégories`);
    console.log(`   🍽️ ${savedDishes.length} plats`);
    console.log(`   📊 100 entrées analytics`);
    
    console.log('\n🔐 CONNEXION ADMIN :');
    console.log('   Email: admin@restaurant-patong.com');
    console.log('   Mot de passe: admin123');
    
    console.log('\n🌐 TESTEZ LE SYSTÈME :');
    console.log('   Menu client: http://localhost:3000');
    console.log('   Admin: http://localhost:3002');
    console.log('   Analytics: http://localhost:3002/analytics');

  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
  } finally {
    // Fermer la connexion
    await mongoose.connection.close();
    console.log('🔌 Connexion MongoDB fermée');
    process.exit(0);
  }
}

// Exécuter le seeding si le script est appelé directement
if (require.main === module) {
  seedDatabase();
}

export { seedDatabase };