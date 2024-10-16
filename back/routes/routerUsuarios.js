import express from 'express';
import UsuariosController, { verifyToken } from '../controllers/UsuariosController.js';

const router = express.Router();

// Ruta pública para iniciar sesión
router.post('/login', UsuariosController.loginUsuario); 

// Ruta pública para crear un nuevo usuario
router.post('/crearUsuario', UsuariosController.crearUsuario);

// Nueva ruta pública para verificar el token
router.get('/verifyToken', UsuariosController.verifyToken);

// Rutas protegidas (requiere autenticación)
router.get('/obtenerUsuarios', verifyToken, UsuariosController.getAllUsuarios);
router.delete('/borrarUsuario', verifyToken, UsuariosController.borrarUsuario);
router.put('/actualizarUsuario', verifyToken, UsuariosController.actualizarUsuario);

export default router;
