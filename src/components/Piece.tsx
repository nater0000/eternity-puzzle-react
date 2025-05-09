import React from "react";
import MotifSvg from "./MotifSvg";
import MotifSymbols from "./MotifSymbols";

type Props = {
  edges: [string, string, string, string]; // [top, right, bottom, left]
  id: number;
  motifStyle: 'symbol' | 'svg';
};

const Piece: React.FC<Props> = ({ edges, id, motifStyle }) => {
  const renderMotif = (
    edge: string,
    direction: 'top' | 'right' | 'bottom' | 'left',
    index: number
  ) => {
    const commonProps = { edge, direction, key: index };
    if (motifStyle === 'symbol') {
      return <MotifSymbols {...commonProps} />;
    } else if (motifStyle === 'svg') {
      return <MotifSvg {...commonProps} />;
    }
    return null;
  };

  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full"
      shapeRendering="geometricPrecision"
    >
      <rect
        width="100"
        height="100"
        rx="8"
        fill="#f3f4f6"
        stroke="#4b5563"
        strokeWidth="2"
      />
      {edges.map((edge, i) =>
        renderMotif(edge, ["top", "right", "bottom", "left"][i] as any, i)
      )}
      <text
        x="50"
        y="55"
        textAnchor="middle"
        fontSize="12"
        fontWeight="bold"
        fill="#222"
      >
        {id}
      </text>
    </svg>
  );
};

export default Piece;
