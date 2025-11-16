import PostboxSkeleton from "./PostboxSkeleton";

const ProfileSkeleton = () => {
  return (
    <section className="mx-auto space-y-4 w-[98%] md:w-[80%] lg:w-[70%] max-sm:last:mb-14 pb-20 min-h-screen">
      {/* Cover Photo Skeleton */}
      <div className="relative bg-gray-800 rounded-lg overflow-hidden h-48 md:h-56 animate-pulse">
        <div className="w-full h-full bg-gradient-to-r from-gray-700 to-gray-800" />
      </div>

      {/* Profile Info Card Skeleton */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 -mt-16 relative z-10">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Picture Skeleton */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-full border-4 border-gray-800 bg-gray-700 animate-pulse shadow-lg"></div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
              <div className="space-y-2 flex-1">
                {/* Name Skeleton */}
                <div className="h-8 bg-gray-700 rounded w-48 animate-pulse"></div>
                {/* Username Skeleton */}
                <div className="h-5 bg-gray-700 rounded w-32 animate-pulse"></div>
              </div>

              {/* Button Skeleton */}
              <div className="h-10 bg-gray-700 rounded w-32 animate-pulse"></div>
            </div>

            {/* Bio Skeleton */}
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-700 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-700 rounded w-4/5 animate-pulse"></div>
            </div>

            {/* Join Date Skeleton */}
            <div className="h-4 bg-gray-700 rounded w-36 mb-4 animate-pulse"></div>

            {/* Stats Skeleton */}
            <div className="flex gap-6">
              <div className="h-5 bg-gray-700 rounded w-20 animate-pulse"></div>
              <div className="h-5 bg-gray-700 rounded w-24 animate-pulse"></div>
              <div className="h-5 bg-gray-700 rounded w-24 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section Skeleton */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
        {/* Tab Headers Skeleton */}
        <div className="flex border-b border-gray-700">
          <div className="flex-1 px-4 py-3">
            <div className="h-6 bg-gray-700 rounded w-20 mx-auto animate-pulse"></div>
          </div>
          <div className="flex-1 px-4 py-3">
            <div className="h-6 bg-gray-700 rounded w-20 mx-auto animate-pulse"></div>
          </div>
        </div>

        <div className="p-6">
          <PostboxSkeleton />
        </div>
      </div>
    </section>
  );
};

export default ProfileSkeleton;