import SoundRow from "./SoundRow";

export default function SelectedSounds({
  selectedRows,
  fullLibrary,
  frequencyBands,
  stereoPresences,
  depths,
  shapes,
  updateLabel,
  removeSound,
  toggleFreqBand,
  toggleStereo,
  toggleDepth,
  toggleShape,
}) {
  if (selectedRows.length === 0) {
    return <p>No Sounds selected, add some sounds!</p>;
  }
  return (
    <div>
      {/* Header row (only when at least 1 selected row) */}
      <div className="rowsGridHeader">
        <div>
          <strong className="rowheaderlabel">Sound</strong>
        </div>
        <div>
          <strong className="rowheaderlabel">Label</strong>
        </div>
        <div></div>

        <div>
          <div className="headerGroupTitle freq">Frequency</div>
          <div className="headerOptionsRow freqCols">
            {frequencyBands.map((b) => (
              <span key={b}>{b}</span>
            ))}
          </div>
        </div>

        <div>
          <div className="headerGroupTitle stereo">Stereo</div>
          <div className="headerOptionsRow stereoCols">
            {stereoPresences.map((p) => (
              <span key={p}>{p}</span>
            ))}
          </div>
        </div>

        <div>
          <div className="headerGroupTitle depth">Depth</div>
          <div className="headerOptionsRow depthCols">
            {depths.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
        </div>

        <div>
          <div className="headerGroupTitle shape">Shape</div>
          <div className="headerOptionsRow shapeCols">
            {shapes.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Rows */}
      {selectedRows.map((row) => {
        const sound = fullLibrary.find((s) => s.id === row.soundId);
        const soundName = sound?.name ?? row.soundId;
        return (
          <SoundRow
            key={row.rowId}
            row={row}
            soundName={soundName}
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
        );
      })}
    </div>
  );
}
