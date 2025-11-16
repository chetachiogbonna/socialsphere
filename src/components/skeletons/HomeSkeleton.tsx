import PostCardSkeleton from "./PostCardSkeleton";

const HomeSkeleton = () => {
  return (
    <section className="flex justify-center items-center pb-36 md:pb-20">
      <div className="flex flex-col gap-10 w-[500px]">
        <PostCardSkeleton />
        <PostCardSkeleton />
        <PostCardSkeleton />
      </div>
    </section>
  );
}

export default HomeSkeleton;