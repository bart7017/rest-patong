import mongoose, { Schema, Document } from 'mongoose';

interface IOrderItem {
  dish: mongoose.Types.ObjectId;
  dishSnapshot: {
    name: {
      fr: string;
      en: string;
      th: string;
    };
    price: number;
  };
  quantity: number;
  notes?: string;
  price: number;
}

export interface IOrder extends Document {
  orderNumber: string;
  tableNumber?: string;
  items: IOrderItem[];
  totalAmount: number;
  currency: 'THB' | 'EUR' | 'USD';
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'cancelled';
  customerInfo?: {
    name?: string;
    phone?: string;
    email?: string;
  };
  notes?: string;
  language: 'fr' | 'en' | 'th';
  qrCodeId?: string;
  isPickup: boolean;
  estimatedTime?: number;
  servedAt?: Date;
}

const orderItemSchema = new Schema<IOrderItem>({
  dish: {
    type: Schema.Types.ObjectId,
    ref: 'Dish',
    required: true
  },
  dishSnapshot: {
    name: {
      fr: { type: String, required: true },
      en: { type: String, required: true },
      th: { type: String, required: true },
      ru: { type: String, required: true },
      de: { type: String, required: true }
    },
    price: { type: Number, required: true }
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  notes: String,
  price: {
    type: Number,
    required: true,
    min: 0
  }
});

const orderSchema = new Schema<IOrder>({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  tableNumber: String,
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    enum: ['THB', 'EUR', 'USD'],
    default: 'THB'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'served', 'cancelled'],
    default: 'pending'
  },
  customerInfo: {
    name: String,
    phone: String,
    email: String
  },
  notes: String,
  language: {
    type: String,
    enum: ['fr', 'en', 'th', 'ru', 'de'],
    default: 'en'
  },
  qrCodeId: String,
  isPickup: {
    type: Boolean,
    default: false
  },
  estimatedTime: Number,
  servedAt: Date
}, {
  timestamps: true
});

orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ tableNumber: 1 });
orderSchema.index({ createdAt: -1 });

orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const count = await mongoose.model('Order').countDocuments({
      createdAt: {
        $gte: new Date(today.setHours(0, 0, 0, 0)),
        $lt: new Date(today.setHours(23, 59, 59, 999))
      }
    });
    this.orderNumber = `PAT${dateStr}${(count + 1).toString().padStart(3, '0')}`;
  }
  next();
});

export default mongoose.model<IOrder>('Order', orderSchema);