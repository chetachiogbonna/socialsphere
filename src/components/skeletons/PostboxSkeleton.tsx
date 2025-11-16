const PostboxSkeleton = ({ count = 4 }: { count?: number }) => {
  return Array.from({ length: count }).map(() => (
    <div key={count} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 animate-pulse">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gray-700"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-700 rounded w-32"></div>
            <div className="h-3 bg-gray-700 rounded w-24"></div>
          </div>
        </div>
        <div className="space-y-2 mb-3">
          <div className="h-4 bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-700 rounded w-4/5"></div>
        </div>
        <div className="w-full h-64 bg-gray-700 rounded-lg mb-3"></div>
        <div className="flex gap-4">
          <div className="h-4 bg-gray-700 rounded w-12"></div>
          <div className="h-4 bg-gray-700 rounded w-12"></div>
          <div className="h-4 bg-gray-700 rounded w-12"></div>
        </div>
      </div>
    </div>
  ));
}

export default PostboxSkeleton;