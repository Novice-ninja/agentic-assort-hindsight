import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import {
  fetchProducts,
  setSelectedIds,
  setSort,
} from '../store/productsSlice';
import type { SortState } from '@shared/components';

export function useProducts() {
  const dispatch = useAppDispatch();
  const state = useAppSelector((s) => s.products);

  useEffect(() => {
    if (state.status === 'idle') {
      void dispatch(fetchProducts({}));
    }
  }, [dispatch, state.status]);

  return {
    ...state,
    changeSort: (sort: SortState) => dispatch(setSort(sort)),
    changeSelection: (ids: string[]) => dispatch(setSelectedIds(ids)),
    reload: () => dispatch(fetchProducts({})),
  };
}
