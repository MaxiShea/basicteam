import express from 'express';
import TareasController from '../controllers/TareasController.js';

const router = express.Router();

router.post('/crearTareas', TareasController.crearTarea);
router.get('/leerTareas', TareasController.leerTareas);
router.delete('/borrarTareas', TareasController.borrarTareas);
router.put("/actualizarTarea", TareasController.actualizarTarea);
router.put("/actualizarEstadoTarea",TareasController.actualizarEstadoTarea);
export default router;