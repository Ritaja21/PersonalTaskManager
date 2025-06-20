import { useState } from 'react';
import { API } from '../api';

export default function TaskForm({ setTasks }) {
    const [form, setForm] = useState({ title: '', description: '', priority: 'medium' });

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        await API.post('/', form);
        const all = await API.get('/');
        setTasks(all.data);
        setForm({ title: '', description: '', priority: 'medium' });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-6">
            <input name="title" value={form.title} onChange={handleChange} placeholder="Title"
                className="bg-gray-800 text-white border border-gray-600 px-3 py-2 rounded placeholder-gray-400" required />
            <input name="description" value={form.description} onChange={handleChange} placeholder="Description"
                className="bg-gray-800 text-white border border-gray-600 px-3 py-2 rounded placeholder-gray-400" />
            <select name="priority" value={form.priority} onChange={handleChange}
                className="bg-gray-800 text-white border border-gray-600 px-3 py-2 rounded placeholder-gray-400">
                <option>low</option>
                <option>medium</option>
                <option>high</option>
            </select>
            <button type="submit"
                className="bg-yellow-400 text-black px-4 py-2 rounded font-semibold hover:bg-yellow-500 transition-colors">Add Task</button>
        </form>
    );
}
