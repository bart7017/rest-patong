import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: {
    fr: string;
    en: string;
    th: string;
  };
  description?: {
    fr: string;
    en: string;
    th: string;
  };
  image?: string;
  cloudinaryId?: string;
  order: number;
  isActive: boolean;
}

const multilingualTextSchema = {
  fr: { type: String, required: true },
  en: { type: String, required: true },
  th: { type: String, required: true },
  ru: { type: String, required: true },
  de: { type: String, required: true }
};

const categorySchema = new Schema<ICategory>({
  name: multilingualTextSchema,
  description: {
    fr: String,
    en: String,
    th: String,
    ru: String,
    de: String
  },
  image: String,
  cloudinaryId: String,
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

categorySchema.index({ order: 1 });
categorySchema.index({ isActive: 1 });

export default mongoose.model<ICategory>('Category', categorySchema);