import definitions from './topics.json';
export const topics = definitions;
export type TopicSlug = string;
export const topicBySlug = Object.fromEntries(topics.map(t => [t.slug, t]));
export const topicLabel = (slug: string) => topicBySlug[slug]?.shortLabel ?? slug;
