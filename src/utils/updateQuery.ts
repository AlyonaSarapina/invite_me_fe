export const updateQueryParam = (
  key: string,
  value: string | boolean | number | null,
  router: any,
  searchParams: URLSearchParams
) => {
  const current = new URLSearchParams(Array.from(searchParams.entries()));

  if (value !== null && value !== "" && value !== false) {
    current.set(key, String(value));
  } else {
    current.delete(key);
  }

  current.delete("page");

  router.push(`/client/restaurants?${current.toString()}`);
};
