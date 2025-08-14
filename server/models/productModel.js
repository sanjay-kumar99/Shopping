import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter product name']
  },
  description: {
    type: String,
    required: [true, 'Please enter product description']
  },
  price: {
    type: Number,
    required: [true, 'Please enter product price'],
    default: 0
  },
  image: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    required: [true, 'Please select category']
  },
  brand: {
    type: String,
    default: ''
  },
  countInStock: {
    type: Number,
    required: [true, 'Please enter stock quantity'],
    default: 0
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);
export default Product;
