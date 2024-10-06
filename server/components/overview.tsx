"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Đăng ký các thành phần cần thiết của Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface OverviewProps {
  data: { name: string; total: number }[];
  title: string;
}

const Overview = ({ data, title }: OverviewProps) => {
  // Tạo dataset cho biểu đồ
  const chartData = {
    labels: data.map((item) => item.name), // Tên tháng
    datasets: [
      {
        label: title,
        data: data.map((item) => item.total), // Tổng số theo tháng hoặc trạng thái
        backgroundColor: "#84B74E",
        borderRadius: 4,
      },
    ],
  };

  // Cấu hình biểu đồ
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Để tự do thay đổi chiều cao
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          display: true,
        },
        ticks: {
          stepSize: 10,
        },
      },
    },
  };

  // Đặt chiều cao và chiều rộng cố định cho container của biểu đồ
  return (
    <div style={{ width: "100%", height: "400px" }}>
      {" "}
      {/* Giữ chiều cao cố định */}
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default Overview;
