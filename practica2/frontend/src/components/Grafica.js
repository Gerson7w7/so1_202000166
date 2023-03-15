import React, { PureComponent } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default class Grafica extends PureComponent {
  render() {
    const data = this.props.data;

    return (
      <div>
        <AreaChart
          width={500}
          height={400}
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis stroke="#DAD7D7" dataKey="name" />
          <YAxis
            stroke="#DAD7D7"
            label={{
              value: `%`,
              style: { textAnchor: "middle" },
              position: "left",
              offset: -20,
              stroke: "#DAD7D7",
              width: 25,
            }}
            domain={[0, 100]}
          />
          <Tooltip />
          <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
      </div>
    );
  }
}
