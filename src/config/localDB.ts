const CARDS_KEY = 'tarot_cards';
const QUOTAS_KEY = 'tarot_quotas';
const DOCUMENTS_KEY = 'tarot_documents';

export function getCards(): any[] {
  try {
    const data = localStorage.getItem(CARDS_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

export function setCards(cards: any[]): void {
  localStorage.setItem(CARDS_KEY, JSON.stringify(cards));
}

export function setCard(id: number, data: any): void {
  const cards = getCards();
  const index = cards.findIndex((c: any) => c.id === id);
  if (index !== -1) {
    cards[index] = { id, ...data };
  } else {
    cards.push({ id, ...data });
  }
  setCards(cards);
}

export function updateCard(id: number, data: any): void {
  const cards = getCards();
  const index = cards.findIndex((c: any) => c.id === id);
  if (index !== -1) {
    cards[index] = { ...cards[index], ...data };
    setCards(cards);
  }
}

export function getQuota(date: string): any {
  try {
    const data = localStorage.getItem(QUOTAS_KEY);
    const quotas = data ? JSON.parse(data) : {};
    return quotas[date] || null;
  } catch { return null; }
}

export function setQuota(date: string, data: any): void {
  try {
    const stored = localStorage.getItem(QUOTAS_KEY);
    const quotas = stored ? JSON.parse(stored) : {};
    quotas[date] = { ...(quotas[date] || {}), ...data };
    localStorage.setItem(QUOTAS_KEY, JSON.stringify(quotas));
  } catch {}
}

export function incrementQuotaField(date: string, field: string): void {
  const quota = getQuota(date) || { date, interpretations: 0, chatMessages: 0, paidReadings: 0 };
  quota[field] = (quota[field] || 0) + 1;
  setQuota(date, quota);
}

export function getDocuments(): any[] {
  try {
    const data = localStorage.getItem(DOCUMENTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

export function addDocument(doc: any): void {
  const docs = getDocuments();
  docs.push(doc);
  localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(docs));
}
