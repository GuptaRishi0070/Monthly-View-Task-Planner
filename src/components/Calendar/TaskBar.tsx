import type { Task, Category } from "../../types";

interface TaskBarProps {
  tasks: Task[];
  categories: Category[];
  onTaskDelete: (taskId: string) => void;
}

export default function TaskBar({ tasks, onTaskDelete }: TaskBarProps) {
  return (
    <div
      style={{
        padding: 10,
        backgroundColor: "#f9f9f9",
        borderTop: "1px solid #ddd",
        maxHeight: 200,
        overflowY: "auto",
      }}
    >
      <h3>All Tasks</h3>
      {tasks.length === 0 && <p>No tasks</p>}
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {tasks.map((task) => {
          const categoryColor = task.color || "#ccc";
          return (
            <li
              key={task.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderLeft: `6px solid ${categoryColor}`,
                padding: "6px 12px",
                marginBottom: 6,
                background: "white",
                borderRadius: 4,
                cursor: "default",
              }}
              title={`${task.title} (${task.category})`}
            >
              <span>{task.title}</span>
              <button
                onClick={() => onTaskDelete(task.id)}
                aria-label={`Delete task ${task.title}`}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#888",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "1rem",
                  padding: 0,
                  lineHeight: 1,
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = "#f44336")}
                onMouseOut={(e) => (e.currentTarget.style.color = "#888")}
              >
                ✕
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
