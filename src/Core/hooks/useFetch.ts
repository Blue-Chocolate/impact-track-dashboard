import { useEffect, useState } from "react";

export default function useFetch<T>(fetchFn: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFn()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}
