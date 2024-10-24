// Profile.js
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import styles from './Profile.module.css';

const Profile = () => {
  /*const Profile = ({ user }) => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  */

  // Definimos el estado para almacenar los datos del usuario
  const [usuario, setUsuario] = useState(null); // Inicia en null mientras cargamos datos
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const id_usuario = '4'; // Aquí deberías usar el ID real del usuario, tal vez sacado del contexto o del estado global

    // Efecto para obtener los datos del usuario al cargar el componente
  useEffect(() => {
      const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/usuarios/obtenerUsuarios/${id_usuario}`); // Ajusta esta ruta a la que devuelva el usuario
                setUsuario(response.data.usuario);
                // Establece los datos del usuario en los estados locales
                setNombre(response.data.usuario.nombre);
                setEmail(response.data.usuario.email);
            } catch (error) {
                console.error('Error al obtener el usuario:', error);
            }
        };

        fetchUser();
    }, [id_usuario]); // Dependiendo de cómo estés manejando la ID del usuario

  //Maneja la actualizacion del perfil
  const handleUpdate = async (e) => {
    e.preventDefault();
    console.log("ID del usuario:", usuario.id_usuario);
    try {
      const response = await axios.put(`http://localhost:4000/usuarios/actualizarUsuario/${usuario.id_usuario}`, {
        nombre,
        email,
        password
    });
    
      /*const response = await axios.put(`http://localhost:3000/actualizarUsuario`, {
        id_usuario: user.id_usuario, // Asegúrate de que este valor esté definido
        nombre,
        email,
        password
      });*/

      if (response.data.success) {
        alert("Perfil actualizado exitosamente");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      console.log(error.response); 
      alert("Hubo un problema al actualizar el perfil.");
    }
  };

   // Si `user` no está definido, puedes mostrar un loader o un mensaje
   /*if (!usuario) {
    return <div>Cargando...</div>;
   }*/

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:4000/borrarUsuarios/${usuario.id_usuario}`);
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
