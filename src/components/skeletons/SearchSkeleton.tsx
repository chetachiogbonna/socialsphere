import PostboxSkeleton from "./PostboxSkeleton";

const SearchSkeleton = () => {
  return (
    <section className="pt-3 pb-20 max-w-5xl mx-auto px-4">
      <div className="flex justify-start mb-6">
        <div className="h-8 bg-gray-700 rounded w-56 animate-pulse"></div>
      </div>
      <div className="relative max-w-md mb-6">
        <div className="w-full h-11 bg-gray-700 rounded-xl animate-pulse"></div>
      </div>

      <PostboxSkeleton />
    </section>
  );
}

export default SearchSkeleton;