export interface LenormandKaart {
  id: number;
  naam: string;
  symbool: string;
  kleur: string;
  kleurDonker: string;
  sleutelwoorden: string[];
  betekenis: string;
  liefde: string;
  werk: string;
  gezondheid: string;
  positief: string;
  negatief: string;
  combinatieTip: string;
}

export type LenormandSpreadType = 'dag' | 'drie' | 'vijf' | 'tableau';

export interface LenormandSpread {
  id: LenormandSpreadType;
  naam: string;
  aantalKaarten: number;
  beschrijving: string;
  posities: string[];
}
