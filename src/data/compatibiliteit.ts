export const TEKENS = [
  "Ram", "Stier", "Tweelingen", "Kreeft", "Leeuw", "Maagd",
  "Weegschaal", "Schorpioen", "Boogschutter", "Steenbok", "Waterman", "Vissen"
] as const;

export type Teken = typeof TEKENS[number];

export const TEKEN_EMOJI: Record<Teken, string> = {
  Ram: "♈", Stier: "♉", Tweelingen: "♊", Kreeft: "♋",
  Leeuw: "♌", Maagd: "♍", Weegschaal: "♎", Schorpioen: "♏",
  Boogschutter: "♐", Steenbok: "♑", Waterman: "♒", Vissen: "♓",
};

export const TEKEN_ELEMENT: Record<Teken, string> = {
  Ram: "Vuur", Stier: "Aarde", Tweelingen: "Lucht", Kreeft: "Water",
  Leeuw: "Vuur", Maagd: "Aarde", Weegschaal: "Lucht", Schorpioen: "Water",
  Boogschutter: "Vuur", Steenbok: "Aarde", Waterman: "Lucht", Vissen: "Water",
};

export const ELEMENT_KLEUR: Record<string, string> = {
  Vuur: "#e74c3c", Aarde: "#8B6914", Lucht: "#3498db", Water: "#1abc9c",
};

export interface CompatibiliteitScore {
  score: number; // 1-10
  niveau: "Uitdagend" | "Gemiddeld" | "Goed" | "Uitstekend";
  samenvatting: string;
  sterktes: string[];
  uitdagingen: string[];
}

// Compatibiliteitsmatrix gebaseerd op traditionele astrologische elementen en kwaliteiten
// Kardinaal: Ram, Kreeft, Weegschaal, Steenbok
// Vast: Stier, Leeuw, Schorpioen, Waterman
// Veranderlijk: Tweelingen, Maagd, Boogschutter, Vissen

const SCORES: Record<string, number> = {
  // Zelfde teken
  "Ram-Ram": 7, "Stier-Stier": 8, "Tweelingen-Tweelingen": 7, "Kreeft-Kreeft": 8,
  "Leeuw-Leeuw": 7, "Maagd-Maagd": 7, "Weegschaal-Weegschaal": 8, "Schorpioen-Schorpioen": 7,
  "Boogschutter-Boogschutter": 8, "Steenbok-Steenbok": 7, "Waterman-Waterman": 8, "Vissen-Vissen": 8,
  // Vuur + Vuur (Ram, Leeuw, Boogschutter)
  "Ram-Leeuw": 9, "Leeuw-Ram": 9,
  "Ram-Boogschutter": 9, "Boogschutter-Ram": 9,
  "Leeuw-Boogschutter": 9, "Boogschutter-Leeuw": 9,
  // Aarde + Aarde (Stier, Maagd, Steenbok)
  "Stier-Maagd": 9, "Maagd-Stier": 9,
  "Stier-Steenbok": 9, "Steenbok-Stier": 9,
  "Maagd-Steenbok": 8, "Steenbok-Maagd": 8,
  // Lucht + Lucht (Tweelingen, Weegschaal, Waterman)
  "Tweelingen-Weegschaal": 9, "Weegschaal-Tweelingen": 9,
  "Tweelingen-Waterman": 9, "Waterman-Tweelingen": 9,
  "Weegschaal-Waterman": 9, "Waterman-Weegschaal": 9,
  // Water + Water (Kreeft, Schorpioen, Vissen)
  "Kreeft-Schorpioen": 9, "Schorpioen-Kreeft": 9,
  "Kreeft-Vissen": 9, "Vissen-Kreeft": 9,
  "Schorpioen-Vissen": 9, "Vissen-Schorpioen": 9,
  // Vuur + Lucht (goede mix)
  "Ram-Tweelingen": 8, "Tweelingen-Ram": 8,
  "Ram-Weegschaal": 7, "Weegschaal-Ram": 7,
  "Ram-Waterman": 8, "Waterman-Ram": 8,
  "Leeuw-Tweelingen": 8, "Tweelingen-Leeuw": 8,
  "Leeuw-Weegschaal": 9, "Weegschaal-Leeuw": 9,
  "Leeuw-Waterman": 6, "Waterman-Leeuw": 6,
  "Boogschutter-Tweelingen": 7, "Tweelingen-Boogschutter": 7,
  "Boogschutter-Weegschaal": 9, "Weegschaal-Boogschutter": 9,
  "Boogschutter-Waterman": 8, "Waterman-Boogschutter": 8,
  // Aarde + Water (goede mix)
  "Stier-Kreeft": 9, "Kreeft-Stier": 9,
  "Stier-Schorpioen": 6, "Schorpioen-Stier": 6,
  "Stier-Vissen": 8, "Vissen-Stier": 8,
  "Maagd-Kreeft": 8, "Kreeft-Maagd": 8,
  "Maagd-Schorpioen": 8, "Schorpioen-Maagd": 8,
  "Maagd-Vissen": 6, "Vissen-Maagd": 6,
  "Steenbok-Kreeft": 6, "Kreeft-Steenbok": 6,
  "Steenbok-Schorpioen": 8, "Schorpioen-Steenbok": 8,
  "Steenbok-Vissen": 8, "Vissen-Steenbok": 8,
  // Vuur + Aarde (moeilijker)
  "Ram-Stier": 5, "Stier-Ram": 5,
  "Ram-Maagd": 5, "Maagd-Ram": 5,
  "Ram-Steenbok": 7, "Steenbok-Ram": 7,
  "Leeuw-Stier": 6, "Stier-Leeuw": 6,
  "Leeuw-Maagd": 6, "Maagd-Leeuw": 6,
  "Leeuw-Steenbok": 7, "Steenbok-Leeuw": 7,
  "Boogschutter-Stier": 5, "Stier-Boogschutter": 5,
  "Boogschutter-Maagd": 5, "Maagd-Boogschutter": 5,
  "Boogschutter-Steenbok": 7, "Steenbok-Boogschutter": 7,
  // Lucht + Water (uitdagend)
  "Tweelingen-Kreeft": 5, "Kreeft-Tweelingen": 5,
  "Tweelingen-Schorpioen": 5, "Schorpioen-Tweelingen": 5,
  "Tweelingen-Vissen": 5, "Vissen-Tweelingen": 5,
  "Weegschaal-Kreeft": 6, "Kreeft-Weegschaal": 6,
  "Weegschaal-Schorpioen": 6, "Schorpioen-Weegschaal": 6,
  "Weegschaal-Vissen": 7, "Vissen-Weegschaal": 7,
  "Waterman-Kreeft": 4, "Kreeft-Waterman": 4,
  "Waterman-Schorpioen": 5, "Schorpioen-Waterman": 5,
  "Waterman-Vissen": 7, "Vissen-Waterman": 7,
  // Vuur + Water (moeilijk)
  "Ram-Kreeft": 5, "Kreeft-Ram": 5,
  "Ram-Schorpioen": 5, "Schorpioen-Ram": 5,
  "Ram-Vissen": 6, "Vissen-Ram": 6,
  "Leeuw-Kreeft": 6, "Kreeft-Leeuw": 6,
  "Leeuw-Schorpioen": 5, "Schorpioen-Leeuw": 5,
  "Leeuw-Vissen": 6, "Vissen-Leeuw": 6,
  "Boogschutter-Kreeft": 5, "Kreeft-Boogschutter": 5,
  "Boogschutter-Schorpioen": 5, "Schorpioen-Boogschutter": 5,
  "Boogschutter-Vissen": 8, "Vissen-Boogschutter": 8,
  // Aarde + Lucht (uitdagend)
  "Stier-Tweelingen": 4, "Tweelingen-Stier": 4,
  "Stier-Weegschaal": 5, "Weegschaal-Stier": 5,
  "Stier-Waterman": 4, "Waterman-Stier": 4,
  "Maagd-Tweelingen": 5, "Tweelingen-Maagd": 5,
  "Maagd-Weegschaal": 5, "Weegschaal-Maagd": 5,
  "Maagd-Waterman": 6, "Waterman-Maagd": 6,
  "Steenbok-Tweelingen": 5, "Tweelingen-Steenbok": 5,
  "Steenbok-Weegschaal": 6, "Weegschaal-Steenbok": 6,
  "Steenbok-Waterman": 6, "Waterman-Steenbok": 6,
};

const DETAILS: Partial<Record<string, Pick<CompatibiliteitScore, "samenvatting" | "sterktes" | "uitdagingen">>> = {
  "Ram-Leeuw": {
    samenvatting: "Een vurig en passievol koppel vol energie en enthousiasme. Beide tekens begrijpen elkaar op instinct niveau.",
    sterktes: ["Gedeelde passie en avontuurzin", "Wederzijds respect voor onafhankelijkheid", "Inspireren elkaar tot grootse daden"],
    uitdagingen: ["Beide willen leiden — wie geeft toe?", "Kunnen concurrentieel worden", "Ego-conflicten liggen op de loer"],
  },
  "Stier-Maagd": {
    samenvatting: "Een aardeverbinding die diep, stabiel en praktisch is. Beiden waarderen zekerheid, loyaliteit en kwaliteit.",
    sterktes: ["Gedeelde waarden rondom stabiliteit", "Praktisch en betrouwbaar team", "Diepe wederzijdse loyaliteit"],
    uitdagingen: ["Kunnen te saai worden voor elkaar", "Beide kunnen koppig zijn", "Moeite met emotionele openheid"],
  },
  "Kreeft-Schorpioen": {
    samenvatting: "Een diep emotionele verbinding die intense loyaliteit en gevoeligheid deelt. Begrijpen elkaars diepten.",
    sterktes: ["Emotionele diepgang en begrip", "Intense loyaliteit en toewijding", "Intuïtief op elkaar afgestemd"],
    uitdagingen: ["Kunnen te intens worden", "Beiden gevoelig voor kwetsingen", "Neiging tot bezitterigheid"],
  },
  "Leeuw-Weegschaal": {
    samenvatting: "Een charmant, elegant koppel dat van schoonheid, aandacht en sociaal leven houdt. Vullen elkaar prachtig aan.",
    sterktes: ["Gedeelde liefde voor schoonheid", "Charmant sociaal koppel", "Weegschaal kalmeert Leeuw's ego"],
    uitdagingen: ["Weegschaal kan te besluiteloos zijn voor daadkrachtige Leeuw", "Leeuw kan Weegschaal overweldigen"],
  },
  "Tweelingen-Weegschaal": {
    samenvatting: "Een intellectueel en sociaal dynamisch duo. Beiden zijn luchtentekens die communicatie en ideeën liefhebben.",
    sterktes: ["Levendige intellectuele gesprekken", "Gedeelde sociale levensstijl", "Flexibel en aanpasbaar"],
    uitdagingen: ["Kunnen beiden besluiteloos zijn", "Moeite met emotionele diepgang", "Vlucht in intellect bij conflict"],
  },
  "Boogschutter-Vissen": {
    samenvatting: "Een dromerig, filosofisch koppel dat van avontuur, vrijheid en grote idealen houdt.",
    sterktes: ["Gedeelde liefde voor filosofie", "Beiden open-minded en spiritueel", "Inspireren elkaars dromen"],
    uitdagingen: ["Boogschutter te direct voor gevoelige Vissen", "Beiden kunnen commitmentschuw zijn"],
  },
};

export function berekenCompatibiliteit(teken1: Teken, teken2: Teken): CompatibiliteitScore {
  const sleutel = `${teken1}-${teken2}`;
  const score = SCORES[sleutel] ?? 6;

  const el1 = TEKEN_ELEMENT[teken1];
  const el2 = TEKEN_ELEMENT[teken2];
  const zelfde = teken1 === teken2;
  const zelfdElement = el1 === el2;

  let niveau: CompatibiliteitScore["niveau"];
  if (score >= 9) niveau = "Uitstekend";
  else if (score >= 7) niveau = "Goed";
  else if (score >= 5) niveau = "Gemiddeld";
  else niveau = "Uitdagend";

  const specifiek = DETAILS[sleutel] || DETAILS[`${teken2}-${teken1}`];

  let samenvatting: string;
  let sterktes: string[];
  let uitdagingen: string[];

  if (specifiek) {
    samenvatting = specifiek.samenvatting;
    sterktes = specifiek.sterktes;
    uitdagingen = specifiek.uitdagingen;
  } else if (zelfde) {
    samenvatting = `Twee ${teken1}-personen begrijpen elkaar moeiteloos — dezelfde energie, dezelfde gedachtengang. Dit creëert een diepe herkenning maar ook blinde vlekken.`;
    sterktes = ["Diepe wederzijdse herkenning", "Zelfde levenstempo en prioriteiten", "Geen uitleg nodig"];
    uitdagingen = ["Versterken elkaars zwaktes", "Kunnen elkaars spiegel worden", "Weinig complementaire energie"];
  } else if (zelfdElement) {
    samenvatting = `${teken1} en ${teken2} delen het element ${el1} — een fundamentele gelijkenis in energie en benadering van het leven.`;
    sterktes = ["Natuurlijke chemie en begrip", `Gedeelde ${el1.toLowerCase()}-energie`, "Intuïtieve afstemming"];
    uitdagingen = ["Kunnen elkaars extremen versterken", "Behoefte aan complementaire invloeden"];
  } else {
    const goedCombo = (el1 === "Vuur" && el2 === "Lucht") || (el1 === "Lucht" && el2 === "Vuur") ||
      (el1 === "Aarde" && el2 === "Water") || (el1 === "Water" && el2 === "Aarde");
    const moeilijkCombo = (el1 === "Vuur" && el2 === "Water") || (el1 === "Water" && el2 === "Vuur") ||
      (el1 === "Aarde" && el2 === "Lucht") || (el1 === "Lucht" && el2 === "Aarde");

    if (goedCombo) {
      samenvatting = `${teken1} (${el1}) en ${teken2} (${el2}) vormen een complementaire combinatie die elkaar versterkt en aanvult.`;
      sterktes = ["Complementaire energieën", "Leren van elkaars kwaliteiten", "Balanceren elkaars extremen"];
      uitdagingen = ["Soms andere prioriteiten", "Moeten elkaars stijl leren begrijpen"];
    } else if (moeilijkCombo) {
      samenvatting = `${teken1} (${el1}) en ${teken2} (${el2}) hebben fundamenteel andere benaderingen van het leven — dat vraagt wederzijds begrip en geduld.`;
      sterktes = ["Groeipotentieel door verschil", "Kunnen elkaars blinde vlekken belichten", "Leerzame dynamiek"];
      uitdagingen: ["Fundamenteel andere communicatiestijlen", "Kunnen elkaar onbewust kwetsen", "Vraagt bewuste inspanning"];
      uitdagingen = ["Fundamenteel andere communicatiestijlen", "Kunnen elkaar onbewust kwetsen", "Vraagt bewuste inspanning"];
    } else {
      samenvatting = `${teken1} en ${teken2} zijn een interessante mix — met bewust begrip voor elkaars verschillen kan dit een leerrijke verbinding zijn.`;
      sterktes = ["Unieke chemie", "Leren van elkaars perspectief"];
      uitdagingen = ["Moeten moeite doen om elkaar te begrijpen", "Verschillende levensstijlen"];
    }
  }

  return { score, niveau, samenvatting, sterktes, uitdagingen };
}
