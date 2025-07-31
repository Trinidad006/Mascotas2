import express from 'express';
import connectDB from './config/db.js';
import { authenticateJWT, authorizeAdmin, authorizeSelfOrAdmin } from './middlewares/auth.js';
import * as userCtrl from './controllers/userControllers.js';
import * as petCtrl from './controllers/petControllers.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';

// Conectar a la base de datos
connectDB();

const app = express();
app.use(express.json());

// CORS global
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Swagger config
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Mascotas y Usuarios',
      version: '1.0.0',
      description: 'Documentación de la API de mascotas y usuarios (con JWT y lógica avanzada)'
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./index.js'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado
 *   get:
 *     summary: Listar todos los usuarios (solo admin)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
app.post('/users', userCtrl.register);
app.get('/users', authenticateJWT, authorizeAdmin, userCtrl.getAll);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Iniciar sesión (login)
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: JWT y datos del usuario
 */
app.post('/login', userCtrl.login);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obtener usuario por ID (admin o el propio usuario)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *   delete:
 *     summary: Eliminar usuario (admin o el propio usuario)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario eliminado
 */
app.get('/users/:id', authenticateJWT, authorizeSelfOrAdmin, userCtrl.getById);
app.delete('/users/:id', authenticateJWT, authorizeSelfOrAdmin, userCtrl.remove);

/**
 * @swagger
 * /pets:
 *   get:
 *     summary: Listar mascotas (admin ve todas, usuario solo las suyas)
 *     tags: [Mascotas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de mascotas
 *   post:
 *     summary: Crear mascota (requiere JWT)
 *     tags: [Mascotas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *               - superPower
 *               - personalidad
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *               superPower:
 *                 type: string
 *               personalidad:
 *                 type: string
 *                 enum: [normal, perezosa, juguetona, triste, enojona]
 *     responses:
 *       201:
 *         description: Mascota creada
 */
app.get('/pets', authenticateJWT, petCtrl.getAll);
app.post('/pets', authenticateJWT, petCtrl.create);

/**
 * @swagger
 * /pets/{id}:
 *   put:
 *     summary: Actualizar mascota (admin o dueño)
 *     tags: [Mascotas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *               superPower:
 *                 type: string
 *               personalidad:
 *                 type: string
 *                 enum: [normal, perezosa, juguetona, triste, enojona]
 *     responses:
 *       200:
 *         description: Mascota actualizada
 *   delete:
 *     summary: Eliminar mascota (admin o dueño)
 *     tags: [Mascotas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mascota eliminada
 */
app.put('/pets/:id', authenticateJWT, petCtrl.update);
app.delete('/pets/:id', authenticateJWT, petCtrl.remove);

/**
 * @swagger
 * /pets/{id}/dormir:
 *   post:
 *     summary: Dormir a la mascota
 *     tags: [Mascotas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mascota durmió
 */
app.post('/pets/:id/dormir', authenticateJWT, petCtrl.dormir);

/**
 * @swagger
 * /pets/{id}/jugar:
 *   post:
 *     summary: Jugar con la mascota
 *     tags: [Mascotas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mascota jugó
 */
app.post('/pets/:id/jugar', authenticateJWT, petCtrl.jugar);

/**
 * @swagger
 * /pets/{id}/alimentar:
 *   post:
 *     summary: Alimentar a la mascota
 *     tags: [Mascotas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mascota alimentada
 */
app.post('/pets/:id/alimentar', authenticateJWT, petCtrl.alimentar);

/**
 * @swagger
 * /pets/{id}/banar:
 *   post:
 *     summary: Bañar a la mascota
 *     tags: [Mascotas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mascota bañada
 */
app.post('/pets/:id/banar', authenticateJWT, petCtrl.banar);

/**
 * @swagger
 * /pets/{id}/acariciar:
 *   post:
 *     summary: Acariciar a la mascota
 *     tags: [Mascotas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mascota acariciada
 */
app.post('/pets/:id/acariciar', authenticateJWT, petCtrl.acariciar);

/**
 * @swagger
 * /pets/{id}/curar:
 *   post:
 *     summary: Curar a la mascota
 *     tags: [Mascotas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mascota curada
 */
app.post('/pets/:id/curar', authenticateJWT, petCtrl.curar);

/**
 * @swagger
 * /pets/{id}/vida:
 *   get:
 *     summary: Obtener el estado de vida de la mascota
 *     tags: [Mascotas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Estado de vida de la mascota
 */
app.get('/pets/:id/vida', authenticateJWT, petCtrl.vida);

// Servir archivos estáticos del frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// En desarrollo, redirigir al frontend
if (process.env.NODE_ENV !== 'production') {
  app.get('/', (req, res) => {
    res.redirect('http://localhost:5173');
  });
} else {
  // En producción, servir archivos estáticos
  const frontendPath = path.join(__dirname, 'frontend', 'dist');
  console.log('Frontend path:', frontendPath);
  
  // Servir archivos estáticos si existen
  app.use(express.static(frontendPath));
  
  // Para todas las rutas que no sean API, servir index.html
  app.get('*', (req, res) => {
    // Si es una ruta de API, continuar
    if (req.path.startsWith('/api') || req.path.startsWith('/users') || req.path.startsWith('/pets') || req.path.startsWith('/api-docs')) {
      return res.status(404).json({ error: 'Ruta no encontrada' });
    }
    
    // Si no es API, servir el frontend
    res.sendFile(path.join(frontendPath, 'index.html'), (err) => {
      if (err) {
        console.log('Error serving frontend:', err.message);
        res.json({ message: 'API de Mascotas Virtuales', docs: '/api-docs' });
      }
    });
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
}); 