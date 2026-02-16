import { useEffect, useState, useRef } from "react";

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
const LS_KEY = "sound-tracker:v1";

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
  const fileInputRef = useRef(null);
  const savedData = (() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  })();

  const [selectedRows, setSelectedRows] = useState(
    savedData.selectedRows ?? [],
  );

  const [customSounds, setCustomSounds] = useState(
    savedData.customSounds ?? [],
  );

  const fullLibrary = [...soundLibrary, ...customSounds];

  const [selectedSoundId, setSelectedSoundId] = useState("");

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

  const SHAPE_COLORS = ["#4e46e581", "#a09cebbe"]; // transient, sustained

  function addSound(soundId) {
    const sound = fullLibrary.find((sound) => sound.id === soundId);
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

  function exportProject() {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      app: "sound-tracker",
      selectedRows,
      customSounds,
    };

    const json = JSON.stringify(payload, null, 2); // pretty
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const stamp = new Date().toISOString().slice(0, 19).replaceAll(":", "-");
    const filename = `sound-tracker-export-${stamp}.json`;

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  }

  function importProjectFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const text = String(reader.result ?? "");
        const data = JSON.parse(text);

        // ✅ Minimal validation: must contain an array called selectedRows
        if (!data || !Array.isArray(data.selectedRows)) {
          alert("Invalid file: missing selectedRows array.");
          return;
        }

        // Optional: soft-validate rows have expected keys
        const rows = data.selectedRows.filter(
          (r) =>
            r &&
            typeof r === "object" &&
            typeof r.rowId === "string" &&
            typeof r.soundId === "string" &&
            Array.isArray(r.freqBands),
        );

        if (rows.length !== data.selectedRows.length) {
          const ok = window.confirm(
            "Some rows in this file look invalid and will be skipped. Continue?",
          );
          if (!ok) return;
        }

        setSelectedRows(rows);

        // Reset the file input so importing the same file again still triggers change
        event.target.value = "";
      } catch (err) {
        alert("Could not import file. Is it valid JSON?");
      }
    };

    reader.readAsText(file);
  }

  useEffect(() => {
    const payload = { selectedRows, customSounds };
    localStorage.setItem(LS_KEY, JSON.stringify(payload));
  }, [selectedRows, customSounds]);

  return (
    <div>
      <header>
        <h1>Sound Tracker</h1>
        <p className="center">
          {" "}
          Keep your music projects balanced{" "}
          <img
            src="/img/information.png"
            width="1.5%"
            alt="More Info"
            className="hover-img"
            onClick={() => console.log("Meow")}
          ></img>{" "}
        </p>
      </header>
      {/*
      <h2>Sound Library</h2>

      <ul>
        {soundLibrary.map((sound) => (
          <li key={sound.id} className="soundLibrary">
            {sound.name}{" "}
            <button className="hover-btn" onClick={() => addSound(sound.id)}>
              Add
            </button>{" "}
          </li>
        ))}
      </ul>
*/}
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
              const sound = fullLibrary.find(
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
                    className="hover-btn"
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
                          className="hover-btn freq"
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
                          className="hover-btn stereo"
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
                          className="hover-btn depth"
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
                          className="hover-btn shape"
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
        <p>
          <select
            value={selectedSoundId}
            onChange={(e) => {
              const id = e.target.value;
              addSound(id);
              setSelectedSoundId("");
            }}
          >
            <option value="" disabled>
              Add New Sound
            </option>

            {soundLibrary.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <br />
          <br />
          {
            //Clear Button
          }
          {selectedRows.length > 0 && (
            <button
              className="hover-btn clear"
              onClick={() => {
                const confirmed = window.confirm(
                  "Are you sure you want to clear all sounds?",
                );
                if (confirmed) {
                  setSelectedRows([]);
                }
              }}
            >
              Clear List
            </button>
          )}
          &nbsp;&nbsp;&nbsp;&nbsp;
          <button
            className="hover-btn import"
            onClick={() => fileInputRef.current?.click()}
          >
            Import Project
          </button>
          <input
            type="file"
            accept="application/json"
            ref={fileInputRef}
            onChange={importProjectFile}
            style={{ display: "none" }}
          />
          {
            //Export Button
          }
          &nbsp;&nbsp;&nbsp;&nbsp;
          {(selectedRows.length > 0 || customSounds.length > 0) && (
            <button className="hover-btn export" onClick={exportProject}>
              Export project
            </button>
          )}
        </p>
      </div>
      <div>
        <h2 className="freq">Frequency Totals</h2>
        <ul>
          {frequencyBands.map((band) => (
            <li key={band}>
              {band}: {freqTotals[band]}
            </li>
          ))}
        </ul>

        <div style={{ width: 250, height: 200 }} width="100%" height="100%">
          <ResponsiveContainer
            minWidth="0"
            minHeight="0"
            width="100%"
            height="100%"
          >
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
                tick={{ fill: "#ffffff00" }}
                tickLine={{ stroke: "#ffffff00" }}
                stroke="#ffffff"
              />
              {
                //<Tooltip /> //Do I need this?
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

        <div style={{ width: 250, height: 200 }}>
          <ResponsiveContainer
            minWidth="0"
            minHeight="0"
            width="100%"
            height="100%"
          >
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

        <div style={{ width: 250, height: 200 }}>
          <ResponsiveContainer
            minWidth="0"
            minHeight="0"
            width="100%"
            height="100%"
          >
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

        <h2 className="shape">Shape Totals</h2>
        <ul>
          {shapes.map((shape) => (
            <li key={shape}>
              {shape} : {shapeTotals[shape]}
            </li>
          ))}
        </ul>

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
      <footer className="center">
        <p>
          Created by{" "}
          <a
            href="https://github.com/FoxNineOne"
            target="_blank"
            rel="noreferrer"
          >
            FoxNineOne
          </a>
          , Inspired by the teachings of{" "}
          <a
            href="https://www.itsnavied.com/choice"
            target="_blank"
            rel="noreferrer"
          >
            Navie D
          </a>
        </p>
      </footer>
    </div>
  );
}
