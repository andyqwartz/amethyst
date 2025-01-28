import { useImageHistoryState } from './image-history/useImageHistoryState';
import { useImageHistoryFetch } from './image-history/useImageHistoryFetch';
import { useImageHistoryMutations } from './image-history/useImageHistoryMutations';
import { useImageHistorySubscription } from './image-history/useImageHistorySubscription';

export const useImageHistory = () => {
  const {
    history,
    allHistory,
    isLoading,
    setHistory,
    setLoading
  } = useImageHistoryState();

  const { fetchHistory } = useImageHistoryFetch(setHistory, setLoading);
  const { addToHistory } = useImageHistoryMutations(fetchHistory);

  useImageHistorySubscription(fetchHistory);

  return {
    history,
    allHistory,
    isLoading,
    addToHistory
  };
};