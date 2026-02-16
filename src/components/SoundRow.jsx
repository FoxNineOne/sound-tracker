export default function SoundRow({
  row,
  soundName,
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
  return (
    <div className="rowsGridRow">
      <div>
        <strong>{soundName}</strong>
      </div>

      <div>
        <input
          type="text"
          className="rowLabel"
          value={row.label}
          onChange={(e) => updateLabel(row.rowId, e.target.value)}
        />
      </div>

      <div>
        <button
          className="hover-btn remove"
          onClick={() => removeSound(row.rowId)}
        >
          Remove
        </button>
      </div>

      {/* Frequency */}
      <div className="optionsRow freqCols">
        {frequencyBands.map((band) => (
          <label key={band} className="chkLabel">
            <input
              type="checkbox"
              className="hover-btn freq"
              checked={row.freqBands.includes(band)}
              onChange={() => toggleFreqBand(row.rowId, band)}
            />
          </label>
        ))}
      </div>

      {/* Stereo */}
      <div className="optionsRow stereoCols">
        {stereoPresences.map((presence) => (
          <label key={presence} className="chkLabel">
            <input
              type="checkbox"
              className="hover-btn stereo"
              checked={row.stereoPresences.includes(presence)}
              onChange={() => toggleStereo(row.rowId, presence)}
            />
          </label>
        ))}
      </div>

      {/* Depth */}
      <div className="optionsRow depthCols">
        {depths.map((depth) => (
          <label key={depth} className="chkLabel">
            <input
              type="checkbox"
              className="hover-btn depth"
              checked={row.depths.includes(depth)}
              onChange={() => toggleDepth(row.rowId, depth)}
            />
          </label>
        ))}
      </div>

      {/* Shape */}
      <div className="optionsRow shapeCols">
        {shapes.map((shape) => (
          <label key={shape} className="chkLabel">
            <input
              type="checkbox"
              className="hover-btn shape"
              checked={row.shapes.includes(shape)}
              onChange={() => toggleShape(row.rowId, shape)}
            />
          </label>
        ))}
      </div>
    </div>
  );
}
