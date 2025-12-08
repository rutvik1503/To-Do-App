import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";

const PendingTask = () => {
  const [tasks, setTasks] = useState([]);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [confirmPopup, setConfirmPopup] = useState({ show: false, taskId: null });
  const [editPopup, setEditPopup] = useState({ show: false, task: null });
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editPriority, setEditPriority] = useState("medium");
  const editDateRef = useRef(null);
  const navigate = useNavigate();

  // Show alert message
  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 3000);
  };

  // Initialize AOS and fetch tasks
  useEffect(() => {
    AOS.init({ duration: 800, once: true, offset: 50 });
    fetchPendingTasks();
  }, []);

  // Refresh AOS whenever tasks change
  useEffect(() => {
    AOS.refreshHard();
  }, [tasks]);

  // Fetch pending tasks
  const fetchPendingTasks = async () => {
    try {
      const res = await axios.get("mongodb+srv://TodoAppCluster:TodoApp1503@tododatabase.aqsvllu.mongodb.net/?appName=TodoDatabase/allTasks");
      const pending = (res.data.tasks || [])
        .filter((task) => !task.isCompleted)
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      setTasks(pending);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  // Delete task
  const handleDeleteTask = (id) => {
    axios
      .post("mongodb+srv://TodoAppCluster:TodoApp1503@tododatabase.aqsvllu.mongodb.net/?appName=TodoDatabase/deleteTask", { id })
      .then((res) => {
        showAlert(res.data.message, "success");
        setTasks((prev) => prev.filter((t) => t._id !== id));
        setConfirmPopup({ show: false, taskId: null });
      })
      .catch((err) => {
        showAlert("Failed to delete task", "error");
        console.error(err);
      });
  };

  // Open edit popup
  const handleEditClick = (task) => {
    setEditPopup({ show: true, task });
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditDueDate(task.dueDate ? task.dueDate.split("T")[0] : "");
    setEditPriority(task.priority || "medium");
  };

  // Format date
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
      {/* Alert */}
      {alert.message && (
        <div
          data-aos="fade-down"
          className={`fixed top-5 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl text-white font-normal border
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
          <h2 className="text-lg font-semibold mb-2 tracking-wide">Delete Task?</h2>
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

      {/* Edit Task Popup */}
      {editPopup.show && (
        <div
          data-aos="fade-down"
          className="fixed top-5 left-1/2 -translate-x-1/2 px-6 py-5 rounded-xl text-white font-normal border
            bg-white/5 border-purple-400/40 backdrop-blur-md shadow-lg z-50 w-[600px] text-center"
        >
          <h2 className="text-lg font-semibold mb-4 tracking-wide text-purple-300">Edit Task</h2>

          <input
            type="text"
            placeholder="Title"
            className="w-full px-4 py-2 mb-3 rounded-md bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-purple-400 transition-all font-light"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />

          <textarea
            rows="3"
            placeholder="Description"
            className="w-full px-4 py-2 mb-3 rounded-md bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-purple-400 transition-all resize-none font-light"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />

          <div className="relative w-full mb-3">
            <input
              type="text"
              readOnly
              value={editDueDate ? formatDate(editDueDate) : "DD / MM / YYYY"}
              onClick={() => editDateRef.current.showPicker()}
              className="w-full text-sm tracking-[0.75px] font-light bg-white/5 border border-white/20 p-2 rounded-md text-white placeholder-white/40 placeholder:font-light placeholder:text-sm focus:outline-none cursor-pointer pr-10"
            />
            <input
              type="date"
              ref={editDateRef}
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer font-light"
            />
            <div
              onClick={() => editDateRef.current.showPicker()}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-purple-400 hover:text-purple-600 transition"
            >
              📆
            </div>
          </div>

          <div className="relative mb-4">
            <select
              className="w-full bg-white/5 border border-white/20 p-2 rounded-md text-white focus:outline-none focus:border-purple-400/70 transition-all appearance-none pr-10 font-light tracking-[0.75px]"
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value)}
            >
              <option value="low" className="text-white bg-[rgba(0,0,0,0.5)]">Low</option>
              <option value="medium" className="text-white bg-[rgba(0,0,0,0.5)]">Medium</option>
              <option value="high" className="text-white bg-[rgba(0,0,0,0.5)]">High</option>
            </select>
            <svg
              className="w-4 h-4 text-white/60 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
            </svg>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                axios
                  .post("mongodb+srv://TodoAppCluster:TodoApp1503@tododatabase.aqsvllu.mongodb.net/?appName=TodoDatabase/updateTask", {
                    id: editPopup.task._id,
                    title: editTitle,
                    description: editDescription,
                    dueDate: editDueDate,
                    priority: editPriority,
                  })
                  .then((res) => {
                    showAlert(res.data.message, "success");
                    setTasks((prev) =>
                      prev.map((t) =>
                        t._id === editPopup.task._id
                          ? { ...t, title: editTitle, description: editDescription, dueDate: editDueDate, priority: editPriority }
                          : t
                      )
                    );
                    setEditPopup({ show: false, task: null });
                  })
                  .catch((err) => {
                    showAlert("Failed to update task", "error");
                    console.error(err);
                  });
              }}
              className="px-5 py-2 rounded-lg bg-purple-500/70 border border-purple-400 text-white hover:bg-purple-500 transition-all"
            >
              Save
            </button>
            <button
              onClick={() => setEditPopup({ show: false, task: null })}
              className="px-5 py-2 rounded-lg bg-white/10 border border-white/30 hover:bg-white/20 text-white transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Pending Task Grid */}
      <div className="w-full h-full grid grid-cols-4 gap-[15px] justify-items-start">
        {tasks.length === 0 && (
          <div className="col-span-4 flex items-center justify-center w-full h-[70vh]">
            <div
              data-aos="zoom-in"
              className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-10 shadow-lg gap-4 text-center"
            >
              <span className="text-8xl">⏳</span>
              <h2 className="text-white text-3xl font-bold">No Pending Tasks!</h2>
              <p className="text-white/70 text-lg max-w-xs">
                You have no pending tasks at the moment. All tasks are completed or you haven't added any yet.
              </p>
              <button
                className="mt-4 px-6 py-2 bg-green-500/70 hover:bg-green-500 text-white rounded-lg transition-all"
                onClick={() => navigate("/addTask")}
              >
                Add New Task
              </button>
            </div>
          </div>
        )}

        {tasks.map((task, index) => (
          <div
            key={task._id}
            data-aos="fade-up"
            data-aos-delay={index * 50} // stagger animation
            className={`taskCard opacity-100 priority-${task.priority}`}
          >
            <h1 className="taskHead">{task.title}</h1>
            <p className="taskDescription">{task.description}</p>

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
              <p>📅 <span className="taskDueDate">{formatDate(task.dueDate)}</span></p>
              <p className="taskStatus status-pending">⏳ Pending</p>
            </div>

            <div className="cardContainer justify-end gap-3">
              <button className="appBtn editBtn" onClick={() => handleEditClick(task)}>✏️ Edit</button>
              <button
                className="appBtn doneBtn"
                onClick={() => {
                  axios.post("mongodb+srv://TodoAppCluster:TodoApp1503@tododatabase.aqsvllu.mongodb.net/?appName=TodoDatabase/markDone", { id: task._id })
                    .then((res) => {
                      showAlert(res.data.message, "success");
                      setTasks((prev) => prev.filter((t) => t._id !== task._id));
                    })
                    .catch((err) => {
                      showAlert("Failed to mark as done", "error");
                      console.error(err);
                    });
                }}
              >
                ✅ Mark As Done
              </button>
              <button
                className="appBtn deleteBtn"
                onClick={() => setConfirmPopup({ show: true, taskId: task._id })}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingTask;
