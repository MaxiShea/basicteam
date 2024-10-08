import pool from '../config.js';
import bcrypt from 'bcrypt';

const UsuariosController = {

    getAllsuarios: async (req, res) => {
        try {
          const [rows] = await pool.query('SELECT * FROM usuario');
          res.json(rows);
        }catch (error) {
          console.error('Error al obtener los usuarios:', error);
          res.status(500).json({ error: 'Error al obtener los usuarios' });
        }
    },

    crearUsuario: async (req, res) => {
        const { id_usuario, nombre, email, password, fecha_creacion } = req.body;
    
        try {
            // Verificar si el usuario ya existe
            const [existingUsers] = await pool.query(
                "SELECT * FROM usuario WHERE email = ?",
                [email]
            );
    
            if (existingUsers.length > 0) {
                return res.status(400).json({ error: 'El usuario ya está registrado.' });
            }
    
            // Cifrar la contraseña antes de guardar
            const hashedPassword = await bcrypt.hash(password, 10); // 10 es el número de saltos (cost)
    
            // Insertar el nuevo usuario con la contraseña cifrada
            const [result] = await pool.query(
                "INSERT INTO usuario (id_usuario, nombre, email, password, fecha_creacion) VALUES (?, ?, ?, ?, ?)",
                [id_usuario, nombre, email, hashedPassword, fecha_creacion]
            );
    
            res.json({
                id_usuario,
                nombre,
                email,
                // No devuelvas la contraseña cifrada por razones de seguridad
                fecha_creacion,
                message: 'Usuario creado exitosamente.'
            });
        } catch (error) {
            console.error('Error al crear el usuario:', error);
            res.status(500).json({ error: 'Error al crear el usuario.' });
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
            
            loginUsuario: async (req, res) => {
                const { email, password } = req.body;
            
                try {
                    // Imprimir el email que estás buscando
                    console.log("Email ingresado:", email);
                    
                    // Buscar el usuario por email
                    const [usuarios] = await pool.query("SELECT * FROM usuario WHERE email = ?", [email]);
                    
                    // Imprimir el resultado de la consulta
                    console.log("Usuario encontrado:", usuarios);
            
                    if (usuarios.length === 0) {
                        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
                    }
            
                    const usuario = usuarios[0];
            
                    // Comparar las contraseñas
                    const isMatch = await bcrypt.compare(password, usuario.password);
            
                    if (!isMatch) {
                        return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
                    }
            
                    // Si la contraseña es correcta, retornar la respuesta exitosa
                    res.json({
                        success: true,
                        message: 'Inicio de sesión exitoso',
                        usuario: {
                            id_usuario: usuario.id_usuario,
                            nombre: usuario.nombre,
                            email: usuario.email,
                            // Puedes incluir más información del usuario si lo deseas
                        }
                    });
                } catch (error) {
                    console.error('Error al iniciar sesión:', error);
                    res.status(500).json({ success: false, message: 'Error en el servidor' });
                }
            }            
        
   
};




  
export default  UsuariosController;
