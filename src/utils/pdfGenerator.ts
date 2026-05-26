import { TarotCard } from '../types/cards';

interface ReadingData {
  title: string;
  cards: TarotCard[];
  positions: string[];
  vraagstelling?: string;
}

export const generatePDF = async (readingData: ReadingData) => {
  try {
    // Maak een tijdelijk element voor de print-versie
    const printContent = document.createElement('div');
    printContent.className = 'pdf-content';

    // Voeg titel en vraagstelling toe
    const header = document.createElement('div');
    header.innerHTML = `
      <h1 style="font-size: 24px; color: #6B46C1; margin-bottom: 16px;">${readingData.title}</h1>
      ${readingData.vraagstelling ? `<p style="color: #4B5563; margin-bottom: 24px;">Vraag: ${readingData.vraagstelling}</p>` : ''}
    `;
    printContent.appendChild(header);

    // Voeg kaarten en hun interpretaties toe
    readingData.cards.forEach((card, index) => {
      const cardElement = document.createElement('div');
      cardElement.style.marginBottom = '32px';
      cardElement.style.pageBreakInside = 'avoid';
      
      cardElement.innerHTML = `
        <div style="display: flex; gap: 16px; margin-bottom: 16px;">
          <img src="${card.imageUrl}" alt="${card.nameNL}" style="width: 120px; height: 180px; object-fit: cover; border-radius: 8px;" />
          <div>
            <h3 style="font-size: 18px; color: #6B46C1; margin-bottom: 8px;">
              ${readingData.positions[index]} - ${card.nameNL} (${card.name})
            </h3>
            <p style="color: #4B5563; margin-bottom: 8px;">${card.meaningUpright}</p>
            <p style="color: #4B5563;">${card.description}</p>
          </div>
        </div>
      `;
      
      printContent.appendChild(cardElement);
    });

    // Converteer naar PDF met html2pdf
    const element = document.createElement('div');
    element.appendChild(printContent);
    
    const opt = {
      margin: 1,
      filename: 'tarot-legging.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' }
    };

    // Download het PDF bestand
    const blob = new Blob([element.innerHTML], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tarot-legging.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Er is een fout opgetreden bij het genereren van de PDF. Probeer het opnieuw.');
  }
};