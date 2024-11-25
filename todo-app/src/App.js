import React, { useState } from 'react';
import './App.css';
import { FaTrash, FaCheck, FaEdit } from 'react-icons/fa';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');

  const addTask = () => {
    if (newTask.trim() === '') return;

    const task = {
      id: Date.now(),
      title: newTask,
      completed: false,
      date: new Date().toLocaleDateString(),
    };

    setTasks([...tasks, task]);
    setNewTask('');
  };

  const toggleTaskCompletion = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const startEditingTask = (id, title) => {
    setEditingTaskId(id);
    setEditedTitle(title);
  };

  const saveEditedTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, title: editedTitle } : task
      )
    );
    setEditingTaskId(null);
    setEditedTitle('');
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditedTitle('');
  };

  const filteredTasks = isCompleteScreen
    ? tasks.filter((task) => task.completed)
    : tasks.filter((task) => !task.completed);

  return (
    <div className="App">
      <h1>My To-Do List</h1>
      <div className="todo-wrapper">
        <div className="input">
          <input
            type="text"
            placeholder="Enter a task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button onClick={addTask} className="primarybtn">Add</button>
        </div>
        <div className="btn">
          <button
            className={`secondarybtn ${!isCompleteScreen && 'active'}`}
            onClick={() => setIsCompleteScreen(false)}
          >
            Pending Tasks
          </button>
          <button
            className={`secondarybtn ${isCompleteScreen && 'active'}`}
            onClick={() => setIsCompleteScreen(true)}
          >
            Completed Tasks
          </button>
        </div>
        <div className="todo-list">
          {filteredTasks.length === 0 ? (
            <p>No tasks to display</p>
          ) : (
            filteredTasks.map((task) => (
              <div className="todo-list-item" key={task.id}>
                {editingTaskId === task.id ? (
                  <div className="editing-section">
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                    />
                    <button onClick={() => saveEditedTask(task.id)}>Save</button>
                    <button onClick={cancelEditing}>Cancel</button>
                  </div>
                ) : (
                  <>
                    <div>
                      <h3>{task.title}</h3>
                      <p>{task.date}</p>
                    </div>
                    <div className="action-buttons">
                      <button onClick={() => toggleTaskCompletion(task.id)}>
                        <FaCheck color={task.completed ? 'green' : 'white'} />
                      </button>
                      <button onClick={() => startEditingTask(task.id, task.title)}>
                        <FaEdit color="yellow" />
                      </button>
                      <button onClick={() => deleteTask(task.id)}>
                        <FaTrash color="red" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
