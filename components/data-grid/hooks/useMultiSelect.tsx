import { MultiSelectOption } from '@/types/grid'
import { useCallback, useEffect, useState } from 'react'

interface UseMultiSelectProps<T> {
  onSearch?: (query: string) => Promise<T[]>
  getOption: (item: T) => MultiSelectOption
  initialItems?: T[]
}

export function useMultiSelect<T>({ onSearch, getOption, initialItems = [] }: UseMultiSelectProps<T>) {
  const [isLoading, setIsLoading] = useState(false)
  const [options, setOptions] = useState<MultiSelectOption[]>(initialItems.map(getOption))
  const [error, setError] = useState<Error | null>(null)

  const searchItems = useCallback(async (query: string) => {
    console.log('Search called with query:', query);
    if (!onSearch) {
      console.log('No onSearch function provided, setting options to empty array');
      setOptions([]);
      return;
    }

    console.log('Setting loading state to true');
    setIsLoading(true);
    setError(null);

    try {
      console.log('Calling onSearch with query:', query);
      const items = await onSearch(query);
      console.log('Received items from onSearch:', items);
      const newOptions = items.map(getOption);
      
      if (!query) {
        console.log('No query, showing all options including initial items');
        setOptions(newOptions);
      } else {
        console.log('Query present, filtering and keeping selected items');
        const selectedOptions = initialItems.map(getOption);
        const uniqueOptions = [...selectedOptions];
        newOptions.forEach(option => {
          if (!uniqueOptions.some(o => o.value === option.value)) {
            uniqueOptions.push(option);
          }
        });
        console.log('Setting options to:', uniqueOptions);
        setOptions(uniqueOptions);
      }
    } catch (err) {
      console.error('Error occurred during search:', err);
      setError(err instanceof Error ? err : new Error('Failed to search'));
      console.log('Setting options to initial items due to error');
      setOptions(initialItems.map(getOption));
    } finally {
      console.log('Setting loading state to false');
      setIsLoading(false);
    }
  }, [onSearch, getOption, initialItems]);

  // Initialize with initial items
  useEffect(() => {
    if (initialItems.length > 0) {
      setOptions(initialItems.map(getOption))
    }
  }, [initialItems, getOption])

  return {
    options,
    isLoading,
    error,
    searchItems
  }
} 