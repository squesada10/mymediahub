import type { MediaItem, StatusFilter, TypeFilter } from "../app/watchlist/types"; // Adjust path as necessary

interface FilterArgs {
  list: MediaItem[];
  statusFilter: StatusFilter | null;
  typeFilter: TypeFilter | null;
  genreFilter: string | null;
  queryFilter: string | null;
}

export const filterWatchlist = ({ list, statusFilter, typeFilter, genreFilter, queryFilter }: FilterArgs): MediaItem[] => {
  let filteredList = list;

  // 1. Apply Status Filter
  if (statusFilter && statusFilter !== 'all') {
    filteredList = filteredList.filter(s => s.status === statusFilter);
  }

  // 2. Apply Type Filter
  if (typeFilter && typeFilter !== 'all') {
    filteredList = filteredList.filter(s => s.type === typeFilter);
  }

  // 3. Apply Genre Filter (Uses robust check)
  if (genreFilter && genreFilter !== 'all') {
    const standardizedFilter = genreFilter.toLowerCase().trim();

    filteredList = filteredList.filter(s => {
      const itemGenres = s.genres || [];
      return itemGenres.some(itemGenre =>
        itemGenre.toLowerCase().trim() === standardizedFilter
      );
    });
  }

  // 4. Apply Query Filter (Assuming this is for title/overview search)
  if (queryFilter) {
    const standardizedQuery = queryFilter.toLowerCase().trim();
    filteredList = filteredList.filter(s =>
      s.title.toLowerCase().includes(standardizedQuery) ||
      s.overview.toLowerCase().includes(standardizedQuery)
    );
  }

  return filteredList;
};
