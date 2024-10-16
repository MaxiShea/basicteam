import pool from '../config.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'llave'

const UsuariosController = {

    verifyToken: (req, res) => {
        const token = req.headers['authorization']?.split(' ')[1]; // Obtener el token del encabezado Authorization
        console.log(token)
        
        if (!token) {
            return res.status(401).json({ error: 'No se proporcionó token de autenticación.' });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ error: 'Token inválido o expirado.' });
            }
            // Si el token es válido, devolver los datos del usuario decodificado
            res.json({
                success: true,
                usuario: {
                    id_usuario: decoded.id_usuario,
                    email: decoded.email
                }
            });
        });
    },
   
// Método para iniciar sesión y generar JWT
loginUsuario: async (req, res) => {
    const { email, password } = req.body;

    try {
        const [usuarios] = await pool.query("SELECT * FROM usuario WHERE email = ?", [email]);

        if (usuarios.length === 0) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        const usuario = usuarios[0];

        // Comparar las contraseñas
        const isMatch = await bcrypt.compare(password, usuario.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
        }

        // Generar el token JWT al iniciar sesión correctamente
        const token = jwt.sign(
            { id_usuario: usuario.id_usuario, nombre: usuario.nombre, email: usuario.email }, // Payload
            SECRET_KEY, // Llave secreta
            { expiresIn: '1h' } // Opciones (expiración en 1 hora)
        );

        // Enviar el token JWT al cliente junto con la respuesta
        res.json({
            success: true,
            message: 'Inicio de sesión exitoso',
            token, // Token JWT
            usuario: {
                id_usuario: usuario.id_usuario,
                nombre: usuario.nombre,
                email: usuario.email,
            }
        });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
},
// Método protegido para obtener todos los usuarios (requiere autenticación con JWT)
getAllUsuarios: async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM usuario');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
},

crearUsuario: async (req, res) => {
    const { nombre, email, password } = req.body; // Eliminar 'fecha_creacion' ya que se generará automáticamente

    try {
        // Verificar si el usuario ya existe
        const [existingUsers] = await pool.query(
            "SELECT * FROM usuario WHERE email = ?",
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ success: false, error: 'El usuario ya está registrado.' });
        }

        // Cifrar la contraseña antes de guardar
        const hashedPassword = await bcrypt.hash(password, 10); // 10 es el número de saltos (cost)

        // Insertar el nuevo usuario sin la fecha, que será generada automáticamente
        const [result] = await pool.query(
            "INSERT INTO usuario (nombre, email, password) VALUES (?, ?, ?)", // Sin 'fecha_creacion'
            [nombre, email, hashedPassword]
        );

        res.status(201).json({
            success: true, // Aquí se añade el campo success
            message: 'Usuario creado exitosamente.',
            usuario: { nombre, email }
        });
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        res.status(500).json({ success: false, error: 'Error al crear el usuario.' });
    }
},    

borrarUsuario: async (req, res) =>{
    const { id_usuario } = req.body;
    try {
        // Verificar si el usuario existe
        const [usuario] = await pool.query(
            "SELECT * FROM usuario WHERE id_usuario=?",
            [id_usuario]
        );

        if (usuario.length === 0) {
            return res.status(404).json({ error: 'El usuario no existe' });
        }        
        const [result] = await pool.query(
            "DELETE FROM usuario WHERE id_usuario=?",
            [id_usuario]
        )
        return res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al borrar el usuario.' });
            }
        },

actualizarUsuario: async (req, res) => {
        const { id_usuario, nombre, email, password } = req.body;
          try {
            if (!nombre || !email || !password) {
            return res.status(400).json({ error: 'Faltan datos requeridos' });
            }
    
            let [[user]] = await pool.query('SELECT * FROM usuario WHERE id_usuario = ?', [id_usuario]);
    
            if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado o está inactivo' });
            }
    
            if (password) { 
            await pool.query("UPDATE usuario SET nombre=?,email=?, password=? WHERE id_usuario=?", [nombre, email, password, id_usuario]);
            } else {
            // Si no hay nueva contraseña, se actualizan solo los demás campos
            await pool.query("UPDATE usuario SET nombre=?, email=? WHERE id_usuario=?", [nombre, email, id_usuario]);
            }
    
            res.json({
            id_usuario,
            nombre,
            email,
            password
            });
    
        }
        catch (error) {
            console.error('Error al actualizar el usuario:', error);
            res.status(500).json({ mensaje: "Error al actualizar el usuario" });
        }
        },
};
// Middleware para verificar el token JWT en rutas protegidas
export const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']; // Leer el token desde los headers (formato "Bearer <token>")

    if (!token) {
        return res.status(403).json({ success: false, message: 'Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token.split(" ")[1], SECRET_KEY); // Decodificar y verificar el token
        req.user = decoded; // Guardar la información del usuario decodificada en req.user
        next(); // Continuar con la siguiente función en la cadena de middlewares
    } catch (error) {
        console.error('Error al verificar el token:', error);
        res.status(401).json({ success: false, message: 'Token inválido o expirado' });
    }
};

export default UsuariosController;