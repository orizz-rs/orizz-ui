import type { JSX } from 'react'
import styles from './Pagination.module.css'

export interface PaginationProps {
  readonly currentPage: number
  readonly totalPages: number
  readonly onPageChange: (page: number) => void
  readonly ariaLabel?: string
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  ariaLabel = 'Pagination',
}: PaginationProps): JSX.Element | null {
  if (totalPages < 1) return null
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <nav aria-label={ariaLabel} className={styles.pagination}>
      <button
        type="button"
        className={styles.button}
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </button>
      <ol className={styles.pages}>
        {pageNumbers.map((page) => (
          <li key={page}>
            <button
              type="button"
              className={styles.button}
              aria-current={page === currentPage ? 'page' : undefined}
              aria-label={`Page ${page}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          </li>
        ))}
      </ol>
      <button
        type="button"
        className={styles.button}
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </nav>
  )
}
