import React from 'react';
import type { MotifStyle } from '../App';

interface ControlPanelProps {
  motifStyle: MotifStyle;
  setMotifStyle: (style: MotifStyle) => void;
  motifStyles: MotifStyle[];
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  motifStyle,
  setMotifStyle,
  motifStyles,
}) => {
  const handleStyleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMotifStyle(event.target.value as MotifStyle);
  };

  return (
    <div className="control-panel">
      <label htmlFor="motif-style">Motif Style: </label>
      <select
        id="motif-style"
        value={motifStyle}
        onChange={handleStyleChange}
      >
        {motifStyles.map((style) => (
          <option key={style} value={style}>
            {style}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ControlPanel;
