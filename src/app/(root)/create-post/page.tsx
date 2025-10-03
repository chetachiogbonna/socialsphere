import CustomForm from '@/components/CustomForm'
import Image from 'next/image'

function CreatePost() {
  return (
    <section className="mx-auto space-y-4 w-[98%] md:w-[80%] lg:w-[60%] max-sm:last:mb-14 pb-20">
      <div id="scroll-title" className="scroll-m-10" />

      <div className="mb-6 flex gap-1 items-center">
        <Image
          src="/assets/icons/create.svg"
          className="change-icon"
          width={40}
          height={40}
          alt="create post"
        />
        <h2 className="text-2xl font-medium">Create Post</h2>
      </div>

      <CustomForm type="Create" />
    </section>
  )
}

export default CreatePost