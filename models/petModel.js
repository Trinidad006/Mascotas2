import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  superPower: { type: String, required: true },
  ownerId: { type: String, required: true }, // _id de MongoDB del usuario
  personalidad: { type: String, enum: ['normal', 'perezosa', 'juguetona', 'triste', 'enojona'], default: 'normal' },
  felicidad: { type: Number, default: 100 },
  sueno: { type: Number, default: 0 },
  hambre: { type: Number, default: 0 },
  limpieza: { type: Number, default: 100 },
  salud: { type: Number, default: 100 },
  isDead: { type: Boolean, default: false }
});

const Pet = mongoose.model('Pet', petSchema);
export default Pet; 