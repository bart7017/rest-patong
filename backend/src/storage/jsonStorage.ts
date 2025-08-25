import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(__dirname, '../../data');
const DISHES_FILE = path.join(DATA_DIR, 'dishes.json');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');
const INGREDIENTS_FILE = path.join(DATA_DIR, 'ingredients.json');

// Données initiales
const initialDishes = [
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
    sideOptions: ['12', '13'],
    hasSauces: true,
    sauceOptions: ['16', '17'],
    includedSauces: ['15'],
    includedSaucesCount: 1,
    isActive: true,
    views: 23,
    order: 1,
    preparationTime: 15,
    createdAt: new Date(),
    updatedAt: new Date()
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
    customizableIngredients: ['1', '2', '3', '4'],
    hasExtras: false,
    extraIngredients: [],
    hasSides: false,
    sideOptions: [],
    hasSauces: false,
    sauceOptions: [],
    includedSauces: ['15'],
    includedSaucesCount: 1,
    isActive: true,
    views: 87,
    order: 2,
    preparationTime: 12,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '8',
    name: { fr: 'Burger Classique', en: 'Classic Burger', th: 'เบอร์เกอร์คลาสสิค', ru: 'Классический бургер', de: 'Klassischer Burger' },
    description: { fr: 'Burger beef avec salade, tomate, cornichons et sauce', en: 'Beef burger with lettuce, tomato, pickles and sauce', th: 'เบอร์เกอร์เนื้อกับผักสลัด มะเขือเทศ หัวไชเท้า และซอส', ru: 'Говяжий бургер с салатом, помидором, солеными огурцами и соусом', de: 'Rindfleisch-Burger mit Salat, Tomate, Gurken und Sauce' },
    category: '3',
    categoryName: 'Plats principaux',
    price: { amount: 250, currency: 'THB' },
    images: [],
    ingredients: ['2', '5', '6', '8'],
    tags: { isNew: false, isPopular: true, isChefSpecial: false, isSeasonal: false, isLimitedTime: false },
    dietary: { isVegetarian: false, isVegan: false, isSpicy: false, spicyLevel: 0 },
    allergens: { gluten: true, dairy: false, eggs: false, nuts: false, shellfish: false, soy: false, fish: false, peanuts: false },
    isCustomizable: false,
    customizableIngredients: [],
    hasExtras: true,
    extraIngredients: ['9', '10', '1', '4'],
    hasSides: true,
    sideOptions: ['11', '12', '13', '14'],
    hasSauces: true,
    sauceOptions: ['16', '17', '18', '19', '20', '21'],
    includedSauces: ['20'],
    includedSaucesCount: 1,
    isActive: true,
    views: 142,
    order: 3,
    preparationTime: 18,
    createdAt: new Date(),
    updatedAt: new Date()
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
    dishCount: 8,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '2',
    name: { fr: 'Soupes', en: 'Soups', th: 'ซุป', ru: 'Супы', de: 'Suppen' },
    description: { fr: 'Soupes traditionnelles thaï', en: 'Traditional Thai soups', th: 'ซุปไทยแบบดั้งเดิม', ru: 'Традиционные тайские супы', de: 'Traditionelle Thai-Suppen' },
    icon: '🍜',
    order: 2,
    isActive: true,
    dishCount: 6,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '3',
    name: { fr: 'Plats principaux', en: 'Main dishes', th: 'อาหารจานหลัก', ru: 'Основные блюда', de: 'Hauptgerichte' },
    description: { fr: 'Nos spécialités principales', en: 'Our main specialties', th: 'อาหารพิเศษหลักของเรา', ru: 'Наши основные деликатесы', de: 'Unsere Hauptspezialitäten' },
    icon: '🍛',
    order: 3,
    isActive: true,
    dishCount: 15,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '4',
    name: { fr: 'Desserts', en: 'Desserts', th: 'ของหวาน', ru: 'Десерты', de: 'Nachspeisen' },
    description: { fr: 'Desserts traditionnels thaï', en: 'Traditional Thai desserts', th: 'ของหวานไทยแบบดั้งเดิม', ru: 'Традиционные тайские десерты', de: 'Traditionelle Thai-Desserts' },
    icon: '🍨',
    order: 4,
    isActive: true,
    dishCount: 5,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const initialIngredients = [
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
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export class JsonStorage {
  static async ensureDataDir() {
    try {
      await fs.access(DATA_DIR);
    } catch {
      await fs.mkdir(DATA_DIR, { recursive: true });
    }
  }

  // Dishes
  static async getDishes() {
    try {
      await this.ensureDataDir();
      const data = await fs.readFile(DISHES_FILE, 'utf-8');
      return JSON.parse(data);
    } catch {
      await this.saveDishes(initialDishes);
      return initialDishes;
    }
  }

  static async saveDishes(dishes: any[]) {
    await this.ensureDataDir();
    await fs.writeFile(DISHES_FILE, JSON.stringify(dishes, null, 2));
  }

  static async getDish(id: string) {
    const dishes = await this.getDishes();
    return dishes.find((dish: any) => dish._id === id);
  }

  static async createDish(dishData: any) {
    const dishes = await this.getDishes();
    const newDish = {
      _id: Date.now().toString(),
      ...dishData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    dishes.push(newDish);
    await this.saveDishes(dishes);
    return newDish;
  }

  static async updateDish(id: string, updateData: any) {
    const dishes = await this.getDishes();
    const index = dishes.findIndex((dish: any) => dish._id === id);
    if (index === -1) throw new Error('Dish not found');
    
    dishes[index] = {
      ...dishes[index],
      ...updateData,
      updatedAt: new Date()
    };
    await this.saveDishes(dishes);
    return dishes[index];
  }

  static async deleteDish(id: string) {
    const dishes = await this.getDishes();
    const filteredDishes = dishes.filter((dish: any) => dish._id !== id);
    await this.saveDishes(filteredDishes);
  }

  // Categories
  static async getCategories() {
    try {
      await this.ensureDataDir();
      const data = await fs.readFile(CATEGORIES_FILE, 'utf-8');
      return JSON.parse(data);
    } catch {
      await this.saveCategories(initialCategories);
      return initialCategories;
    }
  }

  static async saveCategories(categories: any[]) {
    await this.ensureDataDir();
    await fs.writeFile(CATEGORIES_FILE, JSON.stringify(categories, null, 2));
  }

  static async getCategory(id: string) {
    const categories = await this.getCategories();
    return categories.find((category: any) => category._id === id);
  }

  static async createCategory(categoryData: any) {
    const categories = await this.getCategories();
    const newCategory = {
      _id: Date.now().toString(),
      ...categoryData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    categories.push(newCategory);
    await this.saveCategories(categories);
    return newCategory;
  }

  static async updateCategory(id: string, updateData: any) {
    const categories = await this.getCategories();
    const index = categories.findIndex((category: any) => category._id === id);
    if (index === -1) throw new Error('Category not found');
    
    categories[index] = {
      ...categories[index],
      ...updateData,
      updatedAt: new Date()
    };
    await this.saveCategories(categories);
    return categories[index];
  }

  static async deleteCategory(id: string) {
    const categories = await this.getCategories();
    const filteredCategories = categories.filter((category: any) => category._id !== id);
    await this.saveCategories(filteredCategories);
  }

  // Ingredients
  static async getIngredients() {
    try {
      await this.ensureDataDir();
      const data = await fs.readFile(INGREDIENTS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch {
      await this.saveIngredients(initialIngredients);
      return initialIngredients;
    }
  }

  static async saveIngredients(ingredients: any[]) {
    await this.ensureDataDir();
    await fs.writeFile(INGREDIENTS_FILE, JSON.stringify(ingredients, null, 2));
  }

  static async getIngredient(id: string) {
    const ingredients = await this.getIngredients();
    return ingredients.find((ingredient: any) => ingredient._id === id);
  }

  static async createIngredient(ingredientData: any) {
    const ingredients = await this.getIngredients();
    const newIngredient = {
      _id: Date.now().toString(),
      ...ingredientData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    ingredients.push(newIngredient);
    await this.saveIngredients(ingredients);
    return newIngredient;
  }

  static async updateIngredient(id: string, updateData: any) {
    const ingredients = await this.getIngredients();
    const index = ingredients.findIndex((ingredient: any) => ingredient._id === id);
    if (index === -1) throw new Error('Ingredient not found');
    
    ingredients[index] = {
      ...ingredients[index],
      ...updateData,
      updatedAt: new Date()
    };
    await this.saveIngredients(ingredients);
    return ingredients[index];
  }

  static async deleteIngredient(id: string) {
    const ingredients = await this.getIngredients();
    const filteredIngredients = ingredients.filter((ingredient: any) => ingredient._id !== id);
    await this.saveIngredients(filteredIngredients);
  }
}