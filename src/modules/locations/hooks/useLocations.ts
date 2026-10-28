import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import { fetchLocations, setRegionFilter } from '../store/locationsSlice';

export function useLocations() {
  const dispatch = useAppDispatch();
  const state = useAppSelector((s) => s.locations);

  useEffect(() => {
    if (state.status === 'idle') {
      void dispatch(fetchLocations({}));
    }
  }, [dispatch, state.status]);

  const visibleItems = useMemo(() => {
    const { region } = state.filters;
    if (region.length === 0) return state.items;
    return state.items.filter((l) => region.includes(l.region));
  }, [state.items, state.filters]);

  const regions = useMemo(
    () => Array.from(new Set(state.items.map((l) => l.region))),
    [state.items],
  );

  return {
    ...state,
    visibleItems,
    regions,
    toggleRegion: (region: string) => {
      const next = state.filters.region.includes(region)
        ? state.filters.region.filter((r) => r !== region)
        : [...state.filters.region, region];
      dispatch(setRegionFilter(next));
    },
    reload: () => dispatch(fetchLocations({})),
  };
}
