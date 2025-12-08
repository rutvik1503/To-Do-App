import React, { useEffect, useState } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";

const CompletedTask = () => {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [confirmPopup, setConfirmPopup] = useState({
    show: false,
    taskId: null,
  });
  const navigate = useNavigate();

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 3000);
  };

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    fetchCompletedTasks();
  }, []);

  // Refresh AOS on tasks change
  useEffect(() => {
    AOS.refreshHard();
  }, [completedTasks]);

  const fetchCompletedTasks = async () => {
    try {
      const res = await axios.get("mongodb+srv://TodoAppCluster:TodoApp1503@tododatabase.aqsvllu.mongodb.net/?appName=TodoDatabase/allTasks");
      const completed = (res.data.tasks || [])
        .filter((task) => task.isCompleted)
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      setCompletedTasks(completed);
    } catch (err) {
      console.error("Failed to fetch completed tasks:", err);
    }
  };

  const handleDeleteTask = (id) => {
    axios
      .post("mongodb+srv://TodoAppCluster:TodoApp1503@tododatabase.aqsvllu.mongodb.net/?appName=TodoDatabase/deleteTask", { id })
      .then((res) => {
        showAlert(res.data.message, "success");
        setCompletedTasks((prev) => prev.filter((t) => t._id !== id));
        setConfirmPopup({ show: false, taskId: null });
      })
      .catch((err) => {
        showAlert("Failed to delete task", "error");
        console.error(err);
      });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day} / ${month} / ${year}`;
  };

  return (
    <div className="relative w-full h-full">
      {/* Alert Popup */}
      {alert.message && (
        <div
          data-aos="fade-down"
          className={`fixed tracking-[0.75px] top-5 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl text-white font-normal border
            ${
              alert.type === "success"
                ? "bg-green-500/20 border-green-400"
                : "bg-red-500/20 border-red-400"
            } transition-all duration-300 z-50`}
        >
          {alert.message}
        </div>
      )}

      {/* Confirm Delete Popup */}
      {confirmPopup.show && (
        <div
          data-aos="fade-down"
          className="fixed top-5 left-1/2 -translate-x-1/2 px-6 py-4 rounded-xl text-white font-normal border
            bg-red-500/20 border-red-400 backdrop-blur-md shadow-lg z-50 w-[320px] text-center"
        >
          <h2 className="text-lg font-semibold mb-2 tracking-wide">
            Delete Task?
          </h2>
          <p className="text-white/70 text-sm mb-4">
            Are you sure you want to delete this task?
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => handleDeleteTask(confirmPopup.taskId)}
              className="px-4 py-2 rounded-lg bg-red-500/70 border border-red-300 text-white hover:bg-red-500 transition-all"
            >
              Yes, Delete
            </button>
            <button
              onClick={() => setConfirmPopup({ show: false, taskId: null })}
              className="px-4 py-2 rounded-lg bg-white/10 border border-white/30 hover:bg-white/20 text-white transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Completed Task Grid */}
      <div className="w-full h-full grid grid-cols-4 gap-[15px] justify-items-start">
        {completedTasks.length === 0 && (
          <div className="col-span-4 flex items-center justify-center w-full h-[70vh]">
            <div
              data-aos="zoom-in"
              className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-10 shadow-lg gap-4 text-center"
            >
              <span className="text-8xl">📭</span>
              <h2 className="text-white text-3xl font-bold">
                No Completed Tasks!
              </h2>
              <p className="text-white/70 text-lg max-w-xs">
                Looks like you haven't completed any tasks yet. Once you mark
                tasks as done, they will appear here.
              </p>
              <button
                className="mt-4 px-6 py-2 bg-blue-500/70 hover:bg-blue-500 text-white rounded-lg transition-all"
                onClick={() => navigate("/")}
              >
                Complete Task
              </button>
            </div>
          </div>
        )}

        {completedTasks.map((task, index) => (
          <div
            key={task._id}
            data-aos="fade-up"
            data-aos-delay={index * 50}
            className="taskCard opacity-70"
          >
            <h1 className="taskHead">{task.title}</h1>
            <p className="taskDescription">{task.description}</p>

            {/* Glass-effect Priority Badge */}
            <span
              className={`absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-[375] tracking-[0.25px]
                          ${
                            task.priority === "low"
                              ? "text-green-400 border border-green-400/30 bg-green-400/10"
                              : task.priority === "medium"
                              ? "text-yellow-400 border border-yellow-400/30 bg-yellow-400/10"
                              : "text-red-400 border border-red-400/30 bg-red-400/10"
                          }`}
            >
              {task.priority === "low"
                ? "Low Priority"
                : task.priority === "medium"
                ? "Medium Priority"
                : "High Priority"}
            </span>

            <div className="cardContainer justify-between items-center">
              <p>
                📅{" "}
                <span className="taskDueDate">{formatDate(task.dueDate)}</span>
              </p>
              <p className="taskStatus status-done">✅ Completed</p>
            </div>

            <div className="cardContainer justify-end gap-3">
              <button
                className="appBtn deleteBtn ml-auto"
                onClick={() =>
                  setConfirmPopup({ show: true, taskId: task._id })
                }
              >
                <span className="text-red-600">🗑️</span> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompletedTask;
