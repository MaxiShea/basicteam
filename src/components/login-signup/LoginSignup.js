    import React, { useState, useEffect } from 'react';
    import axios from 'axios'; 
    import styles from './LoginSignup.module.css'; 
    import { useNavigate } from 'react-router-dom'; 
    import user_icon from '../Assets/user.png';
    import email_icon from '../Assets/email.png';
    import password_icon from '../Assets/password.png';

    const LoginSignup = ({ onLogin }) => {
        const [action, setAction] = useState("Login"); 
        const [email, setEmail] = useState(""); 
        const [password, setPassword] = useState(""); 
        const [nombre, setNombre] = useState(""); 
        const navigate = useNavigate(); 

        useEffect(() => {
            // Verificar si ya hay un token en localStorage al cargar la página
            const token = localStorage.getItem('token');
            console.log('Token:', token);
            if (token) {
                verifyToken(token); // Llama a la función para validar el token
            }
        }, []);

        const verifyToken = async (token) => {
            try {
                const response = await axios.get('http://localhost:4000/usuarios/verifyToken', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
        
                const data = response.data;
                if (data.success) {
                    onLogin({ email: data.usuario.email, token });
                    navigate('/'); // Redirigir a la página principal
                } else {
                    console.warn('Token inválido:', data.message); // Agrega un log para más contexto
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            } catch (error) {
                console.error('Error verificando el token:', error.response ? error.response.data : error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        };
        

        const handleSubmit = async (e) => {
            e.preventDefault(); 

            try {
                if (action === "Login") {
                    // Autenticación (inicio de sesión)
                    const response = await axios.post("http://localhost:4000/usuarios/login", {
                        email: email,
                        password: password,
                    });

                    const data = response.data;
                    if (data.success) {
                        localStorage.setItem('token', data.token);
                        localStorage.setItem('user', JSON.stringify(data.usuario)); // Guarda el usuario en localStorage
                        onLogin({ email: data.usuario.email, token: data.token }); // Llama a onLogin con el usuario
                        navigate('/'); 
                    } else {
                        alert(data.message || "Error de autenticación");
                    }
                } else if (action === "Sign Up") {
                    // Registro
                    const response = await axios.post("http://localhost:4000/usuarios/crearUsuario", {
                        nombre: nombre,
                        email: email,
                        password: password,
                    });

                    const data = response.data;
                    if (data.success) {
                        alert("Registro exitoso");
                        setAction("Login"); 
                    } else {
                        alert(data.error || "Error al registrarse");
                    }
                }
            } catch (error) {
                if (error.response && error.response.data) {
                    alert(error.response.data.message || "Ocurrió un error. Inténtelo de nuevo.");
                } else {
                    console.error("Error en la autenticación:", error);
                    alert("Ocurrió un error. Inténtelo de nuevo.");
                }
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
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)} 
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
                            onChange={(e) => setEmail(e.target.value)} 
                            required
                        />
                    </div>

                    <div className={styles.input}>
                        <img src={password_icon} alt='Password Icon' />
                        <input
                            type='password'
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
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

                    <div className={styles.submitContainer}>
                        <button type="submit" className={styles.submit}>
                            {action === "Login" ? "Iniciar Sesión" : "Registrarse"}
                        </button>
                    </div>
                </form>
            </div>
        );
    };

export default LoginSignup;
