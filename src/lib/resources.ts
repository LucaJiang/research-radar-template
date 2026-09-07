import entries from '../data/resources.json';
import { site } from './site';
export interface Resource {
  id: string; name: string; category: string; summary: string; url: string;
  topics: string[]; tags: string[];
  fields: { label: string; value: string }[];
  sources: { label: string; url: string }[];
  updatedAt: string;
}
export const resources: Resource[] = site.resourcesEnabled ? entries as Resource[] : [];
