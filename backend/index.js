import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRoutes from './routes/userRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import cors from 'cors'
import path from 'path'

dotenv.config();
const app = express();

const __dirname = path.resolve()

app.use(express.json());
app.use(cors());

// ✅ Najpierw definiujemy API!
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// ✅ Dopiero na końcu obsługujemy pliki statyczne!
app.use(express.static(path.join(__dirname, '/frontend/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'))
});

// 🔥 Połącz z MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Połączono z MongoDB'))
  .catch((err) => console.log('Błąd połączenia z MongoDB:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
