import { Post } from "@/types";
import Image from "next/image";
import Link from "next/link";
import PostStats from "./PostStats";

function Postbox({ post }: { post: Post }) {
  const timeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="bg-dark-3 border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-all">
      <div className="flex items-center gap-3 mb-3">
        <Image
          src={post.user.profileImage}
          alt={post.user.username}
          className="w-10 h-10 rounded-full object-cover"
          width={40}
          height={40}
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate text-gray-200">
            {post.user.firstName} {post.user.lastName}
          </p>
          <p className="text-xs text-gray-500 text-nowrap">@{post.user.username} · {timeAgo(post._creationTime)}</p>
        </div>
      </div>

      <p className="text-sm text-gray-300 mb-3 truncate">{post.title}</p>

      <div className="relative z-0">
        <Image
          src={post.imageUrl}
          alt="Post"
          className="w-full h-64 rounded-lg mb-3 object-cover max-h-64"
          width={400}
          height={256}
        />

        <Link href={`/post-details/${post._id}`} className="absolute inset-0" />
      </div>

      <PostStats post={post} showComment={false} />
    </div>
  );
}

export default Postbox