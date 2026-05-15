import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useReviews(repoId?: string) {
  const url = repoId ? `/api/reviews?repo=${repoId}` : "/api/reviews";
  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  return {
    reviews: data?.reviews || [],
    isLoading,
    isError: !!error,
    mutate,
  };
}

export function useReview(reviewId: string) {
  const { data, error, isLoading, mutate } = useSWR(
    reviewId ? `/api/reviews/${reviewId}` : null,
    fetcher
  );

  return {
    review: data?.review || null,
    isLoading,
    isError: !!error,
    mutate,
  };
}
