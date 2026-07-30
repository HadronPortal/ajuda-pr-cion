export const TARGET_CITIES = [
  ["3500600", "Águas de São Pedro"],
  ["3501707", "Américo Brasiliense"],
  ["3502002", "Analândia"],
  ["3503208", "Araraquara"],
  ["3503307", "Araras"],
  ["3506706", "Boa Esperança do Sul"],
  ["3506805", "Bocaina"],
  ["3507902", "Brotas"],
  ["3511706", "Charqueada"],
  ["3512407", "Cordeirópolis"],
  ["3512704", "Corumbataí"],
  ["3513108", "Cravinhos"],
  ["3513702", "Descalvado"],
  ["3514007", "Dobrada"],
  ["3514106", "Dois Córregos"],
  ["3514304", "Dourado"],
  ["3516853", "Gavião Peixoto"],
  ["3518859", "Guatapará"],
  ["3519303", "Ibaté"],
  ["3521101", "Ipeúna"],
  ["3521408", "Iracemápolis"],
  ["3523602", "Itirapina"],
  ["3525300", "Jaú"],
  ["3526704", "Leme"],
  ["3526902", "Limeira"],
  ["3527603", "Luís Antônio"],
  ["3529302", "Matão"],
  ["3529807", "Mineiros do Tietê"],
  ["3532058", "Motuca"],
  ["3532900", "Nova Europa"],
  ["3539301", "Pirassununga"],
  ["3540705", "Porto Ferreira"],
  ["3540903", "Pradópolis"],
  ["3542909", "Ribeirão Bonito"],
  ["3543709", "Rincão"],
  ["3543907", "Rio Claro"],
  ["3546207", "Santa Cruz da Conceição"],
  ["3546306", "Santa Cruz das Palmeiras"],
  ["3546702", "Santa Gertrudes"],
  ["3546900", "Santa Lúcia"],
  ["3547007", "Santa Maria da Serra"],
  ["3547502", "Santa Rita do Passa Quatro"],
  ["3548906", "São Carlos"],
  ["3550407", "São Pedro"],
  ["3550902", "São Simão"],
  ["3553302", "Tambaú"],
  ["3554706", "Torrinha"],
  ["3554755", "Trabiju"],
];

export const normalizeCity = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();

export const TARGET_CITY_NAMES = new Map(
  TARGET_CITIES.map(([ibgeCode, name]) => [normalizeCity(name), { ibgeCode, name }]),
);
