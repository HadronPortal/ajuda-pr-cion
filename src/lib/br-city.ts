/**
 * Normalização de nomes de municípios brasileiros para apresentação.
 * - Aplica caixa correta (Nome Próprio) com preposições em minúsculo
 * - Restaura acentuação usando dicionário de municípios conhecidos
 * - UF sempre em caixa alta
 * O valor original no banco não é alterado; a função só formata para exibição.
 */

const LOWER_WORDS = new Set([
  "de", "da", "do", "das", "dos", "e",
]);

/** Dicionário de municípios com acentuação canônica.
 *  Chave: nome sem acento, em minúsculo (com apóstrofos preservados).
 *  Valor: nome com acentuação/capitalização corretas.
 *  Cobre capitais, principais cidades e municípios paulistas/mineiros/
 *  paranaenses/nordestinos mais frequentes. Municípios não listados caem
 *  no title-case com regras de preposição. */
const CITY_DICTIONARY: Record<string, string> = {
  // Capitais e regiões metropolitanas
  "sao paulo": "São Paulo",
  "rio de janeiro": "Rio de Janeiro",
  "brasilia": "Brasília",
  "belo horizonte": "Belo Horizonte",
  "salvador": "Salvador",
  "fortaleza": "Fortaleza",
  "curitiba": "Curitiba",
  "recife": "Recife",
  "porto alegre": "Porto Alegre",
  "manaus": "Manaus",
  "belem": "Belém",
  "goiania": "Goiânia",
  "sao luis": "São Luís",
  "maceio": "Maceió",
  "teresina": "Teresina",
  "natal": "Natal",
  "campo grande": "Campo Grande",
  "joao pessoa": "João Pessoa",
  "aracaju": "Aracaju",
  "cuiaba": "Cuiabá",
  "florianopolis": "Florianópolis",
  "vitoria": "Vitória",
  "porto velho": "Porto Velho",
  "macapa": "Macapá",
  "rio branco": "Rio Branco",
  "boa vista": "Boa Vista",
  "palmas": "Palmas",
  // Municípios paulistas e mineiros frequentes
  "sao carlos": "São Carlos",
  "sao jose do rio preto": "São José do Rio Preto",
  "sao jose dos campos": "São José dos Campos",
  "sao jose do rio pardo": "São José do Rio Pardo",
  "sao bernardo do campo": "São Bernardo do Campo",
  "sao caetano do sul": "São Caetano do Sul",
  "sao vicente": "São Vicente",
  "sao sebastiao": "São Sebastião",
  "sao goncalo": "São Gonçalo",
  "ribeirao preto": "Ribeirão Preto",
  "ribeirao pires": "Ribeirão Pires",
  "sertaozinho": "Sertãozinho",
  "sorocaba": "Sorocaba",
  "santo andre": "Santo André",
  "santos": "Santos",
  "santa barbara d'oeste": "Santa Bárbara d'Oeste",
  "santa barbara doeste": "Santa Bárbara d'Oeste",
  "aguas de lindoia": "Águas de Lindóia",
  "amparo": "Amparo",
  "aracatuba": "Araçatuba",
  "araraquara": "Araraquara",
  "atibaia": "Atibaia",
  "avare": "Avaré",
  "barretos": "Barretos",
  "bauru": "Bauru",
  "birigui": "Birigui",
  "botucatu": "Botucatu",
  "braganca paulista": "Bragança Paulista",
  "campinas": "Campinas",
  "cascavel": "Cascavel",
  "catanduva": "Catanduva",
  "cotia": "Cotia",
  "cubatao": "Cubatão",
  "diadema": "Diadema",
  "embu": "Embu",
  "embu das artes": "Embu das Artes",
  "franca": "Franca",
  "guaruja": "Guarujá",
  "guarulhos": "Guarulhos",
  "hortolandia": "Hortolândia",
  "indaiatuba": "Indaiatuba",
  "itapecerica da serra": "Itapecerica da Serra",
  "itapetininga": "Itapetininga",
  "itapeva": "Itapeva",
  "itapevi": "Itapevi",
  "itaquaquecetuba": "Itaquaquecetuba",
  "itu": "Itu",
  "jacarei": "Jacareí",
  "jandira": "Jandira",
  "jau": "Jaú",
  "jundiai": "Jundiaí",
  "limeira": "Limeira",
  "lins": "Lins",
  "maua": "Mauá",
  "mococa": "Mococa",
  "mogi das cruzes": "Mogi das Cruzes",
  "mogi guacu": "Mogi Guaçu",
  "mogi mirim": "Mogi Mirim",
  "osasco": "Osasco",
  "ourinhos": "Ourinhos",
  "paulinia": "Paulínia",
  "piracicaba": "Piracicaba",
  "pirassununga": "Pirassununga",
  "praia grande": "Praia Grande",
  "presidente prudente": "Presidente Prudente",
  "registro": "Registro",
  "rio claro": "Rio Claro",
  "salto": "Salto",
  "santana de parnaiba": "Santana de Parnaíba",
  "sumare": "Sumaré",
  "suzano": "Suzano",
  "taboao da serra": "Taboão da Serra",
  "tatui": "Tatuí",
  "taubate": "Taubaté",
  "valinhos": "Valinhos",
  "varzea paulista": "Várzea Paulista",
  "vinhedo": "Vinhedo",
  "votorantim": "Votorantim",
  "americana": "Americana",
  "assis": "Assis",
  "ferraz de vasconcelos": "Ferraz de Vasconcelos",
  "francisco morato": "Francisco Morato",
  "franco da rocha": "Franco da Rocha",
  "aparecida": "Aparecida",
  "caraguatatuba": "Caraguatatuba",
  "ubatuba": "Ubatuba",
  // MG
  "uberlandia": "Uberlândia",
  "contagem": "Contagem",
  "juiz de fora": "Juiz de Fora",
  "betim": "Betim",
  "montes claros": "Montes Claros",
  "ribeirao das neves": "Ribeirão das Neves",
  "uberaba": "Uberaba",
  "governador valadares": "Governador Valadares",
  "ipatinga": "Ipatinga",
  "sete lagoas": "Sete Lagoas",
  "divinopolis": "Divinópolis",
  "santa luzia": "Santa Luzia",
  "ibirite": "Ibirité",
  "pocos de caldas": "Poços de Caldas",
  "patos de minas": "Patos de Minas",
  "teofilo otoni": "Teófilo Otoni",
  "varginha": "Varginha",
  // PR / SC / RS
  "londrina": "Londrina",
  "maringa": "Maringá",
  "ponta grossa": "Ponta Grossa",
  "sao jose dos pinhais": "São José dos Pinhais",
  "foz do iguacu": "Foz do Iguaçu",
  "colombo": "Colombo",
  "guarapuava": "Guarapuava",
  "paranagua": "Paranaguá",
  "toledo": "Toledo",
  "araucaria": "Araucária",
  "joinville": "Joinville",
  "blumenau": "Blumenau",
  "sao jose": "São José",
  "chapeco": "Chapecó",
  "criciuma": "Criciúma",
  "itajai": "Itajaí",
  "jaragua do sul": "Jaraguá do Sul",
  "lages": "Lages",
  "balneario camboriu": "Balneário Camboriú",
  "caxias do sul": "Caxias do Sul",
  "pelotas": "Pelotas",
  "canoas": "Canoas",
  "santa maria": "Santa Maria",
  "gravatai": "Gravataí",
  "viamao": "Viamão",
  "novo hamburgo": "Novo Hamburgo",
  "sao leopoldo": "São Leopoldo",
  "rio grande": "Rio Grande",
  "passo fundo": "Passo Fundo",
  // Nordeste
  "feira de santana": "Feira de Santana",
  "vitoria da conquista": "Vitória da Conquista",
  "camacari": "Camaçari",
  "juazeiro": "Juazeiro",
  "ilheus": "Ilhéus",
  "itabuna": "Itabuna",
  "jequie": "Jequié",
  "caruaru": "Caruaru",
  "petrolina": "Petrolina",
  "olinda": "Olinda",
  "jaboatao dos guararapes": "Jaboatão dos Guararapes",
  "paulista": "Paulista",
  "cabo de santo agostinho": "Cabo de Santo Agostinho",
  "juazeiro do norte": "Juazeiro do Norte",
  "caucaia": "Caucaia",
  "maracanau": "Maracanaú",
  "sobral": "Sobral",
  "mossoro": "Mossoró",
  "parnaiba": "Parnaíba",
  "imperatriz": "Imperatriz",
  // Norte / CO
  "ananindeua": "Ananindeua",
  "santarem": "Santarém",
  "maraba": "Marabá",
  "castanhal": "Castanhal",
  "varzea grande": "Várzea Grande",
  "rondonopolis": "Rondonópolis",
  "aparecida de goiania": "Aparecida de Goiânia",
  "anapolis": "Anápolis",
  "rio verde": "Rio Verde",
  "aguas lindas de goias": "Águas Lindas de Goiás",
  "luziania": "Luziânia",
  "valparaiso de goias": "Valparaíso de Goiás",
  "trindade": "Trindade",
  // RJ / ES
  "sao joao de meriti": "São João de Meriti",
  "duque de caxias": "Duque de Caxias",
  "nova iguacu": "Nova Iguaçu",
  "niteroi": "Niterói",
  "campos dos goytacazes": "Campos dos Goytacazes",
  "petropolis": "Petrópolis",
  "volta redonda": "Volta Redonda",
  "magé": "Magé",
  "mage": "Magé",
  "itaborai": "Itaboraí",
  "macae": "Macaé",
  "nova friburgo": "Nova Friburgo",
  "barra mansa": "Barra Mansa",
  "teresopolis": "Teresópolis",
  "resende": "Resende",
  "angra dos reis": "Angra dos Reis",
  "vila velha": "Vila Velha",
  "cariacica": "Cariacica",
  "serra": "Serra",
  "linhares": "Linhares",
  "cachoeiro de itapemirim": "Cachoeiro de Itapemirim",
};

const stripDiacritics = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const titleCaseWord = (word: string): string => {
  if (!word) return word;
  // Handle apostrophes like d'oeste -> d'Oeste
  if (word.includes("'")) {
    return word
      .split("'")
      .map((part, i) => (i === 0 ? part.toLowerCase() : capitalize(part)))
      .join("'");
  }
  // Hyphenated words: Belo-Horizonte / Trés-Rios
  if (word.includes("-")) {
    return word.split("-").map(capitalize).join("-");
  }
  return capitalize(word);
};

const capitalize = (word: string): string => {
  if (!word) return word;
  const lower = word.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
};

const titleCaseFallback = (name: string): string => {
  const words = name.trim().toLowerCase().split(/\s+/);
  return words
    .map((word, index) => {
      if (index > 0 && LOWER_WORDS.has(word)) return word;
      return titleCaseWord(word);
    })
    .join(" ");
};

/** Normaliza somente o nome do município (sem UF). */
export function normalizeCityName(raw: string): string {
  const trimmed = (raw || "").trim();
  if (!trimmed) return "";
  const key = stripDiacritics(trimmed)
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/’/g, "'");
  if (CITY_DICTIONARY[key]) return CITY_DICTIONARY[key];
  return titleCaseFallback(trimmed);
}

/** Normaliza uma string "Cidade - UF" para o formato de apresentação.
 *  Aceita separadores "-", "/" ou "," e também apenas a cidade. */
export function normalizeCityUf(value: string): string {
  const trimmed = (value || "").trim();
  if (!trimmed) return "";
  const match = trimmed.match(/^(.+?)\s*[-/,]\s*([A-Za-z]{2})\s*$/);
  if (match) {
    const city = normalizeCityName(match[1]);
    const uf = match[2].toUpperCase();
    return city ? `${city} - ${uf}` : uf;
  }
  return normalizeCityName(trimmed);
}
