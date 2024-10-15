// Profile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Profile.module.css';

const Profile = ({ user }) => {
  const [nombre, setNombre] = useState(user.nombre);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:4000/usuarios/${user.id_usuario}`, {
        nombre,
        email,
        password
      });
      if (response.data.success) {
        alert("Perfil actualizado exitosamente");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      alert("Hubo un problema al actualizar el perfil.");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:4000/usuarios/${user.id_usuario}`);
      if (response.data.success) {
        alert("Perfil eliminado exitosamente");
        // Aquí podrías hacer un logout y redirigir al usuario
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error al eliminar el perfil:", error);
      alert("Hubo un problema al eliminar el perfil.");
    }
  };

  return (
    <div className={styles['profile-container']}>
      <h2 className={styles['profile-header']}>Actualizar Perfil</h2>
      <form onSubmit={handleUpdate}>
        <div className={styles['profile-section']}>
          <label className={styles['profile-section']}>Nombre:</label>
          <input 
            type="text" 
            value={nombre} 
            onChange={(e) => setNombre(e.target.value)} 
            className={styles['profile-section']}
          />
        </div>
        <div className={styles['profile-section']}>
          <label className={styles['profile-section']}>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className={styles['profile-section']}
          />
        </div>
        <div className={styles['profile-section']}>
          <label className={styles['profile-section']}>Contraseña:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className={styles['profile-section']}
          />
        </div>
        <div className={styles['profile-actions']}>
          <button type="submit">Actualizar</button>
          <button 
            onClick={handleDelete} 
            className={styles['delete-btn']}
          >
            Eliminar Perfil
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
