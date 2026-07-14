import { LRUCache } from 'lru-cache/raw';
import type { FullTag } from '@/features/tags/list-tags.js';

export const BY_NAME = new LRUCache<string, FullTag>({
  max: 500,
  ttl: 1000 * 60 * 10,
});
export const BY_ID = new LRUCache<number, FullTag>({
  max: 500,
  ttl: 1000 * 60 * 10,
});

export function store(tag: FullTag): void {
  BY_ID.set(tag.id, tag);
  for (const alias of tag.aliases) {
    BY_NAME.set(alias.name, tag);
  }
}

export function evict(tag: FullTag): void {
  BY_ID.delete(tag.id);
  for (const alias of tag.aliases) {
    BY_NAME.delete(alias.name);
  }
}
