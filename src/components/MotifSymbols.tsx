import React from "react";

export const MotifSymbols: Record<string, React.FC<{ size: number }>> = {
  motif00: ({ size }) => (
    <polygon points="0,0 128,128 0,256" fill="#9a9a9a" stroke="#9a9a9a" strokeWidth="1" />
  ),
  motif01: ({ size }) => (
    <>
      <polygon points="0,0 128,128 0,256" fill="#26638e" stroke="black" strokeWidth="1" />
      <path d="M0,56 a16,16 0 1,1 8,32 v32 h32 a16,16 0 1,1 0,16 h-32 v32 a16,16 0 1,1 -8,32"
            fill="#f38622" stroke="#c1732d" strokeWidth="1" />
    </>
  ),
  motif02: ({ size }) => (
    <>
      <polygon points="0,0 128,128 0,256" fill="#5cc9f2" stroke="black" strokeWidth="1" />
      <path d="M0,0 m0,32 l32,32 l-8,8 l32,32 l8,-8 l32,32 l-32,32 l-8,-8 l-32,32 l8,8 l-32,32"
            fill="#ee3fa8" stroke="#8682bc" strokeWidth="1" />
    </>
  ),
  motif03: ({ size }) => (
    <>
      <polygon points="0,0 128,128 0,256" fill="#854aa3" stroke="black" strokeWidth="1" />
      <path d="M0,96 v-32 a64,64 30 0,1 0,128 v-40 l24,24 l24,-24 l-24,-24 l24,-24 l-24,-24 l-24,24"
            fill="#eced25" stroke="#c9bb4b" strokeWidth="1" />
    </>
  ),
  motif04: ({ size }) => (
    <>
      <polygon points="0,0 128,128 0,256" fill="#33b441" stroke="black" strokeWidth="1" />
      <path d="M0,64 h32 l32,32 v64 l-32,32 h-32 v-16 a48,48 30 1,0 0,-96"
            fill="#265e93" stroke="#3b6c8c" strokeWidth="1" />
    </>
  ),
  motif05: ({ size }) => (
    <>
      <polygon points="0,0 128,128 0,256" fill="#5cc9f2" stroke="black" strokeWidth="1" />
      <path d="M0,32 l32,32 l-8,40 l40,-8 l32,32 l-32,32 l-40,-8 l8,40 l-32,32"
            fill="#ee3fa8" stroke="#8682bc" />
    </>
  ),
  motif06: ({ size }) => (
    <>
      <polygon points="0,0 128,128 0,256" fill="#ac3c6b" stroke="black" strokeWidth="1" />
      <path d="M0,96 v-32 a64,64 30 0,1 0,128 v-40 l24,24 l24,-24 l-24,-24 l24,-24 l-24,-24 l-24,24"
            fill="#2bb35a" stroke="#76615e" strokeWidth="1" />
    </>
  ),
  motif07: ({ size }) => (
    <>
      <polygon points="0,0 128,128 0,256" fill="#ee3ea8" stroke="black" strokeWidth="1" />
      <path d="M0,56 a16,16 0 1,1 8,32 v32 h32 a16,16 0 1,1 0,16 h-32 v32 a16,16 0 1,1 -8,32"
            fill="#f0ed24" stroke="#d7ad60" strokeWidth="1" />
    </>
  ),
  motif08: ({ size }) => (
    <>
      <polygon points="0,0 128,128 0,256" fill="#f88512" stroke="black" strokeWidth="1" />
      <path d="M0,48 h16 a64,64 30 0,0 64,64 v32 a64,64 30 0,0 -64,64 h-16"
            fill="#80d5f8" stroke="#9ea599" strokeWidth="1" />
    </>
  ),
  motif09: ({ size }) => (
    <>
      <polygon points="0,0 128,128 0,256" fill="#265e92" stroke="black" strokeWidth="1" />
      <path d="M0,32 l96,96 l-96,96 v-32 l64,-64 l-64,-64"
            fill="#75cff2" stroke="#4585ad" strokeWidth="1" />
    </>
  ),
  motif0a: ({ size }) => (
    <>
      <polygon points="0,0 128,128 0,256" fill="#eded25" stroke="black" strokeWidth="1" />
      <path d="M0,32 l96,96 l-96,96 v-32 l64,-64 l-64,-64"
            fill="#2bb356" stroke="#cbcd2a" strokeWidth="1" />
    </>
  ),
  motif0b: ({ size }) => (
    <>
      <polygon points="0,0 128,128 0,256" fill="#32b459" stroke="black" strokeWidth="1" />
      <path d="M0,56 a16,16 0 1,1 8,32 v32 h32 a16,16 0 1,1 0,16 h-32 v32 a16,16 0 1,1 -8,32"
            fill="#ee3ea8" stroke="#698367" strokeWidth="1" />
    </>
  ),
  motif0c: ({ size }) => (
    <>
      <polygon points="0,0 128,128 0,256" fill="#831b43" stroke="black" strokeWidth="1" />
      <path d="M-8,128 m0,-40 a16,16 30 1,1 16,0 l32,32 a16,16 30 1,1 0,16 l-32,32 a16,16 30 1,1 -16,0 l8,-16 l24,-24 l-24,-24"
            fill="#f48614" stroke="#b76742" strokeWidth="1" />
    </>
  ),
  motif0d: ({ size }) => (
    <>
      <polygon points="0,0 128,128 0,256" fill="#fdf103" stroke="black" strokeWidth="1" />
      <path d="M0,0 m0,32 l32,32 l-8,8 l32,32 l8,-8 l32,32 l-32,32 l-8,-8 l-32,32 l8,8 l-32,32"
            fill="#145c8c" stroke="#8e9743" strokeWidth="1" />
    </>
  ),
  motif0e: ({ size }) => (
    <>
      <polygon points="0,0 128,128 0,256" fill="#2bb35a" stroke="black" strokeWidth="1" />
      <path d="M0,32 l32,32 l-8,40 l40,-8 l32,32 l-32,32 l-40,-8 l8,40 l-32,32"
            fill="#f4892a" stroke="#778e3d" />
    </>
  ),
  motif0f: ({ size }) => (
    <>
      <polygon points="0,0 128,128 0,256" fill="#864ba3" stroke="black" strokeWidth="1" />
      <path d="M0,32 l32,32 l-8,40 l40,-8 l32,32 l-32,32 l-40,-8 l8,40 l-32,32"
            fill="#b6e8f9" stroke="#8d8db2" />
    </>
  ),
  motif10: ({ size }) => (
    <>
      <polygon points="0,0 128,128 0,256" fill="#155c8c" stroke="black" strokeWidth="1" />
      <path d="M0,64 a32,32 30 0,1 32,32 a32,32 30 0,1 0,64 a32,32 30 0,1 -32,32 v-32 a32,32 30 0,0 0,-64"
            fill="#fef102" stroke="#7c8c48" strokeWidth="1" />
    </>
  ),
};

export type MotifSymbolId = keyof typeof MotifSymbols;
