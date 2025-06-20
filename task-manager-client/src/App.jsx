import { useState } from 'react'
import './App.css'
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

export default function App() {
  const [tasks, setTasks] = useState([])

  return (
    <>
      <div className="dark min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-full max-w-xl bg-gray-800 shadow-md rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-6 text-center text-yellow-300">
            📝 Personal Task Manager
          </h1>
          <TaskForm setTasks={setTasks} />
          <TaskList tasks={tasks} setTasks={setTasks} />
        </div>
      </div>

    </>
  );
}


