import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useRepositories() {
  const { data, error, isLoading, mutate } = useSWR("/api/repositories", fetcher);

  return {
    repositories: data?.repositories || [],
    isLoading,
    isError: !!error,
    mutate,
  };
}
