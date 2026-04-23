export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-7 w-48 bg-gray-200 rounded-lg" />
          <div className="h-4 w-32 bg-gray-100 rounded mt-2" />
        </div>
        <div className="h-10 w-36 bg-gray-200 rounded-lg" />
      </div>

      {/* Stats row skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="h-3 w-20 bg-gray-200 rounded mb-3" />
                <div className="h-7 w-24 bg-gray-200 rounded mb-1" />
                <div className="h-3 w-16 bg-gray-100 rounded" />
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-3 flex gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-3 bg-gray-200 rounded" style={{ width: `${60 + i * 20}px` }} />
          ))}
        </div>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="px-6 py-4 border-b border-gray-50 flex gap-6 items-center">
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-4 w-24 bg-gray-100 rounded" />
            <div className="h-4 w-20 bg-gray-100 rounded" />
            <div className="h-6 w-16 bg-gray-100 rounded-full" />
            <div className="h-4 w-16 bg-gray-100 rounded ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
