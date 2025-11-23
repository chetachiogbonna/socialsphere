import CustomForm from '@/components/CustomForm'
import { convex } from '@/config/convex'
import Image from 'next/image'
import { api } from '../../../../../convex/_generated/api'
import { Id } from '../../../../../convex/_generated/dataModel'

type Props = {
  params: Promise<{ postId: string }>
}

async function EditPost({ params }: Props) {
  const postId = (await params).postId as Id<"posts">
  const post = await convex.query(api.post.getPostById, { postId })

  return (
    <section className="mx-auto space-y-4 w-[98%] md:w-[80%] lg:w-[60%]  pb-20">
      <div className="mb-6 flex gap-1 items-center">
        <Image
          src="/assets/icons/edit-icon.svg"
          className="change-icon"
          width={40}
          height={40}
          alt="create post"
        />
        <h2 className="text-2xl font-medium">Edit Post</h2>
      </div>

      <CustomForm post={post} type="Update" />
    </section>
  )
}

export default EditPost