import React from 'react';
import styles from './TaskHistory.module.css';

const TaskHistory = ({ history }) => {
  return (
    <div className={styles.history}>
      <h2>Historial de Cambios</h2>
      <ul>
        {history.map((change, index) => (
          <li key={index}>
            {change.date} - {change.action} por {change.user}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskHistory;

