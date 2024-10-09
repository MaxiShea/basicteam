import pool from '../config.js';

const ListasController = {

    // Obtener todas las listas de un usuario
    obtenerListasPorUsuario: async (req, res) => {
        const { id_usuario } = req.params;
        try {
            const [rows] = await pool.query('SELECT * FROM lista_tareas WHERE id_usuario_creador = ?', [id_usuario]);
            if (rows.length === 0) {
                return res.status(404).json({ error: 'No se encontraron listas para este usuario.' });
            }
            res.json(rows);
        } catch (error) {
            console.error('Error al obtener las listas:', error);
            res.status(500).json({ error: 'Error al obtener las listas.' });
        }
    },

    // Crear una nueva lista
    crearLista: async (req, res) => {
        const { id_usuario_creador, nombre_lista, description, fecha_modificacion } = req.body;
        const fecha_creacion = new Date(); // Fecha de creación automática
        try {
            // Verificar si el usuario existe
            const [usuario] = await pool.query('SELECT * FROM usuario WHERE id_usuario = ?', [id_usuario_creador]);
            if (usuario.length === 0) {
                return res.status(400).json({ error: 'El usuario no existe.' });
            }

            // Insertar la nueva lista
            const [result] = await pool.query(
                'INSERT INTO lista_tareas (id_usuario_creador, nombre_lista, description, fecha_creacion, fecha_modificacion) VALUES (?, ?, ?, ?, ?)',
                [id_usuario_creador, nombre_lista, description, fecha_creacion, fecha_modificacion]
            );

            res.json({
                id_lista: result.insertId,
                id_usuario_creador,
                nombre_lista,
                description,
                fecha_creacion,
                fecha_modificacion
            });
        } catch (error) {
            console.error('Error al crear la lista:', error);
            res.status(500).json({ error: 'Error al crear la lista.' });
        }
    },

    // Actualizar una lista existente
    actualizarLista: async (req, res) => {
        const { id_lista } = req.params;
        const { nombre_lista, description, fecha_modificacion } = req.body;
 
        try {
            // Verificar si la lista existe
            const [lista] = await pool.query('SELECT * FROM lista_tareas WHERE id_lista = ?', [id_lista]);
            console.log(id_lista)
            if (lista.length === 0) {
                return res.status(404).json({ error: 'Lista no encontrada.' });
            }
            
            // Actualizar la lista
            await pool.query(
                'UPDATE lista_tareas SET nombre_lista = ?, description = ?, fecha_modificacion = ? WHERE id_lista = ?',
                [nombre_lista, description, fecha_modificacion, id_lista]
            );

            res.json({ message: 'Lista actualizada exitosamente.' });
        } catch (error) {
            console.error('Error al actualizar la lista:', error);
            res.status(500).json({ error: 'Error al actualizar la lista.' });
        }
    },

    // Eliminar una lista
    borrarLista: async (req, res) => {
        const { id_lista } = req.params;
        try {
            // Verificar si la lista existe
            const [lista] = await pool.query('SELECT * FROM lista_tareas WHERE id_lista = ?', [id_lista]);
            if (lista.length === 0) {
                return res.status(404).json({ error: 'Lista no encontrada.' });
            }

            // Eliminar la lista
            await pool.query('DELETE FROM lista_tareas WHERE id_lista = ?', [id_lista]);
            res.json({ message: 'Lista eliminada exitosamente.' });
        } catch (error) {
            console.error('Error al eliminar la lista:', error);
            res.status(500).json({ error: 'Error al eliminar la lista.' });
        }
    }
};

export default ListasController;
