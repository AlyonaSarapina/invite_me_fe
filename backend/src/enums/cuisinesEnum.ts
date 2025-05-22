export const CUISINES = [
  'Chinese',
  'American',
  'Ukrainian',
  'Mexican',
  'Italian',
  'Japanese',
  'Sushi',
  'Greek',
  'French',
  'Thai',
  'Spanish',
  'Indian',
  'Mediterranean',
] as const;

export type CuisineType = (typeof CUISINES)[number];
