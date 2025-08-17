// Script d'initialisation MongoDB pour Restaurant Patong
db = db.getSiblingDB('restaurant-patong');

// Créer un utilisateur admin par défaut
db.users.insertOne({
  email: 'admin@restaurant-patong.com',
  password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewA4DouxHyxTgQqe', // password: admin123
  name: 'Administrator',
  role: 'admin',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

// Créer des catégories d'exemple
db.categories.insertMany([
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
      th: 'อาหารเรียกน้ำย่อยอร่อยเพื่อเริ่มมื้ออาหาร',
      ru: 'Вкусные закуски для начала трапезы',
      de: 'Köstliche Vorspeisen für den Beginn Ihrer Mahlzeit'
    },
    order: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
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
      fr: 'Nos spécialités thaïlandaises et internationales',
      en: 'Our Thai and international specialties',
      th: 'อาหารพิเศษไทยและนานาชาติของเรา',
      ru: 'Наши тайские и международные блюда',
      de: 'Unsere thailändischen und internationalen Spezialitäten'
    },
    order: 2,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

console.log('Base de données Restaurant Patong initialisée avec succès!');