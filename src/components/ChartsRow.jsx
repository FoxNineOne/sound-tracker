import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Legend,
  Cell,
} from "recharts";

export default function ChartsRow({
  freqChartData,
  stereoChartData,
  depthChartData,
  shapePieData,
  shapeColours,
  freqTotals,
  presTotals,
  depthTotals,
  shapeTotals,
}) {
  return (
    <section className="chartsRow">
      <div className="chartCard">
        <h2 className="freq">Frequency Totals</h2>
        <div style={{ width: 250, height: 200 }} width="100%" height="100%">
          <ResponsiveContainer
            minWidth="0"
            minHeight="0"
            width="100%"
            height="100%"
          >
            <AreaChart data={freqChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={{ fill: "white" }}
                tickLine={{ stroke: "white" }}
                stroke="white"
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "#ffffff00" }}
                tickLine={{ stroke: "#ffffff00" }}
                stroke="#ffffff"
              />
              {/*<Tooltip /> */}
              <Area
                type="monotone"
                dataKey="count"
                fill="aquamarine"
                tick={{ fill: "white" }}
                tickLine={{ stroke: "white" }}
                stroke="white"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <ul>
          {Object.entries(freqTotals).map(([k, v]) => (
            <li key={k}>
              {k}: {v}
            </li>
          ))}
        </ul>
      </div>

      <div className="chartCard">
        <h2 className="stereo">Stereo Totals</h2>

        <div style={{ width: 250, height: 200 }}>
          <ResponsiveContainer
            minWidth="0"
            minHeight="0"
            width="100%"
            height="100%"
          >
            <AreaChart data={stereoChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={{ fill: "white" }}
                tickLine={{ stroke: "white" }}
                stroke="white"
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "#ffffff00" }}
                tickLine={{ stroke: "#ffffff00" }}
                stroke="white"
              />
              {/* <Tooltip />  */}
              <Area
                type="monotone"
                dataKey="count"
                fill=" rgb(224, 164, 35)"
                tick={{ fill: "white" }}
                tickLine={{ stroke: "white" }}
                stroke="white"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <ul>
          {Object.entries(presTotals).map(([k, v]) => (
            <li key={k}>
              {k}: {v}
            </li>
          ))}
        </ul>
      </div>

      <div className="chartCard">
        <h2 className="depth">Depth Totals</h2>

        <div style={{ width: 250, height: 200 }}>
          <ResponsiveContainer
            minWidth="0"
            minHeight="0"
            width="100%"
            height="100%"
          >
            <AreaChart data={depthChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={{ fill: "white" }}
                tickLine={{ stroke: "white" }}
                stroke="white"
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "#ffffff00" }}
                tickLine={{ stroke: "#ffffff00" }}
                stroke="white"
              />
              {
                // <Tooltip /> //Do I need this?
              }
              <Area
                type="monotone"
                dataKey="count"
                fill="rgb(227, 81, 81)"
                tick={{ fill: "white" }}
                tickLine={{ stroke: "white" }}
                stroke="white"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <ul>
          {Object.entries(depthTotals).map(([k, v]) => (
            <li key={k}>
              {k}: {v}
            </li>
          ))}
        </ul>
      </div>

      <div className="chartCard">
        <h2 className="shape">Shape Totals</h2>

        <div style={{ width: 250, height: 200 }}>
          <ResponsiveContainer
            minWidth="0"
            minHeight="0"
            width="100%"
            height="100%"
          >
            <PieChart>
              <Pie
                data={shapePieData}
                dataKey={"value"}
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius="100%"
                innerRadius="20%"
              >
                {shapePieData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={shapeColours[index % shapeColours.length]}
                  />
                ))}
              </Pie>

              <Legend
                formatter={(value) => (
                  <span style={{ color: "white" }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul>
          {Object.entries(shapeTotals).map(([k, v]) => (
            <li key={k}>
              {k}: {v}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
