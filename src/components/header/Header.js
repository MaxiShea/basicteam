/*import React from 'react';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Basic Team</h1>
      <nav>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <a href="#task">Task</a>
          </li>
          <li className={styles.navItem}>
            <a href="#history">History</a>
          </li>
          <li className={styles.navItem}>
            <a href="#users">Users</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;*/

import React, { useState } from 'react';
import styles from './Header.module.css';
import LoginSignup from '../login-signup/LoginSignup';

const Header = ({ isAuthenticated, onLogout, onLogin }) => {
  const [showLogin, setShowLogin] = useState(false);

  const handleLoginClick = () => {
    setShowLogin(!showLogin);
  };

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Basic Team</h1>
      <nav>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <a href="#task">Task</a>
          </li>
          <li className={styles.navItem}>
            <a href="#history">History</a>
          </li>
          <li className={styles.navItem}>
            <a href="#users">Users</a>
          </li>
        </ul>
      </nav>

      {isAuthenticated ? (
        <div>
          <span>Usuario autenticado</span>
          <button onClick={onLogout}>Cerrar sesión</button>
        </div>
      ) : (
        <div>
          <button onClick={handleLoginClick}>Iniciar sesión / Registro</button>
          {showLogin && (
            <div className={styles.loginSection}>
              <LoginSignup onLogin={onLogin} />
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;


