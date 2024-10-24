import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom'; // Importamos react-router-dom

import Header from './components/header/Header';
import TaskForm from './components/taskform/TaskForm';
import TaskItem from './components/taskitem/TaskItem';
import Filter from './components/filter/Filter';
import TaskHistory from './components/taskhistory/TaskHistory';
import TagComponent from './components/tagcomponent/TagComponent';
import LoginSignup from './components/login-signup/LoginSignup';
import Profile from './components/profile/Profile'; // Importa el componente
import './App.css';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [history, setHistory] = useState([]);
  const [tags, setTags] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado de autenticación
  const [currentUser, setCurrentUser] = useState(null); // Estado para el usuario actual

  const navigate = useNavigate();

    // Función para manejar el login
    const handleLogin = ({ email }) => {
      console.log('Login exitoso:', email);
      setIsAuthenticated(true);
      setCurrentUser({ email }); // Guardamos al usuario actual en el estado
      navigate('/');  // Redirige a la raíz donde están las funcionalidades
    };
  
    // Función para manejar el logout
    const handleLogout = () => {
      console.log('Logout exitoso');
      setIsAuthenticated(false);
      setCurrentUser(null); // Limpiamos el estado del usuario actual
      navigate('/'); // Redirige a la página principal
    };


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
        user: currentUser ? currentUser.email : 'Admin',
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
        user: currentUser ? currentUser.email : 'Admin',
      },
    ]);
  };

  const handleEditTask = (taskToEdit) => {
    setEditTask(taskToEdit);
  };

  const handleDeleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    applyFilter(updatedTasks);

    setHistory((prevHistory) => [
      ...prevHistory,
      {
        action: 'Tarea eliminada',
        date: new Date().toLocaleString(),
        user: currentUser ? currentUser.email : 'Admin', // en vez de admin me tiene que aparecer el nombre del usuario
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

  console.log('Valor de isAuthenticated:', isAuthenticated);

  return (
      <div className="app-container">
        {/* Mostrar el Header solo si el usuario está autenticado */}
        {isAuthenticated && (
        <Header
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
          currentUser={currentUser} // Pasar el usuario actual al Header si es necesario
        />
      )}        
        <main>
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <>
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
                      <TagComponent tags={tags} onTagAdd={handleAddTag} onTagRemove={handleRemoveTag} />
                    </section>

                    <section className="history-section">
                      <h2>Historial de Cambios</h2>
                      <TaskHistory history={history} />
                    </section>
                  </>
                ) : (
                  <LoginSignup onLogin={handleLogin} />
                )
              }
            />
            <Route path="/task" element={<TaskForm />} />
            <Route path="/history" element={<TaskHistory />} />
            <Route path="/users" element={<LoginSignup onLogin={handleLogin} />} />
            <Route path="/profile" element={<Profile user={currentUser} />} />
          </Routes>
        </main>
      </div>
  );
};

export default App;



/*import React, { useState } from 'react';
import Header from './components/header/Header';
import TaskForm from './components/taskform/TaskForm';
import TaskItem from './components/taskitem/TaskItem';
import Filter from './components/filter/Filter';
import TaskHistory from './components/taskhistory/TaskHistory';
import TagComponent from './components/tagcomponent/TagComponent';
import LoginSignup from './components/login-signup/LoginSignup';

import './App.css';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [history, setHistory] = useState([]);
  const [tags, setTags] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado de autenticación

  const handleLogin = ({ email }) => {
    // Aquí puedes agregar tu lógica de autenticación
    // Por ejemplo, una llamada a una API para validar el usuario
    console.log('Login exitoso:', email);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    // Lógica para cerrar sesión
    console.log('Logout exitoso');
    setIsAuthenticated(false);
  };

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
    <Header 
      isAuthenticated={isAuthenticated} 
      onLogout={handleLogout} 
      onLogin={handleLogin} 
    />
      <main>
        {isAuthenticated ? (
          // Mostrar contenido de la aplicación cuando el usuario está autenticado
          <>
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
          </>
        ) : (
          // Mostrar el componente de Login/Registro si no está autenticado
          <LoginSignup onLogin={handleLogin} />
        )}
      </main>
    </div>
  );
};

export default App;*/

