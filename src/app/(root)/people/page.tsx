"use client";

import { useState } from "react";
import { Search, UserPlus, UserCheck } from "lucide-react";
import Image from "next/image";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import useCurrentUserStore from "@/stores/useCurrentUserStore";
import PeopleSkeletonLoader from "@/components/skeletons/PeopleSkeletonLoader";
import { Id } from "../../../../convex/_generated/dataModel";
import Link from "next/link";

const mockUser = [
  {
    _id: "3",
    first_name: "Emma",
    last_name: "Davis",
    username: "emmad",
    profile_pic: "/api/placeholder/64/64",
    bio: "Photographer 📸",
    followers: 2341,
    following: 890,
    isFollowing: false
  }
]

function People() {
  const { currentUser } = useCurrentUserStore();
  const [searchQuery, setSearchQuery] = useState("");

  const currentUserId = currentUser ? currentUser._id : undefined;
  const users = useQuery(api.user.getOtherUsers, { userId: currentUserId })
  const toggleFollowMutation = useMutation(api.user.toggleFollow);

  if (!users || !currentUserId) {
    return <PeopleSkeletonLoader count={8} />;
  }

  const handleFollow = (targetUserId: Id<"users">) => {
    toggleFollowMutation({ targetUserId, currentUserId });
  };

  const filteredUsers = users.filter(user =>
    user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="pt-3 pb-20 max-w-5xl mx-auto px-4">
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-2xl md:text-3xl">Discover People</h2>
          <span className="text-sm text-white">{filteredUsers.length} users</span>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-gray-400 mb-2">
            <Search className="w-16 h-16 mx-auto mb-4 opacity-20" />
          </div>
          <p className="text-gray-500 text-lg">No users found</p>
          <p className="text-gray-400 text-sm">Try adjusting your search</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredUsers.map(user => (
            <li
              key={user._id}
              className="bg-dark-3 rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-gray-200"
            >
              <div className="p-6 flex flex-col items-center text-center">
                <Link
                  href={`/profile/${user._id}`}
                  className="relative mb-4 group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                  <Image
                    className="relative w-20 h-20 rounded-full border-4 border-white object-cover"
                    src={user.profile_pic}
                    alt={`${user.first_name} ${user.last_name}`}
                    width={80}
                    height={80}
                  />
                </Link>

                <div className="mb-4 space-y-1 w-full">
                  <h3 className="font-semibold text-lg truncate">
                    {user.first_name} {user.last_name}
                  </h3>
                  <Link
                    href={`/profile/${user._id}`}
                    className="text-sm text-gray-500 hover:text-blue-500 cursor-pointer transition-colors truncate">
                    @{user.username}
                  </Link>

                  <p className="text-xs text-gray-400 line-clamp-2 mt-2">
                    {user.bio || "No bio available."}
                  </p>
                </div>

                <div className="flex gap-6 mb-4 text-sm">
                  <div className="text-center">
                    <p className="font-semibold text-gray-600">{(user.followers?.length || 0).toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-gray-600">{(user.following?.length || 0).toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Following</p>
                  </div>
                </div>

                <button
                  onClick={() => handleFollow(user._id)}
                  className={`w-full py-2.5 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 ${user.isFollowing
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    : "bg-blue-500 text-white hover:bg-blue-600 shadow-sm hover:shadow-md"
                    }`}
                >
                  {user.isFollowing ? (
                    <>
                      <UserCheck className="w-4 h-4" />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Follow
                    </>
                  )}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default People;