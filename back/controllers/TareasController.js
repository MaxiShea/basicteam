import pool from '../config.js';

const TareasController = {

    leerTareas: async (req, res) => {
        try {
          const [rows] = await pool.query('SELECT * FROM tareas');
          res.json(rows);
        } catch (error) {
          console.error('Error al obtener los usuarios:', error);
          res.status(500).json({ error: 'Error al obtener los usuarios' });
          
        }
      },

    borrarTareas: async (req, res) => {
        const { id_tarea } = req.body;
        try {
            // Verificar si el usuario existe
            const [tarea] = await pool.query(
                "SELECT * FROM tareas WHERE id_tarea=?",
                [id_tarea]
            );

            if (tarea.length === 0) {
                return res.status(404).json({ error: 'La tarea no existe' });
            }        
            const [result] = await pool.query(
                "DELETE FROM tareas WHERE id_tarea=?",
                [id_tarea]
            )
            return res.status(200).json({ message: 'Tarea eliminada exitosamente' });
        }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Error al borrar la tarea.' });
                }
    },

    crearTarea: async (req, res) => {
        const { descripcion_tarea, id_lista, fecha_creacion, fecha_vencimiento, prioridad, etiquetas, estado } = req.body;
        
        try {
        // Verificar si la tarea ya existe
        const [existingTasks] = await pool.query(
            "SELECT * FROM tareas WHERE descripcion_tarea=? AND id_lista=? AND fecha_creacion=?",
            [descripcion_tarea, id_lista, fecha_creacion]
        );
    
        if (existingTasks.length > 0) {
            return res.status(400).json({ error: 'La tarea ya está cargada.' });
        }
    
        // Insertar la nueva tarea
        const [result] = await pool.query(
            "INSERT INTO tareas (descripcion_tarea, id_lista, fecha_creacion, fecha_vencimiento, prioridad, etiquetas, estado) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [descripcion_tarea, id_lista, fecha_creacion, fecha_vencimiento, prioridad, etiquetas, estado]
        );
    
        res.json({
            id: result.insertId,
            descripcion_tarea,
            id_lista,
            fecha_creacion,
            fecha_vencimiento,
            prioridad,
            etiquetas,
            estado
        });
        } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear la tarea.' });
        }
    },

    actualizarTarea: async (req, res) => {
        const { id_tarea, descripcion_tarea, prioridad, etiquetas } = req.body;
    
        try {
            // Verificar si la tarea existe
            let [[tarea]] = await pool.query('SELECT * FROM tareas WHERE id_tarea = ?', [id_tarea]);
            if (!tarea) {
                return res.status(404).json({ error: 'Tarea no encontrada' });
            }
    
            // Actualizar la tarea
            await pool.query("UPDATE tareas SET descripcion_tarea=?, prioridad=?, etiquetas=?, estado=? WHERE id_tarea=?", [descripcion_tarea, prioridad, etiquetas, estado, id_tarea]);
    
            // Respuesta con los datos actualizados
            res.json({
                id_tarea,
                descripcion_tarea,
                prioridad,
                etiquetas, 
                estado
            });
    
        } catch (error) {
            console.error('Error al actualizar la tarea:', error);
            res.status(500).json({ mensaje: "Error al actualizar la tarea" });
        }
    },
    actualizarEstadoTarea: async (req, res) => {
        const estadoReclamo = {
            0: "En curso",
            1: "Completado",
          };

        const { id_tarea,  estado } = req.body;
        const estadoNumerico = parseInt(estado, 10);
      

        if (!estadoReclamo[estadoNumerico]) {
          return res.status(400).json({ error: "El estado proporcionado no es válido. Debe ser un número entre 0 y 1." });
        }
        console.log(estadoReclamo[estadoNumerico]);
    
        try {

            // Verificar si la tarea existe
            let [[tarea]] = await pool.query('SELECT * FROM tareas WHERE id_tarea = ?', [id_tarea]);
            if (!tarea) {
                return res.status(404).json({ error: 'Tarea no encontrada' });
            }
    
            // Actualizar la tarea
            await pool.query("UPDATE tareas SET estado=? WHERE id_tarea=?", [estado, id_tarea]);
    
            // Respuesta con los datos actualizados
            res.json({
                id_tarea,
                estado
            });
    
        } catch (error) {
            console.error('Error al actualizar la tarea:', error);
            res.status(500).json({ mensaje: "Error al actualizar la tarea" });}
    
        }
    }

   
  
export default  TareasController;
