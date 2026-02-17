import { useEffect, useState, useRef } from "react";
import { soundLibrary } from "./data/soundLibrary";
import ChartsRow from "./components/ChartsRow";
import SelectedSounds from "./components/SelectedSounds";
import {
  frequencyBands,
  stereoPresences,
  depths,
  shapes,
} from "./data/constants";

const LS_KEY = "sound-tracker:v1";

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

  const shapeColours = ["#4e46e581", "#a09cebbe"]; // transient, sustained

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

  const freqChartData = frequencyBands.map((band) => ({
    name: band,
    count: freqTotals[band],
  }));

  const stereoChartData = stereoPresences.map((presence) => ({
    name: presence,
    count: presTotals[presence],
  }));

  const depthChartData = depths.map((depth) => ({
    name: depth,
    count: depthTotals[depth],
  }));

  const shapePieData = shapes.map((shape) => ({
    name: shape,
    value: shapeTotals[shape],
  }));

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
    <div className="appShell">
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

      <ChartsRow
        freqChartData={freqChartData}
        stereoChartData={stereoChartData}
        depthChartData={depthChartData}
        shapePieData={shapePieData}
        freqTotals={freqTotals}
        presTotals={presTotals}
        depthTotals={depthTotals}
        shapeTotals={shapeTotals}
        shapeColours={shapeColours}
      />

      <section className="selectedPanel">
        <h2>Selected Sounds</h2>
        <SelectedSounds
          selectedRows={selectedRows}
          fullLibrary={fullLibrary}
          frequencyBands={frequencyBands}
          stereoPresences={stereoPresences}
          depths={depths}
          shapes={shapes}
          updateLabel={updateLabel}
          removeSound={removeSound}
          toggleFreqBand={toggleFreqBand}
          toggleStereo={toggleStereo}
          toggleDepth={toggleDepth}
          toggleShape={toggleShape}
        />
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
              <option value="" key="000" disabled>
                Add New Sound
              </option>

              {fullLibrary.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </p>
        </div>
      </section>

      <section className="actionsRow">
        <div>
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
        </div>
      </section>

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
