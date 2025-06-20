import { useEffect } from 'react';
import { API } from '../api';

export default function TaskList({ tasks, setTasks }) {
    useEffect(() => {
        API.get('/').then(res => setTasks(res.data));
    }, [setTasks]);

    const handleDelete = async id => {
        await API.delete(`/${id}`);
        const updated = await API.get('/');
        setTasks(updated.data);
    };

    const toggleComplete = async task => {
        await API.put(`/${task._id}`, { ...task, isCompleted: !task.isCompleted });
        const updated = await API.get('/');
        setTasks(updated.data);
    };

    const priorityClass = {
        low: 'bg-blue-800 text-blue-200',
        medium: 'bg-yellow-800 text-yellow-200',
        high: 'bg-red-800 text-red-200',
    };

    return (
        <ul className="space-y-4">
            {tasks.map(task => (
                <li
                    key={task._id}
                    className={`p-4 rounded-lg shadow-sm flex justify-between items-start border border-gray-600 ${task.isCompleted
                            ? 'bg-green-900 text-white line-through'
                            : 'bg-gray-800 text-white'
                        }`}
                >
                    <div>
                        <h3 className="text-lg font-semibold">{task.title}</h3>
                        <p className="text-sm text-gray-300">{task.description}</p>
                        <p className="text-sm text-gray-400">
                            {task.category && <>📁 {task.category} &nbsp;</>}
                            {task.dueDate && (
                                <>📅 {new Date(task.dueDate).toLocaleDateString()}</>
                            )}
                        </p>
                        <span
                            className={`text-xs px-2 py-1 mt-2 inline-block rounded ${priorityClass[task.priority]}`}
                        >
                            {task.priority}
                        </span>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                        <button
                            onClick={() => toggleComplete(task)}
                            className="text-green-400 text-sm hover:underline"
                        >
                            {task.isCompleted ? 'Undo' : 'Complete'}
                        </button>
                        <button
                            onClick={() => handleDelete(task._id)}
                            className="text-red-400 text-sm hover:underline"
                        >
                            Delete
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
}
