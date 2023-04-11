import React, { PureComponent } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default class Grafica1 extends PureComponent {
  render() {
    const data = this.props.data;
    return (
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis stroke="#DAD7D7" dataKey="departamento" />
          <YAxis stroke="#DAD7D7" />
          <Tooltip />
          <Legend />
          <Bar dataKey="votos" fill="#82ca9d" />
        </BarChart>
    );
  }
}
