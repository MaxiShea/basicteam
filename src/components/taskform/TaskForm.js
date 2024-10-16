// src/components/taskform/TaskForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Importar Axios
import styles from './TaskForm.module.css';

const TaskForm = ({ onSave, editTask, jwtToken }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('baja'); // Asegúrate de que se inicialice
  const [dueDate, setDueDate] = useState('');

  // Reiniciar el formulario si no hay tarea en edición
  useEffect(() => {
    if (editTask) {
      setTitle(editTask.descripcion_tarea);
      setDescription(editTask.descripcion);
      setPriority(editTask.prioridad); // La prioridad se toma del editTask
      setDueDate(editTask.fecha_vencimiento);
    } else {
      resetForm();
    }
  }, [editTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTask = {
      descripcion_tarea: title,
      prioridad: priority, // Usa la variable definida aquí
      fecha_vencimiento: dueDate,
      // Otras propiedades que necesites (etiquetas, id_lista, etc.)
    };

    try {
      const response = await axios.post('http://localhost:4000/tareas/  crearTareas', newTask, {
        headers: {
          'Authorization': `Bearer ${jwtToken}` // Agrega el token JWT
        }
      });

      console.log('Tarea guardada:', response.data);
      onSave(response.data); // Llama a onSave con la nueva tarea guardada
      resetForm();
    } catch (error) {
      console.error('Error al guardar la tarea:', error);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('baja'); // Reiniciar prioridad a 'baja'
    setDueDate('');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className={styles.input}
      />
      <textarea
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        className={styles.textarea}
      />
      <select
        value={priority} // Asegúrate de que esté bien enlazado
        onChange={(e) => setPriority(e.target.value)}
        className={styles.select}
      >
        <option value="baja">Baja</option>
        <option value="media">Media</option>
        <option value="alta">Alta</option>
      </select>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className={styles.input}
      />
      <button type="submit" className={styles.button}>
        {editTask ? 'Guardar Cambios' : 'Guardar Tarea'}
      </button>
    </form>
  );
};

export default TaskForm;



