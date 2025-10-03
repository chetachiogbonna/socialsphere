import { Card, CardContent, CardFooter } from './ui/card'
import { Post } from '@/types';
import Image from 'next/image';
import PostStats from './PostStats';
import Link from 'next/link';

function Postbox({ post }: { post: Post }) {
  return (
    <Card className="bg-[#0a0a0a] text-white border border-neutral-800 py-0 h-[350px] rounded-2xl hover:scale-102 transition-transform duration-200 ease-in-out">
      <div className="relative w-full h-full">
        <Link href={`post-details/${post._id}`} className="absolute inset-0 z-100" />
        <CardContent className="w-full h-full rounded-2xl px-0">
          <Image
            className="h-full w-full rounded-2xl object-cover"
            src={post.imageUrl}
            fill
            alt="post image"
          />
        </CardContent>
        <CardFooter
          className="absolute w-full bottom-1 pb-3 px-0 flex flex-col gap-3 justify-start items-center z-1000"
        >
          <div className="flex gap-2 items-center mr-auto pl-2">
            <Image
              src={post.user.profileImage}
              className="w-10 h-10 rounded-full"
              width={40}
              height={40}
              alt=""
            />
            <p>{post.user.username}</p>
          </div>

          <div className="w-full mr-auto">
            <PostStats post={post} showComment={false} />
          </div>
        </CardFooter>
      </div>
    </Card>
  )
}

export default Postbox