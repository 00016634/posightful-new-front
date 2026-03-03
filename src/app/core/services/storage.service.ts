import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'POSightfulDB';
  private readonly DB_VERSION = 1;

  constructor() {
    this.initDB();
  }

  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;

        // Create object stores for offline data
        if (!db.objectStoreNames.contains('pending_leads')) {
          const leadStore = db.createObjectStore('pending_leads', { keyPath: 'uuid' });
          leadStore.createIndex('created_at', 'created_at', { unique: false });
        }

        if (!db.objectStoreNames.contains('cached_data')) {
          db.createObjectStore('cached_data', { keyPath: 'key' });
        }
      };
    });
  }

  async savePendingLead(lead: any): Promise<void> {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['pending_leads'], 'readwrite');
      const store = transaction.objectStore('pending_leads');
      const request = store.add(lead);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getPendingLeads(): Promise<any[]> {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['pending_leads'], 'readonly');
      const store = transaction.objectStore('pending_leads');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async removePendingLead(uuid: string): Promise<void> {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['pending_leads'], 'readwrite');
      const store = transaction.objectStore('pending_leads');
      const request = store.delete(uuid);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async cacheData(key: string, data: any): Promise<void> {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cached_data'], 'readwrite');
      const store = transaction.objectStore('cached_data');
      const request = store.put({ key, data, timestamp: Date.now() });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getCachedData(key: string): Promise<any> {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cached_data'], 'readonly');
      const store = transaction.objectStore('cached_data');
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result?.data);
      request.onerror = () => reject(request.error);
    });
  }
}
