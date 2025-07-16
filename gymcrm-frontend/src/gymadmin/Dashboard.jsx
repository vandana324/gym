import React, { useState } from 'react';
import { FaUsers, FaChartBar, FaClock, FaExclamationCircle } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { AiOutlineMenu } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
// import Coach3 from '../../assets/coach3.png';

const dashboardCards = [
  {
    title: 'Joined Members',
    icon: <FaUsers className="text-black" size={24} />,
    route: '/joinedMember',
  },
  {
    title: 'Monthly Joined',
    icon: <FaChartBar className="text-black" size={24} />,
  },
  {
    title: 'Expiring within 3 days',
    icon: <FaClock className="text-black" size={24} />,
  },
  {
    title: 'Expiring within 4-7 days',
    icon: <FaClock className="text-black" size={24} />,
  },
  {
    title: 'Expired',
    icon: <FaExclamationCircle className="text-black" size={24} />,
  },
  {
    title: 'InActive members',
    icon: <FaExclamationCircle className="text-black" size={24} />,
  }
];

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-54' : 'w-0'} bg-black text-white flex flex-col p-4 transition-all duration-300 overflow-hidden`}>
        <div className="flex items-center gap-4 mb-6">
          <img src={"#"} alt="profile" className="w-16 h-16 rounded-full" />
          <div>
            <p className="text-sm">Good Evening</p>
            <p className="text-lg font-bold">admin</p>
          </div>
        </div>
        <div className="space-y-4">
          <button
  onClick={() => navigate("/gymadminpage")}
  className="flex ml-6 items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-400 to-pink-500"
>
  <span className="text-white">Dashboard</span>
</button>

<button
  onClick={() => navigate("/joinedMember")}
  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-700"
>
  <FaUsers /> Members
</button>

<button
  onClick={() => navigate("/trainers")}
  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-700"
>
  <FaUsers /> Trainers
</button>

<button
  onClick={() => {
    logout();  // Optional: use logout from context
    navigate("/login");
  }}
  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-700"
>
  <FiLogOut /> Logout
</button>

        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white p-6">
        <div className="flex justify-between bg-blue-600 p-4 rounded items-center mb-6">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}><AiOutlineMenu size={24} /></button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardCards.map((card, index) => (
            <div
              key={index}
              onClick={() => card.route && navigate(card.route)}
              className="cursor-pointer rounded-xl hover:border p-6 shadow-md h-52 bg-white text-black flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                {card.icon}
              </div>
              <p className="mt-4 font-semibold text-lg">{card.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
