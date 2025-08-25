export const initialDishes = [
  {
    _id: '6',
    name: { fr: 'French Tacos Signature', en: 'Signature French Tacos', th: 'เฟรนช์ทาโค่ซิกเนเจอร์', ru: 'Фирменный французский такос', de: 'Signature French Tacos' },
    description: { fr: 'Notre French Tacos signature avec poulet, frites, sauce fromagère', en: 'Our signature French Tacos with chicken, fries, cheese sauce', th: 'เฟรนช์ทาโค่ซิกเนเจอร์ของเรากับไก่ เฟรนช์ฟราย ซอสชีส', ru: 'Наш фирменный французский такос с курицей, картофелем фри и сырным соусом', de: 'Unser Signature French Tacos mit Hähnchen, Pommes, Käsesauce' },
    category: '3',
    categoryName: 'Plats principaux',
    price: { amount: 280, currency: 'THB' },
    images: [],
    ingredients: ['1', '11', '9'],
    tags: { isNew: true, isPopular: false, isChefSpecial: true, isSeasonal: false, isLimitedTime: false },
    dietary: { isVegetarian: false, isVegan: false, isSpicy: false, spicyLevel: 0 },
    allergens: { gluten: true, dairy: true, eggs: false, nuts: false, shellfish: false, soy: false, fish: false, peanuts: false },
    isCustomizable: false,
    customizableIngredients: [],
    hasExtras: false,
    extraIngredients: [],
    hasSides: true,
    sideOptions: ['12', '13'],  // Purée, Pâtes
    hasSauces: true,
    sauceOptions: ['16', '17'],  // Sauce algérienne, Sauce blanche
    includedSauces: ['15'],  // Sauce fromagère
    includedSaucesCount: 1,
    isActive: true,
    views: 23,
    order: 1,
    preparationTime: 15
  },
  {
    _id: '7',
    name: { fr: 'French Tacos Personnalisable', en: 'Customizable French Tacos', th: 'เฟรนช์ทาโค่ปรับแต่งได้', ru: 'Настраиваемый французский такос', de: 'Anpassbare French Tacos' },
    description: { fr: 'Créez votre French Tacos sur mesure en choisissant vos ingrédients préférés', en: 'Create your custom French Tacos by choosing your favorite ingredients', th: 'สร้างเฟรนช์ทาโค่ของคุณเองโดยเลือกส่วนผสมที่คุณชอบ', ru: 'Создайте свой французский такос, выбрав любимые ингредиенты', de: 'Erstellen Sie Ihren French Tacos nach Wunsch mit Ihren Lieblingszutaten' },
    category: '3',
    categoryName: 'Plats principaux',
    price: { amount: 220, currency: 'THB' },
    images: [],
    ingredients: [],
    tags: { isNew: true, isPopular: true, isChefSpecial: false, isSeasonal: false, isLimitedTime: false },
    dietary: { isVegetarian: false, isVegan: false, isSpicy: false, spicyLevel: 0 },
    allergens: { gluten: true, dairy: false, eggs: false, nuts: false, shellfish: false, soy: false, fish: false, peanuts: false },
    isCustomizable: true,
    customizableIngredients: ['1', '2', '3', '4'],  // Poulet grillé, Steak haché, Cordon bleu, Merguez
    hasExtras: false,
    extraIngredients: [],
    hasSides: false,
    sideOptions: [],
    hasSauces: false,
    sauceOptions: [],
    includedSauces: ['15'],  // Sauce fromagère
    includedSaucesCount: 1,
    isActive: true,
    views: 87,
    order: 2,
    preparationTime: 12
  },
  {
    _id: '8',
    name: { fr: 'Burger Classique', en: 'Classic Burger', th: 'เบอร์เกอร์คลาสสิค', ru: 'Классический бургер', de: 'Klassischer Burger' },
    description: { fr: 'Burger beef avec salade, tomate, cornichons et sauce', en: 'Beef burger with lettuce, tomato, pickles and sauce', th: 'เบอร์เกอร์เนื้อกับผักสลัด มะเขือเทศ หัวไชเท้า และซอส', ru: 'Говяжий бургер с салатом, помидором, солеными огурцами и соусом', de: 'Rindfleisch-Burger mit Salat, Tomate, Gurken und Sauce' },
    category: '3',
    categoryName: 'Plats principaux',
    price: { amount: 250, currency: 'THB' },
    images: [],
    ingredients: ['2', '5', '6', '8'],  // Steak haché, Salade iceberg, Tomates, Cornichons
    tags: { isNew: false, isPopular: true, isChefSpecial: false, isSeasonal: false, isLimitedTime: false },
    dietary: { isVegetarian: false, isVegan: false, isSpicy: false, spicyLevel: 0 },
    allergens: { gluten: true, dairy: false, eggs: false, nuts: false, shellfish: false, soy: false, fish: false, peanuts: false },
    isCustomizable: false,
    customizableIngredients: [],
    hasExtras: true,
    extraIngredients: ['9', '10', '1', '4'],  // Fromage râpé, Fromage cheddar, Poulet, Merguez
    hasSides: true,
    sideOptions: ['11', '12', '13', '14'],  // Frites, Purée, Pâtes, Riz jasmin
    hasSauces: true,
    sauceOptions: ['16', '17', '18', '19', '20', '21'],  // Toutes les sauces excepté fromagère
    includedSauces: ['20'],  // Mayonnaise
    includedSaucesCount: 1,
    isActive: true,
    views: 142,
    order: 3,
    preparationTime: 18
  }
];

export const initialCategories = [
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
  },
  {
    _id: '5',
    name: { fr: 'Boissons', en: 'Beverages', th: 'เครื่องดื่ม', ru: 'Напитки', de: 'Getränke' },
    description: { fr: 'Boissons fraîches et chaudes', en: 'Fresh and hot beverages', th: 'เครื่องดื่มเย็นและร้อน', ru: 'Холодные и горячие напитки', de: 'Kalte und warme Getränke' },
    icon: '🥤',
    order: 5,
    isActive: false,
    dishCount: 12
  }
];

export const initialIngredients = [
  // Viandes
  {
    _id: '1',
    name: { fr: 'Poulet grillé', en: 'Grilled chicken', th: 'ไก่ย่าง', ru: 'Курица гриль', de: 'Gegrilltes Hähnchen' },
    description: { fr: 'Morceaux de poulet grillé', en: 'Grilled chicken pieces', th: 'ชิ้นไก่ย่าง', ru: 'Кусочки курицы гриль', de: 'Gegrillte Hähnchenstücke' },
    category: 'meat',
    price: { amount: 40, currency: 'THB' },
    isActive: true,
    allergens: {
      gluten: false,
      dairy: false,
      eggs: false,
      nuts: false,
      shellfish: false,
      soy: false,
      fish: false,
      peanuts: false,
    }
  },
  {
    _id: '2',
    name: { fr: 'Steak haché', en: 'Ground beef', th: 'เนื้อสับ', ru: 'Говяжий фарш', de: 'Rinderhack' },
    description: { fr: 'Steak de bœuf haché frais', en: 'Fresh ground beef patty', th: 'เนื้อวัวสับสด', ru: 'Свежий говяжий фарш', de: 'Frisches Rinderhack' },
    category: 'meat',
    price: { amount: 60, currency: 'THB' },
    isActive: true,
    allergens: {
      gluten: false,
      dairy: false,
      eggs: false,
      nuts: false,
      shellfish: false,
      soy: false,
      fish: false,
      peanuts: false,
    }
  },
  {
    _id: '3',
    name: { fr: 'Cordon bleu', en: 'Cordon bleu', th: 'คอร์ดองเบลอ', ru: 'Кордон блю', de: 'Cordon Bleu' },
    description: { fr: 'Escalope de poulet panée au jambon et fromage', en: 'Breaded chicken with ham and cheese', th: 'ไก่ชุบแป้งทอดกับแฮมและชีส', ru: 'Панированная курица с ветчиной и сыром', de: 'Paniertes Hähnchen mit Schinken und Käse' },
    category: 'meat',
    price: { amount: 70, currency: 'THB' },
    isActive: true,
    allergens: {
      gluten: true,
      dairy: true,
      eggs: true,
      nuts: false,
      shellfish: false,
      soy: false,
      fish: false,
      peanuts: false,
    }
  },
  {
    _id: '4',
    name: { fr: 'Merguez', en: 'Merguez sausage', th: 'ไส้กรอกเมอร์เกส', ru: 'Мергез', de: 'Merguez-Wurst' },
    description: { fr: 'Saucisse épicée d\'Afrique du Nord', en: 'Spicy North African sausage', th: 'ไส้กรอกเผ็ดแอฟริกาเหนือ', ru: 'Острая североафриканская колбаса', de: 'Scharfe nordafrikanische Wurst' },
    category: 'meat',
    price: { amount: 45, currency: 'THB' },
    isActive: true,
    allergens: {
      gluten: false,
      dairy: false,
      eggs: false,
      nuts: false,
      shellfish: false,
      soy: false,
      fish: false,
      peanuts: false,
    }
  },
  // Légumes
  {
    _id: '5',
    name: { fr: 'Salade iceberg', en: 'Iceberg lettuce', th: 'ผักสลัดไอซ์เบิร์ก', ru: 'Салат айсберг', de: 'Eisbergsalat' },
    description: { fr: 'Salade fraîche et croquante', en: 'Fresh and crispy lettuce', th: 'ผักสลัดสดและกรอบ', ru: 'Свежий хрустящий салат', de: 'Frischer knackiger Salat' },
    category: 'vegetable',
    price: { amount: 15, currency: 'THB' },
    isActive: true,
    allergens: {
      gluten: false,
      dairy: false,
      eggs: false,
      nuts: false,
      shellfish: false,
      soy: false,
      fish: false,
      peanuts: false,
    }
  },
  {
    _id: '6',
    name: { fr: 'Tomates', en: 'Tomatoes', th: 'มะเขือเทศ', ru: 'Помидоры', de: 'Tomaten' },
    description: { fr: 'Tomates fraîches en rondelles', en: 'Fresh sliced tomatoes', th: 'มะเขือเทศสดหั่นชิ้น', ru: 'Свежие нарезанные помидоры', de: 'Frische geschnittene Tomaten' },
    category: 'vegetable',
    price: { amount: 12, currency: 'THB' },
    isActive: true,
    allergens: {
      gluten: false,
      dairy: false,
      eggs: false,
      nuts: false,
      shellfish: false,
      soy: false,
      fish: false,
      peanuts: false,
    }
  },
  {
    _id: '7',
    name: { fr: 'Oignons', en: 'Onions', th: 'หัวหอม', ru: 'Лук', de: 'Zwiebeln' },
    description: { fr: 'Oignons frais émincés', en: 'Fresh sliced onions', th: 'หัวหอมสดหั่นบาง', ru: 'Свежий нарезанный лук', de: 'Frische geschnittene Zwiebeln' },
    category: 'vegetable',
    price: { amount: 10, currency: 'THB' },
    isActive: true,
    allergens: {
      gluten: false,
      dairy: false,
      eggs: false,
      nuts: false,
      shellfish: false,
      soy: false,
      fish: false,
      peanuts: false,
    }
  },
  {
    _id: '8',
    name: { fr: 'Cornichons', en: 'Pickles', th: 'ผักดองเปรี้ยว', ru: 'Соленые огурцы', de: 'Gewürzgurken' },
    description: { fr: 'Cornichons aigres-doux', en: 'Sweet and sour pickles', th: 'ผักดองรสเปรี้ยวหวาน', ru: 'Кисло-сладкие соленые огурцы', de: 'Süß-saure Gewürzgurken' },
    category: 'vegetable',
    price: { amount: 8, currency: 'THB' },
    isActive: true,
    allergens: {
      gluten: false,
      dairy: false,
      eggs: false,
      nuts: false,
      shellfish: false,
      soy: false,
      fish: false,
      peanuts: false,
    }
  },
  // Fromages
  {
    _id: '9',
    name: { fr: 'Fromage râpé', en: 'Grated cheese', th: 'ชีสขูด', ru: 'Тертый сыр', de: 'Geriebener Käse' },
    description: { fr: 'Mélange de fromages râpés', en: 'Mixed grated cheese', th: 'ชีสผสมขูด', ru: 'Смесь тертых сыров', de: 'Gemischter geriebener Käse' },
    category: 'dairy',
    price: { amount: 25, currency: 'THB' },
    isActive: true,
    allergens: {
      gluten: false,
      dairy: true,
      eggs: false,
      nuts: false,
      shellfish: false,
      soy: false,
      fish: false,
      peanuts: false,
    }
  },
  {
    _id: '10',
    name: { fr: 'Fromage cheddar', en: 'Cheddar cheese', th: 'ชีสเชดดาร์', ru: 'Сыр чеддер', de: 'Cheddar-Käse' },
    description: { fr: 'Tranche de cheddar fondu', en: 'Melted cheddar slice', th: 'ชีสเชดดาร์หลอมละลาย', ru: 'Расплавленный ломтик чеддера', de: 'Geschmolzene Cheddar-Scheibe' },
    category: 'dairy',
    price: { amount: 20, currency: 'THB' },
    isActive: true,
    allergens: {
      gluten: false,
      dairy: true,
      eggs: false,
      nuts: false,
      shellfish: false,
      soy: false,
      fish: false,
      peanuts: false,
    }
  },
  // Accompagnements
  {
    _id: '11',
    name: { fr: 'Frites', en: 'French fries', th: 'เฟรนช์ฟราย', ru: 'Картофель фри', de: 'Pommes frites' },
    description: { fr: 'Pommes de terre frites croustillantes', en: 'Crispy french fries', th: 'เฟรนช์ฟรายกรอบ', ru: 'Хрустящий картофель фри', de: 'Knusprige Pommes frites' },
    category: 'side',
    price: { amount: 30, currency: 'THB' },
    isActive: true,
    allergens: {
      gluten: false,
      dairy: false,
      eggs: false,
      nuts: false,
      shellfish: false,
      soy: false,
      fish: false,
      peanuts: false,
    }
  },
  {
    _id: '12',
    name: { fr: 'Purée de pomme de terre', en: 'Mashed potatoes', th: 'ข้าวต้มมันฝรั่ง', ru: 'Картофельное пюре', de: 'Kartoffelpüree' },
    description: { fr: 'Purée onctueuse au beurre', en: 'Creamy mashed potatoes with butter', th: 'ข้าวต้มมันฝรั่งครีมกับเนย', ru: 'Кремовое картофельное пюре с маслом', de: 'Cremiges Kartoffelpüree mit Butter' },
    category: 'side',
    price: { amount: 25, currency: 'THB' },
    isActive: true,
    allergens: {
      gluten: false,
      dairy: true,
      eggs: false,
      nuts: false,
      shellfish: false,
      soy: false,
      fish: false,
      peanuts: false,
    }
  },
  {
    _id: '13',
    name: { fr: 'Pâtes', en: 'Pasta', th: 'พาสต้า', ru: 'Паста', de: 'Pasta' },
    description: { fr: 'Pâtes italiennes al dente', en: 'Italian pasta al dente', th: 'พาสต้าอิตาเลียนอัลเดนเต้', ru: 'Итальянская паста аль денте', de: 'Italienische Pasta al dente' },
    category: 'side',
    price: { amount: 35, currency: 'THB' },
    isActive: true,
    allergens: {
      gluten: true,
      dairy: false,
      eggs: true,
      nuts: false,
      shellfish: false,
      soy: false,
      fish: false,
      peanuts: false,
    }
  },
  {
    _id: '14',
    name: { fr: 'Riz jasmin', en: 'Jasmine rice', th: 'ข้าวหอมมะลิ', ru: 'Жасминовый рис', de: 'Jasminreis' },
    description: { fr: 'Riz thaï parfumé', en: 'Fragrant Thai rice', th: 'ข้าวไทยหอม', ru: 'Ароматный тайский рис', de: 'Duftender Thai-Reis' },
    category: 'side',
    price: { amount: 20, currency: 'THB' },
    isActive: true,
    allergens: {
      gluten: false,
      dairy: false,
      eggs: false,
      nuts: false,
      shellfish: false,
      soy: false,
      fish: false,
      peanuts: false,
    }
  },
  // Sauces
  {
    _id: '15',
    name: { fr: 'Sauce fromagère', en: 'Cheese sauce', th: 'ซอสชีส', ru: 'Сырный соус', de: 'Käsesauce' },
    description: { fr: 'Sauce crémeuse au fromage', en: 'Creamy cheese sauce', th: 'ซอสครีมชีส', ru: 'Кремовый сырный соус', de: 'Cremige Käsesauce' },
    category: 'sauce',
    price: { amount: 15, currency: 'THB' },
    isActive: true,
    allergens: {
      gluten: false,
      dairy: true,
      eggs: false,
      nuts: false,
      shellfish: false,
      soy: false,
      fish: false,
      peanuts: false,
    }
  },
  {
    _id: '16',
    name: { fr: 'Sauce algérienne', en: 'Algerian sauce', th: 'ซอสแอลจีเรีย', ru: 'Алжирский соус', de: 'Algerische Sauce' },
    description: { fr: 'Sauce épicée algérienne', en: 'Spicy Algerian sauce', th: 'ซอสเผ็ดแอลจีเรีย', ru: 'Острый алжирский соус', de: 'Scharfe algerische Sauce' },
    category: 'sauce',
    price: { amount: 15, currency: 'THB' },
    isActive: true,
    allergens: {
      gluten: false,
      dairy: false,
      eggs: true,
      nuts: false,
      shellfish: false,
      soy: false,
      fish: false,
      peanuts: false,
    }
  },
  {
    _id: '17',
    name: { fr: 'Sauce blanche', en: 'White sauce', th: 'ซอสขาว', ru: 'Белый соус', de: 'Weiße Sauce' },
    description: { fr: 'Sauce blanche crémeuse', en: 'Creamy white sauce', th: 'ซอสขาวครีม', ru: 'Кремовый белый соус', de: 'Cremige weiße Sauce' },
    category: 'sauce',
    price: { amount: 12, currency: 'THB' },
    isActive: true,
    allergens: {
      gluten: false,
      dairy: true,
      eggs: false,
      nuts: false,
      shellfish: false,
      soy: false,
      fish: false,
      peanuts: false,
    }
  },
  {
    _id: '18',
    name: { fr: 'Sauce barbecue', en: 'BBQ sauce', th: 'ซอสบาร์บีคิว', ru: 'Соус барбекю', de: 'BBQ-Sauce' },
    description: { fr: 'Sauce barbecue fumée', en: 'Smoky BBQ sauce', th: 'ซอสบาร์บีคิวรสควัน', ru: 'Копченый соус барбекю', de: 'Rauchige BBQ-Sauce' },
    category: 'sauce',
    price: { amount: 12, currency: 'THB' },
    isActive: true,
    allergens: {
      gluten: false,
      dairy: false,
      eggs: false,
      nuts: false,
      shellfish: false,
      soy: true,
      fish: false,
      peanuts: false,
    }
  },
  {
    _id: '19',
    name: { fr: 'Sauce samouraï', en: 'Samurai sauce', th: 'ซอสซามูไร', ru: 'Соус самурай', de: 'Samurai-Sauce' },
    description: { fr: 'Sauce épicée à base de mayo', en: 'Spicy mayo-based sauce', th: 'ซอสเผ็ดจากมายองเนส', ru: 'Острый соус на основе майонеза', de: 'Scharfe Sauce auf Mayo-Basis' },
    category: 'sauce',
    price: { amount: 15, currency: 'THB' },
    isActive: true,
    allergens: {
      gluten: false,
      dairy: false,
      eggs: true,
      nuts: false,
      shellfish: false,
      soy: false,
      fish: false,
      peanuts: false,
    }
  },
  {
    _id: '20',
    name: { fr: 'Mayonnaise', en: 'Mayonnaise', th: 'มายองเนส', ru: 'Майонез', de: 'Mayonnaise' },
    description: { fr: 'Mayonnaise classique', en: 'Classic mayonnaise', th: 'มายองเนสคลาสสิค', ru: 'Классический майонез', de: 'Klassische Mayonnaise' },
    category: 'sauce',
    price: { amount: 10, currency: 'THB' },
    isActive: true,
    allergens: {
      gluten: false,
      dairy: false,
      eggs: true,
      nuts: false,
      shellfish: false,
      soy: false,
      fish: false,
      peanuts: false,
    }
  },
  {
    _id: '21',
    name: { fr: 'Ketchup', en: 'Ketchup', th: 'เคชัป', ru: 'Кетчуп', de: 'Ketchup' },
    description: { fr: 'Sauce tomate sucrée', en: 'Sweet tomato sauce', th: 'ซอสมะเขือเทศหวาน', ru: 'Сладкий томатный соус', de: 'Süße Tomatensauce' },
    category: 'sauce',
    price: { amount: 8, currency: 'THB' },
    isActive: true,
    allergens: {
      gluten: false,
      dairy: false,
      eggs: false,
      nuts: false,
      shellfish: false,
      soy: false,
      fish: false,
      peanuts: false,
    }
  }
];