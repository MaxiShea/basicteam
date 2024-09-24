import React, { useState } from 'react';
import Header from './components/header/Header';
import TaskForm from './components/taskform/TaskForm';
import TaskItem from './components/taskitem/TaskItem';
import Filter from './components/filter/Filter';
import TaskHistory from './components/taskhistory/TaskHistory';
import TagComponent from './components/tagcomponent/TagComponent';

import './App.css';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [history, setHistory] = useState([]);
  const [tags, setTags] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');


  const handleSaveTask = (newTask) => {
    const taskExists = tasks.some(
      (task) =>
        task.title.toLowerCase() === newTask.title.toLowerCase() &&
        task.id !== (editTask?.id || null)
    );

    if (taskExists) {
      setErrorMessage('Ya existe una tarea con ese título');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
      return;
    }

    let updatedTasks;
    if (editTask) {
      updatedTasks = tasks.map((task) =>
        task.id === editTask.id
          ? { ...newTask, id: editTask.id, completed: task.completed }
          : task
      );
      setEditTask(null);
    } else {
      const newId = tasks.length > 0 ? Math.max(...tasks.map((task) => task.id)) + 1 : 1;
      updatedTasks = [...tasks, { ...newTask, id: newId, completed: false }];
    }

    setTasks(updatedTasks);
    applyFilter(updatedTasks);

 
    setHistory((prevHistory) => [
      ...prevHistory,
      {
        action: editTask ? 'Tarea editada' : 'Tarea creada',
        date: new Date().toLocaleString(),
        user: 'Admin',
      },
    ]);
  };


  const handleCompleteTask = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: true } : task
    );
    setTasks(updatedTasks);
    applyFilter(updatedTasks);

    setHistory((prevHistory) => [
      ...prevHistory,
      {
        action: 'Tarea completada',
        date: new Date().toLocaleString(),
        user: 'Admin',
      },
    ]);
  };


  const handleEditTask = (taskToEdit) => {
    setEditTask(taskToEdit);
  };

  // Eliminar tarea
  const handleDeleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    applyFilter(updatedTasks); // Aplicar filtro después de eliminar tarea

    setHistory((prevHistory) => [
      ...prevHistory,
      {
        action: 'Tarea eliminada',
        date: new Date().toLocaleString(),
        user: 'Admin',
      },
    ]);
  };


  const handleFilterChange = (filter) => {
    applyFilter(tasks, filter);
  };


  const applyFilter = (tasksToFilter, filter = { status: 'todas', priority: 'todas' }) => {
    const { status, priority } = filter;
    let filtered = tasksToFilter;

    if (status !== 'todas') {
      filtered = filtered.filter((task) =>
        status === 'completadas' ? task.completed : !task.completed
      );
    }

    if (priority !== 'todas') {
      filtered = filtered.filter((task) => task.priority === priority);
    }

    setFilteredTasks(filtered);
  };


  const handleAddTag = (newTag) => {
    const tagExists = tags.includes(newTag.toLowerCase());
    if (!tagExists) {
      setTags((prevTags) => [...prevTags, newTag.toLowerCase()]);
    }
  };


  const handleRemoveTag = (tagToRemove) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="app-container">
      <Header />
      <main>
        <section className="task-section">
          <h2>{editTask ? 'Editar tarea' : 'Crear nueva tarea'}</h2>
          <TaskForm onSave={handleSaveTask} editTask={editTask} />
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </section>

        <section className="filter-section">
          <h2>Filtrar tareas</h2>
          <Filter onFilterChange={handleFilterChange} />
        </section>

        <section className="tasks-list">
          <h2>Lista de Tareas</h2>
          {(filteredTasks.length > 0 ? filteredTasks : tasks).map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onComplete={handleCompleteTask}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          ))}
        </section>

        <section className="tags-section">
          <h2>Etiquetas</h2>
          <TagComponent
            tags={tags}
            onTagAdd={handleAddTag}
            onTagRemove={handleRemoveTag}
          />
        </section>

        <section className="history-section">
          <h2>Historial de Cambios</h2>
          <TaskHistory history={history} />
        </section>
      </main>
    </div>
  );
};

export default App;

