import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./Component/HomePage";
import AddTask from "./Component/AddTask";
import NavigationBar from "./Component/NavigationBar";
import Layout from "./Component/Layout";
import CompletedTask from "./Component/CompletedTask";
import PendingTask from "./Component/PendingTask";

const App = () => {
  return (
    <BrowserRouter>
      <Layout
        children={{
          navbar: <NavigationBar />,
          page: (
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/addTask" element={<AddTask />} />
              <Route path="/completed" element={<CompletedTask />} />
              <Route path="/pending" element={<PendingTask />} />
            </Routes>
          ),
        }}
      />
    </BrowserRouter>
  );
};

export default App;
