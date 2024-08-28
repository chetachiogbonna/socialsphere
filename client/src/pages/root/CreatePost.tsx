import PostForm from "@/components/shared/PostForm";

function CreatePost() {
  return (
    <section className="pt-3 pb-32 md:pb-20">
      <div className="mx-auto mb-6 flex gap-1 items-center w-[98%] md:w-[80%]">
        <img src="/assets/icons/create.svg" className="change-icon" width={40} height={40} alt="create post" />
        <h2 className="text-2xl font-medium">Create Post</h2>
      </div>

      <PostForm action="Create" />
    </section>
  )
}

export default CreatePost