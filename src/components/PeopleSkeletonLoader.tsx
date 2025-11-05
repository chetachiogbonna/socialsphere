import React from 'react';

const UserCardSkeleton = () => {
  return (
    <div className="bg-dark-3 rounded-2xl border border-gray-100 overflow-hidden">
      <div className="p-6 flex flex-col items-center text-center animate-pulse">
        {/* Profile picture skeleton */}
        <div className="relative mb-4">
          <div className="w-20 h-20 rounded-full bg-gray-200"></div>
        </div>

        {/* Name and username skeleton */}
        <div className="mb-4 space-y-2 w-full">
          <div className="h-5 bg-gray-200 rounded-lg w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded-lg w-1/2 mx-auto"></div>
          <div className="h-3 bg-gray-200 rounded-lg w-full mx-auto mt-2"></div>
          <div className="h-3 bg-gray-200 rounded-lg w-4/5 mx-auto"></div>
        </div>

        {/* Stats skeleton */}
        <div className="flex gap-6 mb-4 w-full justify-center">
          <div className="text-center">
            <div className="h-5 bg-gray-200 rounded w-12 mx-auto mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="text-center">
            <div className="h-5 bg-gray-200 rounded w-12 mx-auto mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
        </div>

        {/* Button skeleton */}
        <div className="w-full h-10 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  );
};

const PeopleSkeletonLoader = ({ count = 8 }) => {
  return (
    <section className="pt-3 pb-20 max-w-5xl mx-auto px-4">
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded-lg w-48 animate-pulse"></div>
          <div className="h-5 bg-gray-200 rounded w-20 animate-pulse"></div>
        </div>

        <div className="relative max-w-md">
          <div className="w-full h-11 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {Array.from({ length: count }).map((_, index) => (
          <li key={index}>
            <UserCardSkeleton />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default PeopleSkeletonLoader;