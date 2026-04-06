import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

function Dashboard({ data }) {
  const chartData = data.map((r) => ({
    name: `C${r[0]}`,
    score: r[1],
  }));

  return (
    <BarChart width={400} height={300} data={chartData}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="score" />
    </BarChart>
  );
}

export default Dashboard;