// src/data/pieces.ts
import type { Piece as PieceDataType } from '../types/puzzle'; // Import the canonical Piece type

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

export const PIECES_JEF = [
  "aaie", "aaiw", "aaqw", "aawq", "aebe", "aefi", "aegm", "aeje", "aeki", "aekq",
  "aekw", "aeom", "aete", "aeuq", "aeuw", "aevi", "aibe", "aibm", "aice", "aidi",
  "aidm", "aihi", "aikq", "aiow", "aipq", "aise", "ambw", "amce", "amdi", "amfe",
  "amfm", "amhm", "amji", "amjm", "ampi", "ampq", "amrw", "amsq", "aqcq", "aqfe",
  "aqkq", "aqlm", "aqni", "aqnm", "aqpi", "aqsi", "aqti", "aqum", "aqvw", "awbe",
  "awbq", "awcm", "awhq", "awhw", "awjm", "awkq", "awpw", "awre", "awtw", "awvw",
  "bbgf", "bbkd", "bblo", "bckt", "bcsu", "bdcf", "bdlf", "bdvt", "bffr", "bfsh",
  "bfsu", "bgho", "bhrt", "bhvh", "bhvr", "bjtn", "bkgo", "bljs", "bllu", "blsn",
  "bltu", "bnfn", "bnhn", "bnjd", "bnlh", "bnrp", "bnso", "bnto", "bofu", "bonh",
  "botj", "bpdg", "bpdu", "bpjt", "brpk", "brsr", "bskp", "bssv", "bufh", "bugl",
  "bukh", "ccvf", "cfrt", "cfuf", "cggr", "cgjh", "cgul", "chgg", "chhl", "cjdj",
  "cjfu", "cjkg", "cjnp", "cjsh", "cjul", "cjvt", "ckkn", "clfo", "clgr", "cljr",
  "clsl", "clus", "cnhg", "cnno", "cnpo", "cnvf", "cods", "coot", "coov", "coug",
  "couv", "crjv", "crot", "csdf", "csjr", "csod", "ctgh", "ctjd", "ctuf", "cudn",
  "cuko", "cvfr", "cvvt", "ddgv", "ddnv", "ddov", "dfkp", "dhrs", "dhvt", "djnv",
  "djop", "djpt", "dkdv", "dkkk", "dknt", "dlgf", "dlhn", "dogg", "dovu", "dpjl",
  "dppr", "drht", "dsoj", "dssv", "dtlf", "dtps", "dtvj", "duok", "dusv", "duus",
  "dvhh", "fgpj", "fgpr", "fgso", "fhfo", "fhok", "fjht", "fjun", "fjvr", "fkfn",
  "fkpv", "flrp", "fngj", "fnku", "fpol", "fpro", "frgn", "frvu", "fskn", "fuhr",
  "fvlg", "fvvh", "gglk", "gglv", "ghpp", "ghss", "gjgk", "gknv", "glsj", "gngt",
  "gnrs", "gour", "groj", "grsr", "grss", "gspu", "gtjp", "gtuk", "gtup", "gvnv",
  "gvrv", "hkuv", "hnjt", "hnvu", "holv", "hotk", "hrrs", "hsht", "hulk", "huuk",
  "hvll", "hvop", "hvvr", "jkoo", "jltv", "jpor", "jppn", "jprl", "jrtr", "jsjt",
  "jskt", "jtpr", "jupp", "jusp", "kksr", "kktl", "klnr", "knpl", "kovr", "kpln",
  "kppn", "kptt", "krut", "kuts", "lnso", "lnsr", "loun", "lpsn", "lsnu", "lsrs",
  "ltor", "lttt", "lupt", "nopo", "nroo", "tuuu"
];

export const PIECES_JBLACKWOOD = [
  "aabf", "aabr", "aajr", "aarj", "abcb", "abgb", "abgn", "abhf", "abif", "abin",
  "abkj", "ablr", "abpj", "abvf", "afdn", "afeb", "afif", "afln", "afpb", "afpj",
  "afpr", "afqf", "afsb", "aftj", "aftr", "afuf", "ajef", "ajhj", "ajkb", "ajmb",
  "ajmn", "ajon", "ajpj", "ajsr", "ajtn", "ajub", "ajvb", "ancn", "anef", "anen",
  "angb", "anhf", "anir", "ankb", "ankj", "anqb", "anqn", "anvj", "anwr", "arcj",
  "arcr", "arhn", "arif", "arij", "arkr", "arpj", "arqn", "arsr", "arur", "arwf",
  "ccgs", "ccoh", "cddh", "cdhm", "cele", "cess", "chdq", "chqv", "chud", "cics",
  "ciev", "cilm", "cimo", "cite", "citp", "ckkd", "clid", "clos", "clpe", "clup",
  "cmgo", "cmim", "cmqu", "cmst", "cpts", "cslk", "csoo", "cssw", "csug", "cswi",
  "ctop", "cttp", "cucv", "cueq", "cugw", "cvvd", "cwet", "cwui", "cwvg", "cwwv",
  "ddgl", "ddop", "ddos", "ddwh", "dego", "deii", "deso", "dhlt", "dhqp", "dikg",
  "dkqe", "dkwe", "dlip", "dltw", "dmdu", "dmew", "dmwv", "doit", "dovq", "dpdq",
  "dpms", "dqem", "dsgg", "dsms", "dsws", "dtoh", "duqk", "dutk", "dutp", "dvkt",
  "dvle", "dwho", "dwlq", "dwvv", "dwvw", "eewi", "eguo", "ehet", "ehhs", "ehms",
  "ehut", "ehvg", "eigh", "eigo", "eklo", "ekwl", "elho", "emep", "emim", "empt",
  "eowk", "epkg", "epks", "eqsw", "eqtm", "ethq", "etil", "evpm", "evti", "ewhs",
  "ewst", "ewuh", "ggls", "ggms", "ghuq", "ghvl", "giip", "gimq", "gkkw", "gkqo",
  "glst", "gmht", "gpgs", "gpmu", "gppp", "gqhq", "gqku", "gqlk", "gqms", "gsui",
  "gtik", "gtlp", "gttv", "gtvs", "gukv", "gusq", "gvhl", "gvlq", "gvvs", "hlls",
  "hllu", "hlts", "hmkl", "hmml", "hoqw", "hotv", "hovo", "hppm", "hpui", "hqmk",
  "hqsu", "hqto", "hssu", "htpl", "hvqw", "hvti", "hwlu", "hwqs", "iiol", "ikqu",
  "iluq", "imul", "imvl", "imwk", "ioot", "ioqv", "iout", "iovm", "iqum", "ivpk",
  "ivvs", "iwkp", "iwvw", "kkmp", "kkmq", "kkqt", "klml", "klwq", "komp", "kopm",
  "kqtv", "kuot", "kuup", "kvmo", "kwoq", "kwqu", "llmw", "llqp", "lomv", "lswp",
  "ltmo", "lwou", "mtov", "mvwo", "mwpo", "oppu", "ousq", "ouuu", "ovwv", "ppvw",
  "ptuv", "puqv", "pwtu", "quqv", "qwuw", "tttu"
];

export const motifs_mapping_jef = [
	["00", "00"],
	["01", "08"],
	["02", "10"],
	["03", "16"],
	["04", "04"],
	["05", "0c"],
	["06", "07"],
	["07", "0f"],
	["08", "15"],
	["09", "03"],
	["0a", "0b"],
	["0b", "06"],
	["0c", "0e"],
	["0d", "14"],
	["0e", "02"],
	["0f", "0a"],
	["10", "05"],
	["11", "0d"],
	["12", "13"],
	["13", "01"],
	["14", "09"],
	["15", "12"],
	["16", "11"]
];

export const motifs_mapping_marie = [
	["00", "00"],
	["01", "01"], //
	["02", "09"],
	["03", "11"], //
	["04", "05"], //
	["05", "0d"],
	["06", "02"],
	["07", "0a"],
	["08", "12"], //
	["09", "06"], //
	["0a", "0e"], //
	["0b", "03"],
	["0c", "0b"],
	["0d", "13"],
	["0e", "07"],
	["0f", "0f"],
	["10", "04"], //
	["11", "0c"],
	["12", "14"],
	["13", "08"],
	["14", "10"],
	["15", "15"],
	["16", "16"]
];


// Each piece string is in order [UP, RIGHT, DOWN, LEFT]
export const allPieces: PieceDataType[] = PIECES.map((edgeStr, index) => ({
  id: index,
  edges: edgeStr.split("") as [string, string, string, string],
}));
