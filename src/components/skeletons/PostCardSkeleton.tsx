
const PostCardSkeleton = () => {
  return (
    <div className="bg-dark-3 rounded-lg border border-dark-4 overflow-hidden animate-pulse">
      {/* Card Header Skeleton */}
      <div className="p-4 border-b border-dark-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-700"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-700 rounded w-32"></div>
              <div className="h-3 bg-gray-700 rounded w-40"></div>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-6 h-6 bg-gray-700 rounded"></div>
            <div className="w-6 h-6 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>

      {/* Card Content Skeleton */}
      <div className="p-4 space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <div className="h-6 bg-gray-700 rounded w-3/4"></div>
          <div className="h-6 bg-gray-700 rounded w-1/2"></div>
        </div>

        {/* Image */}
        <div className="w-full h-80 bg-gray-700 rounded-lg"></div>

        {/* Tags */}
        <div className="flex gap-2">
          <div className="h-6 bg-gray-700 rounded-full w-16"></div>
          <div className="h-6 bg-gray-700 rounded-full w-20"></div>
          <div className="h-6 bg-gray-700 rounded-full w-14"></div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 pt-2">
          <div className="h-5 bg-gray-700 rounded w-12"></div>
          <div className="h-5 bg-gray-700 rounded w-12"></div>
          <div className="h-5 bg-gray-700 rounded w-12"></div>
        </div>
      </div>
    </div>
  );
}

export default PostCardSkeleton;