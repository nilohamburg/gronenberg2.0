// A simple utility to batch multiple IDs into a single request
export async function batchFetch<T>(
  ids: number[],
  fetchFn: (batchIds: number[]) => Promise<Record<number, T>>,
): Promise<Record<number, T>> {
  // If there are no IDs, return an empty object
  if (ids.length === 0) {
    return {}
  }

  // Fetch all items in a single request
  return fetchFn(ids)
}

