// src/data/pieces.ts

/**
 * Eternity II piece codes in clockwise edge order (UP, RIGHT, DOWN, LEFT).
 * These are encoded as 4-letter strings where each letter is a motif key.
 */
export const PIECES = [
  "aabd", "aabe", "aacd", "aadc", "abgb", "abhc", "abjb", "abjf", "abmd", "aboe",
  "abpc", "abte", "abtf", "abve", "achb", "acid", "ackf", "acnf", "acoc", "acpc",
  "acqe", "acrb", "acrf", "acsb", "acvb", "adgc", "adgd", "adhd", "adid", "adof",
  "adpc", "adsd", "adtc", "adte", "aduf", "adwe", "aeib", "aelf", "aemf", "aenc",
  "aend", "aepb", "aepc", "aepd", "aeqb", "aese", "aete", "aeue", "afgf", "afhb",
  "afhc", "afjb", "afoe", "afqe", "afqf", "aftd", "afub", "afuf", "afvc", "afwd",
  "ggji", "ggko", "ghhl", "gigt", "giiw", "gikk", "gimh", "gisj", "giwt", "gllo",
  "glor", "gmki", "gmpq", "gmsp", "gmtl", "gnkp", "gnnp", "golu", "gosl", "gouv",
  "gpni", "gqii", "gqmq", "grin", "grjk", "grtr", "grus", "gsgv", "gsjw", "gsqu",
  "gtmr", "gtnp", "gtnq", "gtqv", "gtrk", "gvvl", "gwqn", "gwst", "gwvj", "gwwv",
  "hhrp", "hhru", "hhun", "hhwj", "hiqp", "hjlt", "hjnt", "hjqp", "hjum", "hkpr",
  "hkrp", "hlsn", "hlsu", "hmkq", "hmor", "hmrm", "hmwu", "hnlv", "hour", "hptw",
  "hqkw", "hsju", "hskn", "hssp", "htrw", "htvp", "hukj", "hunv", "huql", "hust",
  "hvjs", "hvrk", "hwku", "hwmq", "hwql", "hwus", "iiso", "ijjl", "ijjm", "ijjr",
  "ijnv", "ijpj", "ijur", "ijvv", "iklq", "ilir", "iliw", "illk", "ilpr", "injm",
  "inqw", "iomm", "iomn", "iowu", "iqoo", "iqor", "iqwo", "isou", "istj", "itvv",
  "iujs", "iuks", "iwpm", "iwqu", "jklq", "jkqt", "jmll", "jnmp", "jnnv", "joqt",
  "josu", "jovm", "jppp", "jprs", "jqov", "jron", "jskq", "jtru", "jttp", "juou",
  "jvmu", "jvom", "kknt", "klwo", "kmnr", "kmtt", "knvo", "kokv", "koln", "koun",
  "kpll", "kpps", "kqmo", "krvm", "krvw", "krwp", "ksmw", "ksnt", "ksss", "ktnl",
  "kuvt", "kuwo", "kvrn", "kvrt", "kvul", "kvwv", "llwo", "lmnw", "lmtp", "lomn",
  "loup", "lplu", "lqtt", "lrls", "lrqw", "lrwv", "lsnp", "luqr", "lvmq", "lwmu",
  "lwvv", "lwvw", "mmrw", "mmso", "mmup", "monp", "morr", "mqnt", "msow", "msut",
  "mtrs", "mtrv", "nnns", "nouq", "nqoq", "nqos", "nqrp", "nrqu", "nspw", "nsvp",
  "ntov", "ntqv", "oppr", "opst", "oqws", "ovuw", "ppvw", "pqrq", "prqv", "psuv",
  "qqwt", "qrtr", "rtus", "suvu", "swuw", "twvw"
];

// Each piece string is in order [UP, RIGHT, DOWN, LEFT]
export type PieceData = {
  id: number;
  edges: [string, string, string, string];
};

export const allPieces: PieceData[] = PIECES.map((edgeStr, index) => ({
  id: index,
  edges: edgeStr.split("") as [string, string, string, string],
}));
