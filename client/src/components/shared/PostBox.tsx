import { useNavigate } from 'react-router-dom'
import PostStats from './PostStats'
import { useGetUserById } from '@/react-query';

function PostBox({ post, user: postOwner, isPending }: { post: Post, user?: IUser, isPending: boolean }) {
  const navigate = useNavigate()

  const { data } = useGetUserById(post?.userId as string);
  const user = postOwner || data;

  const handleClick = () => {
    if (window.location.href.startsWith("/post-details")) {
      const divElement = document.getElementById("select") as HTMLDivElement;
      divElement.scrollIntoView({
        block: "end"
      })
    }
    navigate(`/post-details/${post.postId}`)
  }

  return (
    <li className="w-full h-80 rounded-2xl relative mx-auto bg-[#A2A4B4]">
      <div 
        onClick={handleClick} className="h-full w-full cursor-pointer"
      >
        <div className="w-full h-full rounded-2xl">
          <img className="h-full w-full rounded-2xl object-cover" src={post.imageUrl} alt="post image" />
        </div>
        <div 
          className="absolute w-full bottom-1 px-4 pb-3 flex flex-col gap-3 justify-center items-cent">
          <div className="flex gap-2 items-center">
            <img 
              src={user?.profilePicUrl || "/assets/images/profile-placeholder.jpg"}
              className="w-10 h-10 rounded-full"
              alt="" 
            />
            <p>{user?.name}</p>
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <PostStats post={post} showComment={false} isPending={isPending} />
          </div>
        </div>
      </div>
    </li>
  )
}

export default PostBox