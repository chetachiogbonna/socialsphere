"use client";

import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { Button } from "@/components/ui/button"
import Image from "next/image"

function People() {
  const users = useQuery(api.user.getAllUsers)

  return (
    <section className="pt-3 pb-44 xl:pb-20">
      <div className="flex flex-col gap-2 mb-8">
        <h2 className="w-[90%] md:w-[95%] mx-auto font-bold text-xl">People</h2>
      </div>

      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {users?.map(user => {
          return (
            <li key={user._id} className="max-sm:max-h-[400px] max-sm:max-w-[400px] sm:max-h-[350px] sm:max-w-[350px] rounded-2xl relative bg-[#9CA8B2]">
              <div className="w-full h-full rounded-2xl px-12 py-6 space-y-2 bg-light flex flex-col justify-center items-center p-4">
                {/* <Link to={`/profile/${user?.userId}`} className="w-16 h-16 rounded-full cursor-pointer bg-dark-3"> */}
                <Image
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full"
                  src={user.profile_pic || "/assets/images/profile-placeholder.jpg"}
                  alt="user profile"
                />
                {/* </Link> */}

                <div className="flex flex-col justify-center items-center">
                  <h2>{user.first_name + " " + user.last_name}</h2>
                  <h3
                    className="hover:underline cursor-pointer text-dark-3 text-[14px]"
                    onClick={() => { }}
                  >@{user.username}</h3>
                </div>

                <Button
                  className="bg-dark-3 hover:bg-dark-3"
                  type="button"
                >
                  Follow
                </Button>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default People