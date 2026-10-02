import { useState, useEffect, useCallback } from 'react';
import { marketService } from '../services/marketService';

export const useMarketPrices = () => {
  const [prices, setPrices] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiveApi, setIsLiveApi] = useState(false);

  const fetchPrices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await marketService.getMarketPrices();
      setPrices(result.prices);
      setSummary(result.summary);
      setIsLiveApi(result.isLiveApi);
    } catch (err) {
      setError(err?.message || 'Failed to load market prices');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  return {
    prices,
    summary,
    loading,
    error,
    isLiveApi,
    refreshPrices: fetchPrices,
  };
};
