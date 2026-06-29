export interface LenormandQuizVraag {
  id: number;
  vraag: string;
  opties: string[];
  correct: number;
  uitleg: string;
}

export const lenormandQuizVragen: LenormandQuizVraag[] = [
  {
    id: 1,
    vraag: 'Hoeveel kaarten heeft een Lenormand-deck?',
    opties: ['22', '36', '52', '78'],
    correct: 1,
    uitleg: 'Een klassiek Lenormand-deck bestaat uit precies 36 kaarten, elk met een specifiek symbool en nummer.',
  },
  {
    id: 2,
    vraag: 'Welke kaart kondigt snel nieuws of een boodschapper aan?',
    opties: ['De Brief', 'De Ruiter', 'De Vogels', 'De Tuin'],
    correct: 1,
    uitleg: 'De Ruiter (#1) is de boodschapper van het deck — hij kondigt snel naderende berichten of een persoon aan die iets brengt.',
  },
  {
    id: 3,
    vraag: 'Welke kaart staat centraal voor gezondheid in Lenormand?',
    opties: ['De Zon', 'Het Hart', 'De Boom', 'De Lelie'],
    correct: 2,
    uitleg: 'De Boom (#5) is de primaire gezondheidskaart. Kaarten naast de Boom vertellen over de aard en ernst van een gezondheidssituatie.',
  },
  {
    id: 4,
    vraag: 'Wat is het meest positieve kaart in het Lenormand-deck?',
    opties: ['De Sterren', 'De Sleutel', 'De Zon', 'Het Boeket'],
    correct: 2,
    uitleg: 'De Zon (#31) is de krachtigste positieve kaart — ze verlicht en verbetert alles om haar heen en staat voor succes en vreugde.',
  },
  {
    id: 5,
    vraag: 'Welke kaart staat voor de slimmere werkkaart van het dagelijks leven?',
    opties: ['De Beer', 'De Toren', 'De Vos', 'De Man'],
    correct: 2,
    uitleg: 'De Vos (#14) is de klassieke werkkaart in Lenormand. Ze staat voor dagelijks werk, slimheid en aanpassingsvermogen.',
  },
  {
    id: 6,
    vraag: 'Welke kaart geeft altijd zekerheid en bevestigt de naburige kaarten?',
    opties: ['De Zon', 'De Sleutel', 'De Ring', 'Het Anker'],
    correct: 1,
    uitleg: 'De Sleutel (#33) bevestigt en zekert alles wat naast haar ligt. Ze staat voor een oplossing, zekerheid en een open deur.',
  },
  {
    id: 7,
    vraag: 'Wat betekent de Doodskist in Lenormand?',
    opties: ['Letterlijke dood', 'Einde van een fase en transformatie', 'Verdriet', 'Ziekte'],
    correct: 1,
    uitleg: 'De Doodskist (#8) staat bijna nooit voor letterlijke dood. Ze markeert het einde van een fase, afsluiting en de overgang naar iets nieuws.',
  },
  {
    id: 8,
    vraag: 'Welke kaart staat voor een verbintenis of contract?',
    opties: ['Het Hart', 'De Ring', 'De Sleutel', 'De Brief'],
    correct: 1,
    uitleg: 'De Ring (#25) staat voor formele verbintenissen — huwelijk, contract, zakelijke overeenkomst of een terugkerende cyclus.',
  },
  {
    id: 9,
    vraag: 'Hoe noem je de grote 36-kaartenlegging in Lenormand?',
    opties: ['Keltisch Kruis', 'Levensboom', 'Grand Tableau', 'Pentagram'],
    correct: 2,
    uitleg: 'Het Grand Tableau ("grote tafereel") is de klassieke Lenormand-legging waarbij alle 36 kaarten worden uitgelegd voor een volledig levensoverzicht.',
  },
  {
    id: 10,
    vraag: 'Welke kaart staat voor trouwe vriendschap en loyaliteit?',
    opties: ['Het Hart', 'De Hond', 'De Lelie', 'De Man'],
    correct: 1,
    uitleg: 'De Hond (#18) staat voor een trouwe, betrouwbare vriend of metgezel. Hij symboliseert loyaliteit en oprechte vriendschap.',
  },
  {
    id: 11,
    vraag: 'Welke kaart staat voor financiën en rijkdom?',
    opties: ['De Beer', 'De Zon', 'De Vis', 'Het Anker'],
    correct: 2,
    uitleg: 'De Vis (#34) is de financiële kaart — ze staat voor geld, rijkdom, vloeibaarheid en onafhankelijkheid.',
  },
  {
    id: 12,
    vraag: 'Wat symboliseert de Slang?',
    opties: ['Puur kwaad', 'Wijsheid, complexiteit en mogelijke misleiding', 'Gevaar', 'Transformatie'],
    correct: 1,
    uitleg: 'De Slang (#7) is complex: ze staat voor diepe wijsheid, maar ook voor bedrog, jaloezie en verleiding. Context bepaalt de betekenis.',
  },
  {
    id: 13,
    vraag: 'Welke kaart staat voor een sociaal evenement of netwerk?',
    opties: ['De Tuin', 'Het Boeket', 'De Vogels', 'De Kruispunt'],
    correct: 0,
    uitleg: 'De Tuin (#20) staat voor het sociale leven — feesten, bijeenkomsten, netwerken en het publieke domein.',
  },
  {
    id: 14,
    vraag: 'Wat geeft de Kruispunt aan?',
    opties: ['Een gevaar', 'Een keuze tussen meerdere paden', 'Een kruising in de weg', 'Verwarring'],
    correct: 1,
    uitleg: 'De Kruispunt (#22) staat voor een beslissingsmoment — er zijn meerdere paden en je moet kiezen. Het is de kaart van vrijheid en alternatieven.',
  },
  {
    id: 15,
    vraag: 'Welke kaart staat voor kleine, toevallige geluksmomenten?',
    opties: ['De Zon', 'De Sterren', 'De Klavertjes', 'Het Boeket'],
    correct: 2,
    uitleg: 'De Klavertjes (#2) staan voor kleine gelukjes en toevallige meevallers — kortstondig maar aangenaam geluk.',
  },
  {
    id: 16,
    vraag: 'Welke kaart waarschuwt voor verlies dat langzaam sluipt?',
    opties: ['De Zeis', 'De Muizen', 'De Wolken', 'De Berg'],
    correct: 1,
    uitleg: 'De Muizen (#23) knagen langzaam en sluipend — ze staan voor stress, verlies, diefstal en aantasting van iets dat je dierbaar is.',
  },
  {
    id: 17,
    vraag: 'Wat betekent de Toren?',
    opties: ['Gevangenis', 'Autoriteit, instituties en eenzaamheid', 'Kracht', 'Ambities'],
    correct: 1,
    uitleg: 'De Toren (#19) staat voor grote instituties (overheid, ziekenhuis, bedrijf) maar ook voor emotionele afstand en eenzaamheid.',
  },
  {
    id: 18,
    vraag: 'Welke kaart is de zwaarste in het deck en staat voor lot en karma?',
    opties: ['De Doodskist', 'De Berg', 'Het Kruis', 'De Wolken'],
    correct: 2,
    uitleg: 'Het Kruis (#36) is de kaart van het lot — een last die gedragen moet worden. Maar ze symboliseert ook spirituele kracht en uiteindelijke bevrijding.',
  },
  {
    id: 19,
    vraag: 'Welke kaart staat voor een geheim of verborgen kennis?',
    opties: ['De Wolken', 'Het Boek', 'De Slang', 'De Brief'],
    correct: 1,
    uitleg: 'Het Boek (#26) houdt een geheim — het staat voor verborgen kennis, studie en informatie die nog niet aan het licht is gekomen.',
  },
  {
    id: 20,
    vraag: 'Hoe werkt combinatielezing in Lenormand?',
    opties: [
      'Elke kaart heeft één vaste betekenis ongeacht positie',
      'Kaarten worden in combinatie gelezen — de buurkaarten modificeren elkaars betekenis',
      'De eerste kaart is altijd het antwoord',
      'Omgekeerde kaarten geven de tegenovergestelde betekenis',
    ],
    correct: 1,
    uitleg: 'Lenormand werkt op combinaties. De buurkaarten modificeren en verdiepen elkaar — een enkele kaart vertelt nooit het hele verhaal.',
  },
];
