require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const path = require('path');
const pug = require('pug');

// Routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const frameworkRoutes = require('./routes/frameworkRoutes');
const controlRoutes = require('./routes/controlRoutes');
const evidenceRoutes = require('./routes/evidenceRoutes');
const riskRoutes = require('./routes/riskRoutes');
const taskRoutes = require('./routes/taskRoutes');
const reportRoutes = require('./routes/reportRoutes');

// Middleware
const errorHandler = require('./middlewares/errorMiddleware');

// Config DB
const connectDB = require('./config/db');

// Initialisation de l'application
const app = express();

// Connexion à la base de données
connectDB();

// Configuration de Pug pour les templates
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware de sécurité
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// Limiteur de requêtes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limite chaque IP à 100 requêtes par fenêtre
});
app.use(limiter);

// Middleware pour parser le JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/frameworks', frameworkRoutes);
app.use('/api/controls', controlRoutes);
app.use('/api/evidence', evidenceRoutes);
app.use('/api/risks', riskRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/reports', reportRoutes);

// Route pour prévisualiser les emails (DEV ONLY)
if (process.env.NODE_ENV === 'development') {
  app.get('/preview-email/:template', (req, res) => {
    const template = req.params.template;
    res.render(`email/${template}`, {
      firstName: 'Test User',
      url: 'https://example.com/verification-link',
      subject: 'Email de test'
    });
  });
}

// Gestion des erreurs
app.use(errorHandler);

// Dossier statique pour les uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});