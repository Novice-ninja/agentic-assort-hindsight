import { clusteringClient } from './mockClient';
import type { ScopeCatalogues } from '../types';

export function getCatalogues(): Promise<ScopeCatalogues> {
  return clusteringClient.get<ScopeCatalogues>('/clustering/catalogues');
}
