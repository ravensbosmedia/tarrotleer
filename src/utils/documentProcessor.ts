import OpenAI from 'openai';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface ProcessedChunk {
  content: string;
  embedding: number[];
}

export async function processDocument(text: string, title: string) {
  try {
    // 1. Tekst opdelen in kleinere stukken
    const chunks = splitIntoChunks(text, 1000);
    
    // 2. Voor elk stuk een embedding maken
    const processedChunks: ProcessedChunk[] = [];
    
    for (const chunk of chunks) {
      const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: chunk,
      });
      
      processedChunks.push({
        content: chunk,
        embedding: response.data[0].embedding
      });
    }
    
    // 3. Opslaan in Firestore
    const docRef = await addDoc(collection(db, 'tarot-knowledge'), {
      title,
      chunks: processedChunks,
      createdAt: new Date(),
      type: 'processed-document'
    });

    return {
      success: true,
      message: 'Document succesvol verwerkt en opgeslagen',
      docId: docRef.id
    };
  } catch (error) {
    console.error('Error processing document:', error);
    return {
      success: false,
      message: 'Fout bij het verwerken van het document'
    };
  }
}

function splitIntoChunks(text: string, maxLength: number): string[] {
  const chunks: string[] = [];
  let currentChunk = '';
  
  const sentences = text.split(/[.!?]+/);
  
  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxLength) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += sentence + '. ';
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
}

export async function searchKnowledge(query: string) {
  try {
    // 1. Query omzetten naar embedding
    const queryEmbedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query,
    });
    
    // 2. Zoeken in opgeslagen embeddings
    // Hier zou je normaal een vector database gebruiken
    // Voor nu doen we een simpele cosine similarity in Firestore
    
    const knowledgeRef = collection(db, 'tarot-knowledge');
    const snapshot = await knowledgeRef.get();
    
    const results = [];
    for (const doc of snapshot.docs) {
      const data = doc.data();
      for (const chunk of data.chunks) {
        const similarity = cosineSimilarity(
          queryEmbedding.data[0].embedding,
          chunk.embedding
        );
        if (similarity > 0.8) { // Threshold
          results.push({
            content: chunk.content,
            similarity,
            title: data.title
          });
        }
      }
    }
    
    return results.sort((a, b) => b.similarity - a.similarity);
  } catch (error) {
    console.error('Error searching knowledge:', error);
    return [];
  }
}

function cosineSimilarity(vecA: number[], vecB: number[]): number {
  const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
  const normB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
  return dotProduct / (normA * normB);
}