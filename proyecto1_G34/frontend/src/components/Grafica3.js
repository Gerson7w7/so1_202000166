import React, { PureComponent } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    sede: '1',
    votos: 2400,
  },
  {
    sede: '10',
    votos: 1398,
  },
  {
    sede: '15',
    votos: 9800,
  },
  {
    sede: '2',
    votos: 3908,
  },
  {
    sede: '7',
    votos: 4800,
  },
];

export default class Grafica3 extends PureComponent {
  render() {
    // const data = this.props.data;
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
          <XAxis stroke="#DAD7D7" dataKey="sede" />
          <YAxis stroke="#DAD7D7" />
          <Tooltip />
          <Legend />
          <Bar dataKey="votos" fill="#F2B155" background={{ fill: '#eee' }} />
        </BarChart>
    );
  }
}
