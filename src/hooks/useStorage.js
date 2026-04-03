import { useState, useEffect } from 'react';

export function useStorage(key, defaultValue) {
  const [data, setData] = useState(defaultValue);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await window.storage.get(key);
        if (!cancelled && r?.value) setData(JSON.parse(r.value));
      } catch (e) { /* no saved data */ }
      if (!cancelled) setLoaded(true);
    })();
    return () => { cancelled = true; };
  }, [key]);

  useEffect(() => {
    if (!loaded) return;
    (async () => {
      try {
        if (data && (Array.isArray(data) ? data.length > 0 : true)) {
          await window.storage.set(key, JSON.stringify(data));
        } else {
          await window.storage.delete(key);
        }
      } catch (e) { /* silent */ }
    })();
  }, [data, loaded, key]);

  const reset = async () => {
    setData(defaultValue);
    try { await window.storage.delete(key); } catch (e) {}
  };

  return [data, setData, loaded, reset];
}
