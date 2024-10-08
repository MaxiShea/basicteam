import React, { useState } from 'react';
import axios from 'axios'; // Importa axios para hacer solicitudes HTTP
import styles from './LoginSignup.module.css'; // Importa el módulo CSS
import { useNavigate } from 'react-router-dom'; // Para la navegación entre rutas

import user_icon from '../Assets/user.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';

const LoginSignup = () => {
    const [action, setAction] = useState("Login"); // Modo de acción, ya sea Login o Sign Up
    const [email, setEmail] = useState(""); // Estado para el email
    const [password, setPassword] = useState(""); // Estado para la contraseña
    const [name, setName] = useState(""); // Estado para el nombre (solo usado en Sign Up)
    const navigate = useNavigate(); // Para redirigir al usuario después de login o registro

    // Manejo del envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (action === "Login") {
                // Lógica de autenticación (inicio de sesión)
                const response = await axios.post("http://localhost:3000/clientes/clientes/login", {
                    correoElectronico: email,
                    contrasenia: password,
                });

                const data = response.data;
                if (data.success) {
                    alert("Inicio de sesión exitoso");
                    navigate('/app'); // Redirige a la página principal de la aplicación
                } else {
                    alert(data.message || "Error de autenticación");
                }
            } else if (action === "Sign Up") {
                // Lógica de registro
                const response = await axios.post("http://localhost:3000/crearUsuario", {
                    nombre: name,
                    email: email,
                    password: password,
                    fecha_creacion: new Date(), // Envía la fecha actual
                });

                const data = response.data;
                if (data.success) {
                    alert("Registro exitoso");
                    setAction("Login"); // Cambia a modo login después de registrarse
                } else {
                    alert(data.error || "Error al registrarse");
                }
            }
        } catch (error) {
            console.error("Error en la autenticación:", error);
            alert("Ocurrió un error. Inténtelo de nuevo.");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.text}>{action}</div>
                <div className={styles.underline}></div>
            </div>
            <form onSubmit={handleSubmit} className={styles.inputs}>
                {action === "Sign Up" && (
                    <div className={styles.input}>
                        <img src={user_icon} alt='User Icon' />
                        <input
                            type='text'
                            placeholder='Name'
                            value={name}
                            onChange={(e) => setName(e.target.value)} // Actualiza el estado del nombre
                            required
                        />
                    </div>
                )}

                <div className={styles.input}>
                    <img src={email_icon} alt='Email Icon' />
                    <input
                        type='email'
                        placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} // Actualiza el estado del email
                        required
                    />
                </div>

                <div className={styles.input}>
                    <img src={password_icon} alt='Password Icon' />
                    <input
                        type='password'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // Actualiza el estado de la contraseña
                        required
                    />
                </div>

                {action === "Login" && (
                    <div className={styles.forgotPassword}>
                        Lost Password?<span> Click Here!</span>
                    </div>
                )}

                <div className={styles.submitContainer}>
                    <button
                        type="button"
                        className={`${styles.submit} ${action === "Sign Up" ? styles.gray : ""}`}
                        onClick={() => setAction("Sign Up")}
                    >
                        Sign Up
                    </button>
                    <button
                        type="button"
                        className={`${styles.submit} ${action === "Login" ? styles.gray : ""}`}
                        onClick={() => setAction("Login")}
                    >
                        Login
                    </button>
                </div>

                {/* Botón para enviar el formulario */}
                <div className={styles.submitContainer}>
                    <button type="submit" className={styles.submit}>
                        {action === "Login" ? "Iniciar Seción" : "Registrarse"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LoginSignup;
