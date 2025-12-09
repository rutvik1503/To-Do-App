// server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const TodoModel = require("./Model/TodoModel"); // adjust path if needed

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb+srv://TodoAppCluster:TodoApp1503@tododatabase.aqsvllu.mongodb.net/ToDoApp")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.post("/addTask", async (req, res) => {
  const { title, description, dueDate, priority } = req.body;

  try {
    const task = await TodoModel.create({
      title,
      description,
      dueDate,
      priority,
    });
    res.json({ message: "Task added successfully", task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.get("/allTasks", async (req, res) => {
  try {
    const tasks = await TodoModel.find();
    res.json({ tasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.post("/deleteTask", async (req, res) => {
  try {
    const { id } = req.body;

    const deletedTask = await TodoModel.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully", deletedTask });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.post("/updateTask", async (req, res) => {
  try {
    const { id, title, description, dueDate, priority } = req.body;

    const updatedTask = await TodoModel.findByIdAndUpdate(
      id,
      { title, description, dueDate, priority },
      { new: true } // returns updated doc
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task updated successfully", task: updatedTask });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Mark task as done
app.post("/markDone", async (req, res) => {
  try {
    const { id } = req.body;

    const updatedTask = await TodoModel.findByIdAndUpdate(
      id,
      { isCompleted: true }, // mark as done
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task is comleted", updatedTask });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});



const PORT = 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));