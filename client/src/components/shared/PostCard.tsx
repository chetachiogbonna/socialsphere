import { Link, useNavigate } from "react-router-dom"
import PostStats from "./PostStats"
import { useGetUserById } from "@/react-query";
import { cn, convertToReadableDateString } from "@/lib/utils";
import { useUser } from "@/hooks/useUser";
import { forwardRef, LegacyRef, useState } from "react";
import DeletePostAlert from "./DeletePostAlert";
import AI from "./AI";


const PostCard = forwardRef(({ post, isPending, currentViewingPost }: { post: Post, isPending: boolean, currentViewingPost: Post }, ref) => {
  const navigate = useNavigate();
  const { currentUserId } = useUser();

  const { data: user } = useGetUserById(post.userId)

  const isPostOwned = currentUserId === post.userId;

  const [showEditAndDelete, setShowEditAndDelete] = useState(false)
  const [deletePost, setDeletePost] = useState(false)
    
  return (
    <li
      ref={ref as LegacyRef<HTMLLIElement> | undefined}
      data-post={JSON.stringify(post)}
      className="flex flex-col gap-3 bg-dark-5 border border-light rounded-xl px-2 md:px-6 pb-7 pt-2 w-full max-w-[500px] mx-auto"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div 
            onClick={() => navigate(`/profile/${post.userId}`)}
            className="w-[40px] h-[40px] cursor-pointer"
          >
            <img className="w-full h-full rounded-full" src={user?.profilePicUrl || "/assets/images/profile-placeholder.jpg"} alt="profile pic" />
          </div>
          <div>
            <h2 
              onClick={() => navigate(`/profile/${post.userId}`)}
              className="hover:underline capitalize cursor-pointer"
            >
              {user?.name}
            </h2>
            <h3 
              className="text-gray-600 text-xs"
            >
              {convertToReadableDateString(post.createdAt)} 
              <span className="font-bold"> &bull; </span>
              {post.location}
            </h3>
          </div>
        </div>

        <div className="flex">
          {currentViewingPost?.postId === post?.postId && (
            <AI className="w-6 h-6 relative" />
          )}

          <div className={cn("hidden relative", { "block": isPostOwned })}>
            {showEditAndDelete && (
              <div className="absolute flex flex-col gap-1 rounded-md right-10 -top-2.5 bg-[#1A1A1A] py-1 pl-1 pr-8 border border-light showEditAndDelete">
                <p
                  className="flex items-center gap-1 text-xs cursor-pointer"
                  onClick={() => navigate(`/edit-post/${post.postId}`)}
                >
                  <img 
                    width={20}
                    height={20}
                    onClick={() => navigate(`edit-post/${post.postId}`)} 
                    className={cn("cursor-pointer hidden change-icon", { "block": isPostOwned })} 
                    src="/assets/icons/edit.svg"
                    alt="edit icon" 
                  />
                  Edit
                </p>
                <p 
                  className="flex items-center gap-1 text-xs cursor-pointer"
                  onClick={() => setDeletePost(true)}
                >
                  <img 
                    width={20}
                    height={20}
                    src="/assets/icons/delete.svg" 
                    alt="" 
                  />
                  Delete
                </p>
              </div>
            )}

            <img
              onClick={(e) => {
                e.stopPropagation()
                setShowEditAndDelete(prev => !prev)
              }} 
              className="cursor-pointer"
              src="/assets/icons/three-dot.svg" 
              alt="" 
            />
          </div>
        </div>
      </div>

      <hr className="border-light" />

      <Link to={`/post-details/${post.postId}`}>
        <h4 className="line-clamp-2 mb-3 text-xs md:text-sm">{post.title}</h4>
        <div className="h-[350px]">
          <img className="w-full h-full rounded-xl" src={post.imageUrl} alt="post image" />
        </div>
      </Link>
      <PostStats post={post} isPending={isPending} />

      {deletePost && (
        <DeletePostAlert 
          deletePost={deletePost}
          setShowEditAndDelete={setShowEditAndDelete}
          post={post}
          setDeletePost={setDeletePost}
        />
      )}
    </li>
  )
})

export default PostCard