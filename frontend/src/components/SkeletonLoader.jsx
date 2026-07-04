export default function SkeletonLoader({ type = "table", rows = 3 }) {
  if (type === "card") {
    return (
      <div className="animate-pulse glass-card p-6 flex flex-col gap-4">
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    );
  }

  return (
    <div className="animate-pulse w-full">
      <div className="h-10 bg-gray-200 rounded mb-4 w-full"></div>
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="h-16 bg-gray-100 rounded mb-2 w-full flex items-center px-4 gap-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      ))}
    </div>
  );
}
