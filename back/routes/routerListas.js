import express from 'express';
import ListasController from '../controllers/listaController.js';

const router = express.Router();
// Ruta para obtener todas las listas de un usuario
router.get('/usuario/:id_usuario', ListasController.obtenerListasPorUsuario);

// Ruta para crear una nueva lista
router.post('/', ListasController.crearLista);

// Ruta para actualizar una lista existente
router.put('/:id_lista', ListasController.actualizarLista);

// Ruta para eliminar una lista
router.delete('/:id_lista', ListasController.borrarLista);

export default router;
