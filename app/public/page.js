export async function getStaticProps() {
  const res = await fetch(
    "https://raw.githubusercontent.com/yourusername/todo-data/main/todos.json"
  );
  const todos = await res.json();
  return { props: { todos }, revalidate: 60 };
}

export default function Public({ todos }) {
  return (
    <div>
      <h1>Public Todo List</h1>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </div>
  );
}
