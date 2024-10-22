import express from 'express';
import UsuariosController from '../controllers/UsuariosController.js';

const router = express.Router();

router.post('/login', UsuariosController.loginUsuario); 
router.post('/crearUsuario', UsuariosController.crearUsuario);
router.get('/obtenerUsuarios', UsuariosController.getAllsuarios);
router.delete('/borrarUsuario',UsuariosController.borrarUsuario);
router.put("/actualizarUsuario/:id", UsuariosController.actualizarUsuario);
export default router;