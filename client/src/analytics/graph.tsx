import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";
import { TasksAnalyticsResponse } from "./analytics-types";

import "react-datepicker/dist/react-datepicker.css";

import { registerLocale } from "react-datepicker";
import {uk} from "date-fns/locale/uk";
registerLocale("ua", uk);

interface LocalParams {
  name: string;
  data: any[];
  width?: number,
  height?: number
}

const AnalyticsGraph = (params: LocalParams) => {
  const { data, name, width, height } = params;

  return (
    <>
      <LineChart
        width={width ?? 1000}
        height={height ?? 300}
        data={[{ name, data }]}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="uv"
          name={name}
          data={data}
          stroke="#82ca9d"
        />
      </LineChart>
    </>
  );
};

export default AnalyticsGraph;