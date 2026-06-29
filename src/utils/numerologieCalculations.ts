export function calculateNumbers(date: string, name?: string) {
  if (!date) return null;

  const [year, month, day] = date.split('-');
  const calculations: Record<string, { result: number; steps: string[] }> = {};
  
  // Bestuursgetal (alleen de dag)
  const rulingSteps: string[] = [];
  let rulingNumber = parseInt(day);
  rulingSteps.push(`1. Je geboortedag is ${rulingNumber}`);
  
  if (rulingNumber < 10) {
    rulingSteps.push(`2. Omdat ${rulingNumber} al een enkel cijfer is, is dit je Bestuursgetal`);
  } else {
    const firstSum = day.split('').reduce((sum, digit) => sum + parseInt(digit), 0);
    rulingSteps.push(`2. Tel de cijfers van je geboortedag bij elkaar op: ${day.split('').join(' + ')} = ${firstSum}`);
    
    if (firstSum < 10) {
      rulingSteps.push(`3. ${firstSum} is een enkel cijfer, dus dit is je Bestuursgetal`);
      rulingNumber = firstSum;
    } else {
      const finalNumber = firstSum.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
      rulingSteps.push(`3. Tel de cijfers nogmaals bij elkaar op: ${firstSum.toString().split('').join(' + ')} = ${finalNumber}`);
      rulingSteps.push(`4. ${finalNumber} is je Bestuursgetal`);
      rulingNumber = finalNumber;
    }
  }
  calculations.ruling = { result: rulingNumber, steps: rulingSteps };

  // Levenspad (dag + maand + jaar)
  const lifePathSteps: string[] = [];
  
  // Bereken dag
  const daySum = day.split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  const dayReduced = reduceToSingleDigit(daySum);
  lifePathSteps.push(`1. Dag - ${day} → ${day.split('').join(' + ')} = ${daySum}${daySum !== dayReduced ? ` → ${dayReduced}` : ''}`);
  
  // Bereken maand
  const monthNum = parseInt(month);
  const monthSum = month.split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  const monthReduced = reduceToSingleDigit(monthSum);
  lifePathSteps.push(`2. Maand - ${monthNum} → ${monthNum > 9 ? `${month.split('').join(' + ')} = ${monthSum} → ` : ''}${monthReduced}`);
  
  // Bereken jaar
  const yearSum = year.split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  const yearReduced = reduceToSingleDigit(yearSum);
  lifePathSteps.push(`3. Jaar - ${year} → ${year.split('').join(' + ')} = ${yearSum}${yearSum !== yearReduced ? ` → ${yearReduced}` : ''}`);
  
  // Tel alles bij elkaar op
  const totalSum = dayReduced + monthReduced + yearReduced;
  lifePathSteps.push(`4. Tel alles bij elkaar op - ${dayReduced} + ${monthReduced} + ${yearReduced} = ${totalSum}`);
  
  // Reduceer tot enkel getal of meestersgetal
  const lifePathNumber = reduceToSingleOrMasterNumber(totalSum);
  if (totalSum !== lifePathNumber) {
    lifePathSteps.push(`5. Reduceer tot eindgetal - ${totalSum} → ${lifePathNumber}`);
  }
  
  calculations.lifePath = { result: lifePathNumber, steps: lifePathSteps };

  // Bereken andere getallen
  const lessonNumber = reduceNumber(parseInt(month));
  const soulNumber = reduceNumber(parseInt(day));
  const giftNumber = reduceNumber(parseInt(year.slice(-2)));
  const pastNumber = reduceNumber(Array.from(year).reduce((sum, digit) => sum + parseInt(digit), 0));
  const foundationNumber = reduceNumber(soulNumber + lessonNumber);
  const projectionNumber = reduceNumber(giftNumber + soulNumber);
  const coreNumber = reduceNumber(pastNumber + lessonNumber);
  const purposeNumber = reduceNumber(parseInt(month) + parseInt(day) + parseInt(year));

  // Voeg berekeningen toe met stappen
  calculations.lesson = { 
    result: lessonNumber, 
    steps: [`Berekend uit je geboortemaand: ${month} → ${lessonNumber}`] 
  };
  calculations.soul = { 
    result: soulNumber, 
    steps: [`Berekend uit je geboortedag: ${day} → ${soulNumber}`] 
  };
  calculations.gift = { 
    result: giftNumber, 
    steps: [`Berekend uit de laatste twee cijfers van je geboortejaar: ${year.slice(-2)} → ${giftNumber}`] 
  };
  calculations.past = { 
    result: pastNumber, 
    steps: [`Berekend uit de som van je geboortejaar: ${year} → ${year.split('').join(' + ')} → ${pastNumber}`] 
  };
  calculations.foundation = { 
    result: foundationNumber, 
    steps: [`Berekend uit Zielengetal (${soulNumber}) + Levensles (${lessonNumber}) = ${foundationNumber}`] 
  };
  calculations.projection = { 
    result: projectionNumber, 
    steps: [`Berekend uit Geschenk (${giftNumber}) + Zielengetal (${soulNumber}) = ${projectionNumber}`] 
  };
  calculations.core = { 
    result: coreNumber, 
    steps: [`Berekend uit Verleden (${pastNumber}) + Levensles (${lessonNumber}) = ${coreNumber}`] 
  };
  calculations.purpose = { 
    result: purposeNumber, 
    steps: [`Berekend uit de som van je volledige geboortedatum: ${month} + ${day} + ${year} = ${purposeNumber}`] 
  };

  return calculations;
}

function reduceNumber(num: number): number {
  // Behoud meestergetallen 11 en 22
  if (num === 11 || num === 22) return num;
  
  // Reduceer andere getallen tot een enkel cijfer
  while (num > 9) {
    num = Array.from(String(num)).reduce((sum, digit) => sum + parseInt(digit), 0);
  }
  return num;
}

function reduceToSingleDigit(num: number): number {
  while (num > 9) {
    num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  }
  return num;
}

function reduceToSingleOrMasterNumber(num: number): number {
  if (num === 11 || num === 22) return num;
  return reduceToSingleDigit(num);
}