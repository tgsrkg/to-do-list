import { useEffect, useState } from "react";

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

type Filter = "all" | "active" | "completed";
type Theme = "light" | "dark";

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("tasks") || "[]");
    } catch {
      return [];
    }
  });

  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const [theme, setTheme] = useState<Theme>(() => {
    return localStorage.getItem("theme") === "dark" ? "dark" : "light";
  });

  // Сохраняем задачи
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Сохраняем тему
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Добавление задачи
  const addTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = inputValue.trim();

    if (!title) return;

    const newTask: Task = {
      id: Date.now(),
      title,
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setInputValue("");
  };

  // Изменение статуса задачи
  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  // Удаление задачи
  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Фильтрация задач
  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  return (
    <div className="app" data-theme={theme}>
      <div className="container">
        <header>
          <h1>Мои задачи</h1>

          <button
            className="theme-button"
            type="button"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label="Переключить тему"
          >
            <span>{theme === "light" ? "☾" : "☀"}</span>
            {theme === "light" ? "Тёмная тема" : "Светлая тема"}
          </button>
        </header>

        <form onSubmit={addTask}>
          <input
            type="text"
            placeholder="Введите задачу..."
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
          />

          <button type="submit">Добавить</button>
        </form>

        <div className="filters">
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
            type="button"
          >
            Все
          </button>

          <button
            className={filter === "active" ? "active" : ""}
            onClick={() => setFilter("active")}
            type="button"
          >
            Активные
          </button>

          <button
            className={filter === "completed" ? "active" : ""}
            onClick={() => setFilter("completed")}
            type="button"
          >
            Выполненные
          </button>
        </div>

        <ul>
          {filteredTasks.map((task) => (
            <li key={task.id}>
              <label>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                />

                <span className={task.completed ? "completed" : ""}>
                  {task.title}
                </span>
              </label>

              <button
                className="delete-button"
                onClick={() => deleteTask(task.id)}
                type="button"
              >
                Удалить
              </button>
            </li>
          ))}
        </ul>

        {filteredTasks.length === 0 && (
          <p className="empty-message">Задач пока нет</p>
        )}
      </div>
    </div>
  );
}

export default App;
