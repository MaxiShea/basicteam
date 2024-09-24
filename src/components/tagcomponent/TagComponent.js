// src/components/TagComponent/TagComponent.js
import React, { useState } from 'react';
import styles from './TagComponent.module.css';

const TagComponent = ({ tags, onTagAdd, onTagRemove }) => {
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag.trim()) {
      onTagAdd(newTag.trim());
      setNewTag('');
    }
  };

  return (
    <div className={styles.tags}>
      <div className={styles.tagList}>
        {tags.map((tag, index) => (
          <span key={index} className={styles.tag}>
            {tag}
            <button
              onClick={() => onTagRemove(tag)}
              className={styles.removeButton}
            >
              &times;
            </button>
          </span>
        ))}
      </div>
      <div className={styles.addTag}>
        <input
          type="text"
          placeholder="Agregar etiqueta"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          className={styles.input}
        />
        <button onClick={handleAddTag} className={styles.addButton}>
          Agregar
        </button>
      </div>
    </div>
  );
};

export default TagComponent;

