interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export default function TableSkeleton({ rows = 8, columns = 6 }: TableSkeletonProps) {
  return (
    <div>
      {/* Header */}
      <div className="bg-gray-50/50 px-6 py-3.5 flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={i}
            className="h-3 admin-skeleton rounded-md"
            style={{ width: `${((i * 37 + 17) % 60) + 40}px` }}
          />
        ))}
      </div>
      {/* Rows */}
      <div className="divide-y divide-gray-50">
        {Array.from({ length: Math.min(rows, 10) }).map((_, rowIdx) => (
          <div key={rowIdx} className="px-6 py-4 flex gap-4 items-center">
            {Array.from({ length: columns }).map((_, colIdx) => (
              <div
                key={colIdx}
                className="h-3 admin-skeleton rounded-md"
                style={{ width: `${((rowIdx * columns + colIdx) * 53 % 80) + 40}px` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
