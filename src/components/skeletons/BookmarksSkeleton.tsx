import PostboxSkeleton from "./PostboxSkeleton";

const BookmarksSkeleton = () => {
  return (
    <section className="pt-3 pb-20 max-w-5xl mx-auto px-4">
      <div className="flex justify-start mb-6">
        <div className="h-8 bg-gray-700 rounded w-40 animate-pulse"></div>
      </div>

      <PostboxSkeleton />
    </section>
  );
}

export default BookmarksSkeleton