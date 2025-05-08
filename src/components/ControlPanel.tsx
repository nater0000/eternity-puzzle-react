import React from 'react';
import './ControlPanel.css'; // adjust if needed
import MotifSymbols from './MotifSymbols';

interface ControlPanelProps {
  motifStyle: string;
  setMotifStyle: (style: string) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ motifStyle, setMotifStyle }) => {
  return (
    <div className="control-panel">
      <label htmlFor="motif-style">Motif Style:</label>
      <select
        id="motif-style"
        value={motifStyle}
        onChange={(e) => setMotifStyle(e.target.value)}
      >
        {Object.keys(MotifSymbols).map((key) => (
          <option key={key} value={key}>
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ControlPanel;
