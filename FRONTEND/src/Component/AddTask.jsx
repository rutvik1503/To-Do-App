import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";

const AddTask = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");

  // Alert state
  const [alert, setAlert] = useState({ message: "", type: "" });

  const dateRef = useRef(null);

  const openDatePicker = () => {
    if (dateRef.current) {
      dateRef.current.showPicker();
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day} / ${month} / ${year}`;
  };

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 3000); // disappear after 3 sec
  };

  const handleAddTask = async () => {
    if (!title || !description || !dueDate || !priority) {
      showAlert("Please fill all details...!", "error");
    } else {
      try {
        const response = await axios.post("https://to-do-application-tglu.onrender.com/addTask", {
          title,
          description,
          dueDate,
          priority,
        });
        showAlert(response.data.message, "success");
      } catch (error) {
        console.error("Error adding task:", error);
        showAlert(
          error.response?.data?.message || "Failed to add task",
          "error"
        );
      }
    }

    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("medium");
  };

  return (
    <div className="relative">
      {/* Alert */}
      {alert.message && (
        <div
          data-aos="fade-down"
          className={`fixed tracking-[0.75px] top-5 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl text-white font-normal border ${
            alert.type === "success"
              ? "bg-green-500/20 border-green-400"
              : "bg-red-500/20 border-red-400"
          } transition-all duration-300 z-50`}
        >
          {alert.message}
        </div>
      )}

      <div className="grid grid-cols-4 gap-[15px]">
        {/* Task Title */}
        <div data-aos="fade-up" className="glassCard col-span-2 p-4 rounded-xl flex flex-col gap-3">
          <label className="text-white/90 text-base font-semibold">
            Task Title
          </label>
          <input
            required
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            className="w-full text-sm tracking-[0.75px] font-light bg-white/5 border border-white/20 p-2 rounded-md text-white placeholder-white/40
            placeholder:font-light placeholder:text-sm focus:outline-none focus:border-purple-400/70 transition-all"
          />
        </div>

        {/* Due Date */}
        <div data-aos="fade-up" data-aos-delay="50" className="glassCard p-4 rounded-xl flex flex-col gap-3">
          <label className="text-white/90 text-base font-semibold">
            Due Date
          </label>
          <div className="relative w-full">
            <input
              required
              type="text"
              readOnly
              value={dueDate ? formatDate(dueDate) : "DD / MM / YYYY"}
              onClick={openDatePicker}
              className="w-full text-sm tracking-[0.75px] font-light bg-white/5 border border-white/20 p-2 rounded-md text-white placeholder-white/40 placeholder:font-light placeholder:text-sm focus:outline-none cursor-pointer pr-10"
            />
            <input
              required
              type="date"
              ref={dateRef}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer font-light"
            />
            <div
              onClick={openDatePicker}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-purple-400 hover:text-purple-600 transition"
            >
              📆
            </div>
          </div>
        </div>

        {/* Priority */}
        <div data-aos="fade-up" data-aos-delay="100" className="glassCard p-4 rounded-xl flex flex-col gap-3">
          <label className="text-white/90 text-base font-semibold">
            Priority
          </label>
          <div className="relative">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full bg-white/5 border border-white/20 p-2 rounded-md text-white
              focus:outline-none focus:border-purple-400/70 transition-all appearance-none pr-10 font-light tracking-[0.75px]"
            >
              <option value="high" className="text-white bg-[rgba(0,0,0,0.5)]">
                High
              </option>
              <option
                value="medium"
                className="text-white bg-[rgba(0,0,0,0.5)]"
              >
                Medium
              </option>
              <option value="low" className="text-white bg-[rgba(0,0,0,0.5)]">
                Low
              </option>
            </select>
            <svg
              className="w-4 h-4 text-white/60 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 9l6 6 6-6"
              />
            </svg>
          </div>
        </div>

        {/* Description */}
        <div data-aos="fade-up" data-aos-delay="150" className="glassCard col-span-4 p-4 rounded-xl flex flex-col gap-3">
          <label className="text-white/90 text-base font-semibold">
            Description
          </label>
          <textarea
            required
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write something about this task..."
            className="w-full font-light tracking-[0.75px] bg-white/5 border border-white/20 p-2 rounded-md text-white placeholder-white/40
            placeholder:font-light placeholder:text-sm focus:outline-none focus:border-purple-400/70 transition-all resize-none"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button data-aos="fade-up" data-aos-delay="200"
          onClick={handleAddTask}
          className="w-full col-start-4 p-[10px] rounded-[7.5px] border border-[#4CAF50] text-[#4CAF50] bg-white/10 backdrop-blur-md transition-all duration-300 hover:bg-[#4CAF50]/40 hover:text-white focus:bg-[#4CAF50]/40 focus:text-white active:bg-[#4CAF50]/40 focus:outline-none"
        >
          Add Task
        </button>
      </div>
    </div>
  );
};

export default AddTask;
