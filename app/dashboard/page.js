"use client";

import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Dashboard() {
  const { data: session } = useSession();
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    if (session) {
      fetch('/api/todos')
        .then((res) => res.json())
        .then((data) => setTodos(data));
    }
  }, [session]);

  const handleAddTodo = () => {
    const updatedTodos = [...todos, { id: Date.now().toString(), title: newTodo, done: false, sessions: [] }];
    fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ todos: updatedTodos, message: 'Add new todo' }),
    }).then(() => {
      setTodos(updatedTodos);
      setNewTodo('');
    });
  };

  if (!session) {
    return (
      <div>
        <h1>Please sign in to view your dashboard</h1>
        <button onClick={() => signIn('github')}>Sign in with GitHub</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Your Todo List</h1>
      <button onClick={() => signOut()}>Sign out</button>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add a new todo"
      />
      <button onClick={handleAddTodo}>Add</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </div>
  );
}
