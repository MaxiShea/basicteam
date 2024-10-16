import express from 'express';
import TareasController from '../controllers/TareasController.js';
import authMiddleware from '../controllers/authMiddleware.js'; // Importar el middleware

const router = express.Router();

// Aplicar el middleware de autenticación a las rutas
router.use(authMiddleware); // Esto aplicará el middleware a todas las rutas en este router

router.post('/crearTareas', TareasController.crearTarea);
router.get('/leerTareas', TareasController.leerTareas);
router.delete('/borrarTareas', TareasController.borrarTareas);
router.put("/actualizarTarea", TareasController.actualizarTarea);
router.put("/actualizarEstadoTarea", TareasController.actualizarEstadoTarea);

export default router;