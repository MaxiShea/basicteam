// src/components/Filter/Filter.js
import React, { useState } from 'react';
import styles from './Filter.module.css';

const Filter = ({ onFilterChange }) => {
  const [status, setStatus] = useState('todas');
  const [priority, setPriority] = useState('todas');

  const handleFilterChange = () => {
    onFilterChange({ status, priority });
  };

  return (
    <div className={styles.filter}>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className={styles.select}
      >
        <option value="todas">Todas</option>
        <option value="completadas">Completadas</option>
        <option value="pendientes">Pendientes</option>
      </select>
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className={styles.select}
      >
        <option value="todas">Todas</option>
        <option value="baja">Baja</option>
        <option value="media">Media</option>
        <option value="alta">Alta</option>
      </select>
      <button onClick={handleFilterChange} className={styles.button}>
        Aplicar Filtro
      </button>
    </div>
  );
};

export default Filter;
