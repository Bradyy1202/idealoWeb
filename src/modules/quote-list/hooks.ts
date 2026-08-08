'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { quoteListSchema, type QuoteListItem, type QuoteListItemInput } from './schema';

const STORAGE_KEY = 'idealo:quote-list';
const EMPTY_ITEMS: QuoteListItem[] = [];

// useSyncExternalStore exige que getSnapshot devuelva la MISMA referencia
// mientras el localStorage subyacente no cambió; si no, React entra en un
// bucle de re-renders creyendo que "cambió" en cada llamada.
let cachedRaw: string | null = null;
let cachedItems: QuoteListItem[] = EMPTY_ITEMS;

function parseAndCache(raw: string | null): QuoteListItem[] {
  if (raw === cachedRaw) return cachedItems;
  cachedRaw = raw;

  if (!raw) {
    cachedItems = EMPTY_ITEMS;
    return cachedItems;
  }

  try {
    const parsed = quoteListSchema.safeParse(JSON.parse(raw));
    cachedItems = parsed.success ? parsed.data : EMPTY_ITEMS;
  } catch {
    cachedItems = EMPTY_ITEMS;
  }
  return cachedItems;
}

function getSnapshot(): QuoteListItem[] {
  return parseAndCache(window.localStorage.getItem(STORAGE_KEY));
}

function getServerSnapshot(): QuoteListItem[] {
  return EMPTY_ITEMS;
}

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function writeToStorage(items: QuoteListItem[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    // El evento `storage` nativo solo llega a OTRAS pestañas, no a esta: se
    // despacha a mano para que este mismo componente vea el cambio ya.
    window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }));
  } catch {
    // localStorage puede fallar (modo privado, cuota llena): la lista sigue
    // funcionando en memoria para esta pestaña, solo no persiste.
  }
}

export function useQuoteList() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const addItem = useCallback((input: QuoteListItemInput) => {
    const current = getSnapshot();
    if (current.some((item) => item.productId === input.productId)) return;
    writeToStorage([...current, { ...input, quantity: 1, notes: '' }]);
  }, []);

  const removeItem = useCallback((productId: string) => {
    writeToStorage(getSnapshot().filter((item) => item.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    writeToStorage(
      getSnapshot().map((item) =>
        item.productId === productId ? { ...item, quantity: Math.max(1, quantity) } : item,
      ),
    );
  }, []);

  const updateNotes = useCallback((productId: string, notes: string) => {
    writeToStorage(
      getSnapshot().map((item) => (item.productId === productId ? { ...item, notes } : item)),
    );
  }, []);

  const clear = useCallback(() => {
    writeToStorage([]);
  }, []);

  return { items, addItem, removeItem, updateQuantity, updateNotes, clear };
}
