import React from 'react';
import styles from './TaskItem.module.css';

const TaskItem = ({ task, onComplete, onEdit, onDelete }) => {
  return (
    <div className={`${styles.taskItem} ${task.completed ? styles.completed : ''}`}>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <p>Prioridad: {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</p>
      <p>Fecha de vencimiento: {task.dueDate}</p>
      <div className={styles.actions}>
        {!task.completed && (
          <button onClick={() => onComplete(task.id)} className={styles.completeButton}>
            Completar
          </button>
        )}
        <button onClick={() => onEdit(task)} className={styles.editButton}>
          Editar
        </button>
        <button onClick={() => onDelete(task.id)} className={styles.deleteButton}>
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
