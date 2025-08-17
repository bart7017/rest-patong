import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

app.use(express.json());

// Routes de test sans base de données
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend fonctionne !',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/categories', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        _id: '1',
        name: {
          fr: 'Entrées',
          en: 'Appetizers', 
          th: 'อาหารเรียกน้ำย่อย',
          ru: 'Закуски',
          de: 'Vorspeisen'
        },
        isActive: true
      },
      {
        _id: '2',
        name: {
          fr: 'Plats Principaux',
          en: 'Main Courses',
          th: 'อาหารจานหลัก', 
          ru: 'Основные блюда',
          de: 'Hauptgerichte'
        },
        isActive: true
      }
    ]
  });
});

app.get('/api/menu', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        _id: '1',
        name: {
          fr: 'Pad Thaï aux Crevettes',
          en: 'Shrimp Pad Thai',
          th: 'ผัดไทยกุ้ง',
          ru: 'Пад Тай с креветками',
          de: 'Garnelen Pad Thai'
        },
        description: {
          fr: 'Nouilles de riz sautées aux crevettes fraîches',
          en: 'Stir-fried rice noodles with fresh shrimp',
          th: 'เส้นหมี่ผัดกับกุ้งสด',
          ru: 'Жареная рисовая лапша со свежими креветками',
          de: 'Gebratene Reisnudeln mit frischen Garnelen'
        },
        price: 350,
        category: '2',
        images: ['https://via.placeholder.com/400x300?text=Pad+Thai'],
        availability: { isAvailable: true },
        dietaryInfo: { isSpicy: true, isVegan: false },
        tags: { isPopular: true }
      }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend de test sur http://localhost:${PORT}`);
  console.log(`📱 Test: http://localhost:${PORT}/health`);
});