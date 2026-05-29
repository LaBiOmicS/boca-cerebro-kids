import { DailyRecord } from './types';

const DB_NAME = 'BocaCerebroKidsDB';
const DB_VERSION = 1;
const STORE_NAME = 'daily_records';

/**
 * Opens a connection to the IndexedDB database, handling version upgrades and initiation.
 */
export function openLocalDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('Este navegador não suporta IndexedDB, que é necessário para funcionamento offline.'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error(`Erro ao abrir o banco de dados: ${request.error?.message || 'Erro desconhecido'}`));
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        // We use the date 'YYYY-MM-DD' as the primary key/keyPath
        db.createObjectStore(STORE_NAME, { keyPath: 'date' });
      }
    };
  });
}

/**
 * Refreshes or creates a daily record in IndexedDB.
 */
export async function saveDailyRecord(record: DailyRecord): Promise<void> {
  const db = await openLocalDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    // Ensure accurate timestamp
    const completeRecord = {
      ...record,
      updatedAt: Date.now()
    };
    
    const request = store.put(completeRecord);

    request.onerror = () => {
      reject(new Error(`Falha ao salvar registro: ${request.error?.message || 'Erro desconhecido'}`));
    };

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
  });
}

/**
 * Retrieves a single record by date (YYYY-MM-DD).
 */
export async function getDailyRecord(date: string): Promise<DailyRecord | null> {
  const db = await openLocalDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(date);

    request.onerror = () => {
      reject(new Error(`Falha ao obter registro: ${request.error?.message || 'Erro desconhecido'}`));
    };

    request.onsuccess = () => {
      db.close();
      resolve(request.result || null);
    };
  });
}

/**
 * Retrieves all saved records sorted chronologically.
 */
export async function getAllDailyRecords(): Promise<DailyRecord[]> {
  const db = await openLocalDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onerror = () => {
      reject(new Error(`Falha ao ler registros: ${request.error?.message || 'Erro desconhecido'}`));
    };

    request.onsuccess = () => {
      const records = request.result as DailyRecord[];
      // Sort chronologically ascending/descending
      records.sort((a, b) => b.date.localeCompare(a.date));
      db.close();
      resolve(records);
    };
  });
}

/**
 * Deletes a record from the database.
 */
export async function deleteDailyRecord(date: string): Promise<void> {
  const db = await openLocalDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(date);

    request.onerror = () => {
      reject(new Error(`Falha ao excluir registro: ${request.error?.message || 'Erro desconhecido'}`));
    };

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
  });
}

/**
 * Deletes all records from the store (LGPD Right to Erasure / Forgotten).
 */
export async function clearAllDailyRecords(): Promise<void> {
  const db = await openLocalDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    request.onerror = () => {
      reject(new Error(`Falha ao apagar todos os registros: ${request.error?.message || 'Erro desconhecido'}`));
    };

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
  });
}
