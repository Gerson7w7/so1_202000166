import React, { PureComponent } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const data01 = [
  { name: "UNE", value: 43 },
  { name: "VAMOS", value: 15 },
  { name: "FCN", value: 20 },
  { name: "UNIONISTA", value: 11 },
  { name: "VALOR", value: 11 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#DC5AE4",];

export default class Grafica2 extends PureComponent {
  render() {
    return (
      <PieChart width={400} height={280}>
        <Pie
          dataKey="value"
          isAnimationActive={false}
          data={data01}
          cx="50%"
          cy="50%"
          outerRadius={110}
          fill="#8884d8"
          label
        >
          {data01.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    );
  }
}
