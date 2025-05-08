import React from "react";

type Props = {
  motifStyle: 'circle' | 'symbol';
  setMotifStyle: (style: 'circle' | 'symbol') => void;
};

const ControlPanel: React.FC<Props> = ({ motifStyle, setMotifStyle }) => {
  return (
    <div className="flex items-center gap-4">
      <label htmlFor="motifStyle" className="text-sm font-medium">
        Motif Style:
      </label>
      <select
        id="motifStyle"
        value={motifStyle}
        onChange={(e) => setMotifStyle(e.target.value as 'circle' | 'symbol')}
        className="bg-zinc-800 text-white p-1 rounded"
      >
        <option value="circle">🎯 Circle</option>
        <option value="symbol">🖼 Symbol</option>
      </select>
    </div>
  );
};

export default ControlPanel;
