"use client";

import { useState } from "react";
import { Calendar, Edit, Grid, Heart } from "lucide-react";
import Image from "next/image";
import EditProfileModal from "@/components/EditProfileModal";
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import Loader from "@/components/Loader";
import useCurrentUserStore from "@/stores/useCurrentUserStore";
import { Post } from "@/types";
import PostStats from "@/components/PostStats";
import { useParams } from "next/navigation";
import ProfileSkeleton from "@/components/skeletons/ProfileSkeleton";

function Postbox({ post }: { post: Post }) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-all h-max">
      <p className="text-sm text-gray-200 mb-3">{post.title}</p>

      <Image
        src={post.imageUrl}
        alt="Post"
        width={400}
        height={300}
        className="w-full rounded-lg mb-3 object-cover max-h-64"
      />

      <PostStats post={post} showComment={false} />
    </div>
  );
}

function Profile() {
  const { userId } = useParams();

  const { currentUser } = useCurrentUserStore();
  const [activeTab, setActiveTab] = useState<"posts" | "liked">("posts");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const userPosts = useQuery(api.post.getPostsByUser, {
    userId: (userId || currentUser?._id) as Id<"users">
  });
  const userLikedPosts = useQuery(api.post.getUserLikedPosts, {
    userId: (userId || currentUser?._id) as Id<"users">
  });

  const isOwnProfile = userId === currentUser?._id;

  if (!currentUser) {
    return <ProfileSkeleton />
  }

  const joinDate = new Date(currentUser._creationTime || Date.now()).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <>
      <section className="mx-auto space-y-4 w-[98%] md:w-[80%] lg:w-[70%] max-sm:last:mb-14 pb-20 min-h-screen">
        <div className="relative bg-gray-800 rounded-lg overflow-hidden h-48 md:h-56">
          {currentUser.cover_photo ? (
            <img
              src={currentUser.cover_photo}
              alt="Cover"
              // fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-gray-700 to-gray-800" />
          )}
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 -mt-16 relative z-10">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <img
                src={currentUser.profile_pic}
                alt={currentUser.username || "User"}
                width={128}
                height={128}
                className="w-32 h-32 rounded-full border-4 border-gray-800 object-cover shadow-lg"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {currentUser.first_name} {currentUser.last_name}
                  </h1>
                  <p className="text-gray-400">
                    @{currentUser.username || currentUser.email}
                  </p>
                </div>

                <div className="flex gap-2">
                  {isOwnProfile ? (
                    <Button
                      onClick={() => setIsEditModalOpen(true)}
                      variant="outline"
                      className="flex items-center gap-2 border-gray-600 bg-gray-800 hover:bg-gray-700 text-gray-200"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Profile
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        // Handle follow action
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Follow
                    </Button>
                  )}
                </div>
              </div>

              {currentUser.bio && (
                <p className="text-gray-300 mb-4">{currentUser.bio}</p>
              )}

              <div className="flex items-center gap-1 text-sm text-gray-400 mb-4">
                <Calendar className="w-4 h-4" />
                Joined {joinDate}
              </div>

              <div className="flex gap-6 text-sm">
                <div>
                  <span className="font-semibold text-white">{userPosts?.length || 0}</span>
                  <span className="text-gray-400 ml-1">posts</span>
                </div>
                <div>
                  <span className="font-semibold text-white">{currentUser.followers?.toLocaleString() || 0}</span>
                  <span className="text-gray-400 ml-1">followers</span>
                </div>
                <div>
                  <span className="font-semibold text-white">{currentUser.following?.toLocaleString() || 0}</span>
                  <span className="text-gray-400 ml-1">following</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab("posts")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 font-medium transition-colors ${activeTab === "posts"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                }`}
            >
              <Grid className="w-4 h-4" />
              Posts
            </button>
            {isOwnProfile && (
              <button
                onClick={() => setActiveTab("liked")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 font-medium transition-colors ${activeTab === "liked"
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                  }`}
              >
                <Heart className="w-4 h-4" />
                Liked
              </button>
            )}
          </div>

          <div className="p-6">
            {activeTab === "posts" && (
              <>
                {!userPosts
                  ? <Loader className="mx-auto" />
                  : (
                    <>
                      {userPosts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {userPosts.map((post) => <Postbox key={post._id} post={post} />)}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-gray-400">
                          <Grid className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                          <p>No posts yet</p>
                        </div>
                      )}
                    </>
                  )
                }
              </>
            )}

            {activeTab === "liked" && (
              <>
                {!userLikedPosts
                  ? <Loader className="mx-auto" />
                  : (
                    <>
                      {userLikedPosts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {userLikedPosts.map((post) => <Postbox key={post._id} post={post} />)}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-gray-400">
                          <Heart className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                          <p>No liked posts yet</p>
                        </div>
                      )}
                    </>
                  )
                }
              </>
            )}
          </div>
        </div>
      </section>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={{
          firstName: currentUser.first_name,
          lastName: currentUser.last_name,
          username: currentUser.username,
          profilePic: currentUser.profile_pic,
          coverPhoto: currentUser.cover_photo,
          bio: currentUser.bio,
          clerk_userId: currentUser.clerk_userId,
          email: currentUser.email,
          profilePicId: currentUser.profile_pic_id,
          coverPhotoId: currentUser.cover_photo_id
        }}
      />
    </>
  );
}

export default Profile;