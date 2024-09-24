import React from 'react';
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

export default Header;

