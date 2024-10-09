import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import routerTareas from './routes/routerTareas.js';
import routerUsuarios from './routes/routerUsuarios.js';
import routerListas from './routes/routerListas.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// Middleware para analizar JSON
app.use(express.json());
app.use(morgan('dev'));

// Rutas
app.use('/tareas', routerTareas);
app.use('/usuarios', routerUsuarios);
app.use('/listas', routerListas);

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Error en el servidor');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});