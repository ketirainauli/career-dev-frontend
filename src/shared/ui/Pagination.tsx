import { useSearchParams } from 'react-router-dom';

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
}

export function Pagination({ page, totalPages, total, limit }: PaginationProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const goToPage = (newPage: number) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(newPage));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <p className="pagination__summary">
        ნაჩვენებია {from}–{to}, სულ {total}
      </p>
      <div className="pagination__controls">
        <button type="button" disabled={page <= 1} onClick={() => goToPage(page - 1)}>
          წინა
        </button>
        <span>
          გვერდი {page} / {totalPages}
        </span>
        <button type="button" disabled={page >= totalPages} onClick={() => goToPage(page + 1)}>
          შემდეგი
        </button>
      </div>
    </div>
  );
}