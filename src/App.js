import { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Legend,
  Cell,
} from "recharts";

const soundLibrary = [
  {
    id: "ambience",
    name: "Ambience",
    defaultFreqBands: ["low-mid", "mid"],
    defaultStereoPresence: ["medium", "wide"],
    defaultDepth: ["back"],
    defaultShape: ["transient", "sustained"],
  },
  {
    id: "arp",
    name: "Arpeggiator",
    defaultFreqBands: ["low-mid", "mid", "high"],
    defaultStereoPresence: ["narrow", "medium"],
    defaultDepth: ["front", "middle"],
    defaultShape: ["transient"],
  },
  {
    id: "bass",
    name: "Bass",
    defaultFreqBands: ["low", "low-mid"],
    defaultStereoPresence: ["narrow", "wide"],
    defaultDepth: ["front"],
    defaultShape: ["transient", "sustained"],
  },
  {
    id: "bell",
    name: "Bell",
    defaultFreqBands: ["mid", "high"],
    defaultStereoPresence: ["narrow", "medium"],
    defaultDepth: ["front", "middle"],
    defaultShape: ["transient"],
  },
  {
    id: "brass",
    name: "Brass",
    defaultFreqBands: ["low-mid", "mid", "high"],
    defaultStereoPresence: ["narrow", "medium"],
    defaultDepth: ["front", "middle"],
    defaultShape: ["transient", "sustained"],
  },
  {
    id: "flute",
    name: "Flute",
    defaultFreqBands: ["mid", "high"],
    defaultStereoPresence: ["narrow", "medium"],
    defaultDepth: ["front", "middle"],
    defaultShape: ["transient", "sustained"],
  },
  {
    id: "guitar",
    name: "Guitar",
    defaultFreqBands: ["low-mid", "mid", "high"],
    defaultStereoPresence: ["narrow", "medium"],
    defaultDepth: ["middle", "back"],
    defaultShape: ["transient"],
  },
  {
    id: "keys",
    name: "Keys",
    defaultFreqBands: ["low-mid", "mid", "high"],
    defaultStereoPresence: ["narrow", "medium"],
    defaultDepth: ["front", "middle"],
    defaultShape: ["transient"],
  },
  {
    id: "lead",
    name: "Lead",
    defaultFreqBands: ["mid", "high"],
    defaultStereoPresence: ["narrow", "medium"],
    defaultDepth: ["front", "middle"],
    defaultShape: ["sustained"],
  },
  {
    id: "organ",
    name: "Organ",
    defaultFreqBands: ["low-mid", "mid"],
    defaultStereoPresence: ["narrow", "medium"],
    defaultDepth: ["front", "middle"],
    defaultShape: ["sustained"],
  },
  {
    id: "pad",
    name: "Pad",
    defaultFreqBands: ["low-mid", "mid"],
    defaultStereoPresence: ["medium", "wide"],
    defaultDepth: ["middle", "back"],
    defaultShape: ["sustained"],
  },
  {
    id: "percussion",
    name: "Percussion",
    defaultFreqBands: ["mid", "high"],
    defaultStereoPresence: ["narrow", "medium", "wide"],
    defaultDepth: ["front", "middle"],
    defaultShape: ["transient"],
  },
  {
    id: "pluck",
    name: "Pluck",
    defaultFreqBands: ["mid", "high"],
    defaultStereoPresence: ["narrow", "medium"],
    defaultDepth: ["front", "middle"],
    defaultShape: ["transient"],
  },
  {
    id: "strings",
    name: "Strings",
    defaultFreqBands: ["mid", "high"],
    defaultStereoPresence: ["medium", "wide"],
    defaultDepth: ["middle", "back"],
    defaultShape: ["sustained"],
  },
  {
    id: "synth",
    name: "Synthesizer",
    defaultFreqBands: ["low-mid", "mid", "high"],
    defaultStereoPresence: ["narrow", "medium", "wide"],
    defaultDepth: ["front", "middle"],
    defaultShape: ["transient", "sustained"],
  },
];

const frequencyBands = ["low", "low-mid", "mid", "high"];
const stereoPresences = ["narrow", "medium", "wide"];
const depths = ["front", "middle", "back"];
const shapes = ["transient", "sustained"];

export default function App() {
  const [selectedRows, setSelectedRows] = useState([]);

  const freqTotals = frequencyBands.reduce((acc, band) => {
    acc[band] = 0;
    return acc;
  }, {});

  const presTotals = stereoPresences.reduce((acc, presence) => {
    acc[presence] = 0;
    return acc;
  }, {});

  const depthTotals = depths.reduce((acc, depth) => {
    acc[depth] = 0;
    return acc;
  }, {});

  const shapeTotals = shapes.reduce((acc, shape) => {
    acc[shape] = 0;
    return acc;
  }, {});

  selectedRows.forEach((row) => {
    row.freqBands.forEach((band) => {
      freqTotals[band] += 1;
    });
    row.stereoPresences.forEach((presence) => {
      presTotals[presence] += 1;
    });

    row.depths.forEach((depth) => {
      depthTotals[depth] += 1;
    });

    row.shapes.forEach((shape) => {
      shapeTotals[shape] += 1;
    });
  });

  const freqAreaData = frequencyBands.map((band) => ({
    band,
    count: freqTotals[band],
  }));

  const presAreaData = stereoPresences.map((presence) => ({
    presence,
    count: presTotals[presence],
  }));

  const depthAreaData = depths.map((depth) => ({
    depth,
    count: depthTotals[depth],
  }));

  const shapePieData = shapes.map((shape) => ({
    name: shape,
    value: shapeTotals[shape],
  }));

  const shapeOptions = ["transient", "sustained"];
  const SHAPE_COLORS = ["#4e46e581", "#a09cebbe"]; // transient, sustained

  function addSound(soundId) {
    const sound = soundLibrary.find((sound) => sound.id === soundId);
    if (!sound) return;
    const newRow = {
      rowId: crypto.randomUUID(),
      soundId: sound.id,
      freqBands: [...sound.defaultFreqBands],
      stereoPresences: [...sound.defaultStereoPresence],
      depths: [...sound.defaultDepth],
      shapes: [...sound.defaultShape],
      label: "",
    };
    setSelectedRows((rows) => [...rows, newRow]);
  }

  function updateLabel(rowId, value) {
    setSelectedRows((rows) =>
      rows.map((row) => (row.rowId === rowId ? { ...row, label: value } : row)),
    );
  }

  function removeSound(rowId) {
    setSelectedRows((rows) => rows.filter((row) => row.rowId !== rowId));
  }

  function toggleFreqBand(rowId, band) {
    setSelectedRows((rows) =>
      rows.map((row) => {
        if (row.rowId !== rowId) return row;

        const has = row.freqBands.includes(band);
        const next = has
          ? row.freqBands.filter((b) => b !== band)
          : [...row.freqBands, band];
        return { ...row, freqBands: next };
      }),
    );
  }

  function toggleStereo(rowId, presence) {
    setSelectedRows((rows) =>
      rows.map((row) => {
        if (row.rowId !== rowId) return row;

        const has = row.stereoPresences.includes(presence);
        const next = has
          ? row.stereoPresences.filter((p) => p !== presence)
          : [...row.stereoPresences, presence];

        return { ...row, stereoPresences: next };
      }),
    );
  }

  function toggleDepth(rowId, depth) {
    setSelectedRows((rows) =>
      rows.map((row) => {
        if (row.rowId !== rowId) return row;

        const has = row.depths.includes(depth);
        const next = has
          ? row.depths.filter((d) => d !== depth)
          : [...row.depths, depth];

        return { ...row, depths: next };
      }),
    );
  }

  function toggleShape(rowId, shape) {
    setSelectedRows((rows) =>
      rows.map((row) => {
        if (row.rowId !== rowId) return row;

        const has = row.shapes.includes(shape);
        const next = has
          ? row.shapes.filter((s) => s !== shape)
          : [...row.shapes, shape];
        return { ...row, shapes: next };
      }),
    );
  }

  return (
    <div>
      <h1>Sound Tracker</h1>
      <h2>Sound Library</h2>

      <ul>
        {soundLibrary.map((sound) => (
          <li key={sound.id} className="soundLibrary">
            {sound.name}{" "}
            <button onClick={() => addSound(sound.id)}>Add</button>{" "}
          </li>
        ))}
      </ul>
      <h2>Selected Sounds</h2>
      {selectedRows.length === 0 ? (
        <p>No Sounds selected, add some sounds!</p>
      ) : (
        <div>
          <h3>
            {" "}
            <span className="freq">Frequency</span>
            {" | "}
            <span className="stereo">Stereo Width</span>
            {" | "}
            <span className="depth">Depth</span> {" | "}
            <span className="shape">Sound Shape</span>
          </h3>
          <ul>
            {selectedRows.map((row) => {
              const sound = soundLibrary.find(
                (sound) => sound.id === row.soundId,
              );

              return (
                <li key={row.rowId} style={{ marginBottom: 12 }}>
                  <strong>{sound?.name ?? row.soundId}</strong>
                  <input
                    type="text"
                    className="rowLabel"
                    style={{ marginLeft: 12 }}
                    value={row.label}
                    onChange={(e) => updateLabel(row.rowId, e.target.value)}
                  ></input>
                  <button
                    style={{ marginLeft: 12 }}
                    onClick={() => removeSound(row.rowId)}
                  >
                    Remove
                  </button>
                  <div>
                    {
                      //Freq
                    }
                    {frequencyBands.map((band) => (
                      <label key={band} style={{ marginRight: 12 }}>
                        <input
                          type="checkbox"
                          className="freq"
                          style={{ marginLeft: 1, marginRight: 1 }}
                          checked={row.freqBands.includes(band)}
                          onChange={() => toggleFreqBand(row.rowId, band)}
                        />
                      </label>
                    ))}
                    {
                      "|" //stereoPresence
                    }
                    {stereoPresences.map((presence) => (
                      <label
                        key={presence}
                        style={{ marginLeft: 12, marginRight: 12 }}
                      >
                        <input
                          type="checkbox"
                          className="stereo"
                          style={{ marginLeft: 1, marginRight: 1 }}
                          checked={row.stereoPresences.includes(presence)}
                          onChange={() => toggleStereo(row.rowId, presence)}
                        />
                      </label>
                    ))}
                    {
                      "|" // depth
                    }
                    {depths.map((depth) => (
                      <label
                        key={depth}
                        style={{ marginLeft: 12, marginRight: 12 }}
                      >
                        <input
                          type="checkbox"
                          className="depth"
                          style={{ marginLeft: 1, marginRight: 1 }}
                          checked={row.depths.includes(depth)}
                          onChange={() => toggleDepth(row.rowId, depth)}
                        />
                      </label>
                    ))}
                    {
                      "|" // shape
                    }
                    {shapes.map((shape) => (
                      <label
                        key={shape}
                        style={{ marginLeft: 12, marginRight: 12 }}
                      >
                        <input
                          type="checkbox"
                          className="shape"
                          style={{ marginLeft: 1, marginRight: 1 }}
                          checked={row.shapes.includes(shape)}
                          onChange={() => toggleShape(row.rowId, shape)}
                        />
                      </label>
                    ))}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      <div>
        <h2 className="freq">Frequency Totals</h2>
        <ul>
          {frequencyBands.map((band) => (
            <li key={band}>
              {band}: {freqTotals[band]}
            </li>
          ))}
        </ul>

        <div style={{ width: "25%", height: 150 }}>
          <ResponsiveContainer>
            <AreaChart data={freqAreaData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="band"
                tick={{ fill: "white" }}
                tickLine={{ stroke: "white" }}
                stroke="white"
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "white" }}
                tickLine={{ stroke: "white" }}
                stroke="white"
              />
              {
                // <Tooltip /> //Do I need this?
              }
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

        <h2 className="stereo">Stereo Totals</h2>
        <ul>
          {stereoPresences.map((presence) => (
            <li key={presence}>
              {presence} : {presTotals[presence]}
            </li>
          ))}
        </ul>

        <div style={{ width: "25%", height: 150 }}>
          <ResponsiveContainer>
            <AreaChart data={presAreaData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="presence"
                tick={{ fill: "white" }}
                tickLine={{ stroke: "white" }}
                stroke="white"
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "white" }}
                tickLine={{ stroke: "white" }}
                stroke="white"
              />
              {
                // <Tooltip /> //Do I need this?
              }
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

        <h2 className="depth">Depth Totals</h2>
        <ul>
          {depths.map((depth) => (
            <li key={depth}>
              {depth} : {depthTotals[depth]}
            </li>
          ))}
        </ul>

        <div style={{ width: "25%", height: 150 }}>
          <ResponsiveContainer>
            <AreaChart data={depthAreaData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="depth"
                tick={{ fill: "white" }}
                tickLine={{ stroke: "white" }}
                stroke="white"
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "white" }}
                tickLine={{ stroke: "white" }}
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

        <h2 className="shape">Shape Totals</h2>
        <ul>
          {shapes.map((shape) => (
            <li key={shape}>
              {shape} : {shapeTotals[shape]}
            </li>
          ))}
        </ul>

        <div style={{ width: "25%", height: 150 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={shapePieData}
                dataKey={"value"}
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius="80%"
              >
                {shapePieData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={SHAPE_COLORS[index % SHAPE_COLORS.length]}
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
      </div>
    </div>
  );
}
