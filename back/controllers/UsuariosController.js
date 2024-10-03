import pool from '../config.js';

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
        // Verificar si la tarea ya existe
        const [existingTasks] = await pool.query(
            "SELECT * FROM usuario WHERE id_usuario=?",
            [id_usuario]
        );
    
        if (existingTasks.length > 0) {
            return res.status(400).json({ error: 'El usuario esta cargado.' });
        }
    
        // Insertar la nueva tarea
        const [result] = await pool.query(
            "INSERT INTO usuario (id_usuario, nombre, email, password, fecha_creacion ) VALUES (?, ?, ?, ?, ?)",
            [id_usuario, nombre, email, password, fecha_creacion]
        );
    
        res.json({
            id_usuario,
            nombre,
            email,
            password,
            fecha_creacion,
        });
        } catch (error) {
        console.error(error);
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
            
   
};



  
export default  UsuariosController;
