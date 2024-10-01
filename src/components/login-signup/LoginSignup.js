import React, { useState } from 'react';
import styles from './LoginSignup.module.css'; // Importa el módulo CSS

import user_icon from '../Assets/user.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';

const LoginSignup = () => {
    const [action, setAction] = useState("Login"); // Corrige 'cont' a 'const'

    return (
        <div className={styles.container}> {/* Usa el módulo CSS aquí */}
            <div className={styles.header}>
                <div className={styles.text}>{action}</div>
                <div className={styles.underline}></div>
            </div>
            <div className={styles.inputs}>
                {action === "Sign Up" && (
                    <div className={styles.input}> {/* Usa el módulo CSS */}
                        <img src={user_icon} alt='User Icon' />
                        <input type='text' placeholder='Name' />
                    </div>
                )}
                
                <div className={styles.input}>
                    <img src={email_icon} alt='Email Icon' />
                    <input type='email' placeholder='Email' />
                </div>
                
                <div className={styles.input}>
                    <img src={password_icon} alt='Password Icon' />
                    <input type='password' placeholder='Password' />
                </div>
                
                {action === "Login" && (
                    <div className={styles.forgotPassword}> {/* Usa el módulo CSS */}
                        Lost Password?<span> Click Here!</span>
                    </div>
                )}
                
                <div className={styles.submitContainer}>
                    <div
                        className={action === "Login" ? `${styles.submit} ${styles.gray}` : styles.submit}
                        onClick={() => setAction("Sign Up")}
                    >
                        Sign Up
                    </div>
                    <div
                        className={action === "Sign Up" ? `${styles.submit} ${styles.gray}` : styles.submit}
                        onClick={() => setAction("Login")}
                    >
                        Login
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginSignup;
