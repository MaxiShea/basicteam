// src/components/TaskForm/TaskForm.js
import React, { useState, useEffect } from 'react';
import styles from './TaskForm.module.css';

const TaskForm = ({ onSave, editTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('baja');
  const [dueDate, setDueDate] = useState('');

  // Reiniciar el formulario si no hay tarea en edición
  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setDescription(editTask.description);
      setPriority(editTask.priority);
      setDueDate(editTask.dueDate);
    } else {
      resetForm();
    }
  }, [editTask]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTask = { title, description, priority, dueDate };
    onSave(newTask);


    resetForm();
  };


  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('baja');
    setDueDate('');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className={styles.input}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        className={styles.textarea}
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className={styles.select}
      >
        <option value="baja">Low</option>
        <option value="media">Medium</option>
        <option value="alta">High</option>
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
