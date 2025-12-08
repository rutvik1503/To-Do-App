import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const NavigationBar = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  const btnArray = [
    {
      name: "Home",
      imgUrl:
        "https://res.cloudinary.com/dwx0y39ww/image/upload/v1764744676/home_ppozmh.png",
      path: "/",
    },
    {
      name: "Completed Task",
      imgUrl:
        "https://res.cloudinary.com/dwx0y39ww/image/upload/v1764744607/taskCompleted_ohjr5t.png",
      path: "/completed",
    },
    {
      name: "Pending Task",
      imgUrl:
        "https://res.cloudinary.com/dwx0y39ww/image/upload/v1764744608/taskPending_zxaagk.png",
      path: "/pending",
    },
    {
      name: "Add Task",
      imgUrl:
        "https://res.cloudinary.com/dwx0y39ww/image/upload/v1764744607/addTask_hlgm7a.png",
      path: "/addTask",
    },
  ];
  return (
    <div className="w-full h-full px-6 py-3 glassCard flex justify-between items-center rounded-xl shadow-lg">
        {/* LOGO + TITLE */}
        <div className="logo flex justify-center items-center gap-3">
          <img
            src="https://res.cloudinary.com/dwx0y39ww/image/upload/v1765021279/Logo_mlp75p.png"
            className="w-10 h-10"
          />
          <h1 className="font-semibold text-white text-xl tracking-wide mt-[5px]">
            Task Manager
          </h1>
        </div>

        {/* NAV BUTTONS */}
        <div className="flex gap-4 text-white font-light tracking-wide">
          {btnArray.map((btn) => (
            <button
              key={btn.name}
              onClick={() => navigate(btn.path)}
              className="navBtn flex items-center gap-2 px-3 py-1 cursor-pointer"
              data-aos="fade"
            >
              <img src={btn.imgUrl} alt={btn.name} className="w-5 h-5" />
              <span className="text-[15px] mt-[5px]">{btn.name}</span>
            </button>
          ))}
        </div>
      </div>
  );
};

export default NavigationBar;
