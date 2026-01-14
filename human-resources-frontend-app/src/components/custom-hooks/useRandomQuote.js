// useRandomQuote.js
import { useEffect, useState, useCallback } from 'react';

/**
 * Fetches a random quote (office/work/job themed when possible)
 * from the DummyJSON API, with a local fallback list.
 *
 * Usage:
 *   const { quote, author, loading, refresh } = useRandomQuote();
 */
export default function useRandomQuote() {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(true);

  const FALLBACKS = [
    { q: "Quality means doing it right when no one is looking.", a: "Henry Ford" },
    { q: "The only way to do great work is to love what you do.", a: "Steve Jobs" },
    { q: "Don’t watch the clock; do what it does. Keep going.", a: "Sam Levenson" },
    { q: "Alone we can do so little; together we can do so much.", a: "Helen Keller" },
    { q: "Hard work beats talent when talent doesn’t work hard.", a: "Tim Notke" },
    { q: "The secret of getting ahead is getting started.", a: "Mark Twain" },
    { q: "Success is the sum of small efforts, repeated day in and day out.", a: "Robert Collier" },
  ];

  const pickFallback = () => {
    const i = Math.floor(Math.random() * FALLBACKS.length);
    return FALLBACKS[i];
    };

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      // Dummy JSON API (CORS enabled). Random quote:
      // https://dummyjson.com/quotes/random
      const res = await fetch('https://dummyjson.com/quotes/random');
      const data = await res.json();

      // Try to prefer work/office/job themed quotes when possible
      const txt = (data?.quote || '').toString();
      const isWorky = /(work|office|job|team|career|project|success|effort)/i.test(txt);

      let q = data?.quote;
      let a = data?.author;

      if (!q || !isWorky) {
        const fb = pickFallback();
        q = fb.q;
        a = fb.a;
      }

      setQuote(q);
      setAuthor(a);
    } catch (_) {
      const fb = pickFallback();
      setQuote(fb.q);
      setAuthor(fb.a);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { quote, author, loading, refresh };
}
