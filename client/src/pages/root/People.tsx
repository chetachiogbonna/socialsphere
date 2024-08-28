import { useGetAllUsers } from "@/react-query"
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import { Link } from "react-router-dom";

function People() {
  const { data: users, isPending: isGettingUser } = useGetAllUsers()

  if (isGettingUser) {
    return (
      <Loader className="mx-auto" />
    )
  }

  return (
    <section className="pt-3 pb-28 xl:pb-20">
      <div className="flex flex-col gap-2 mb-8">
        <h2 className="w-[90%] md:w-[95%] mx-auto font-bold text-xl">People</h2>
      </div>

      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {users?.map(user => {
          return (
            <li key={user?.userId} className="max-sm:max-h-[400px] max-sm:max-w-[400px] sm:max-h-[350px] sm:max-w-[350px] rounded-2xl relative bg-[#9CA8B2] mx-auto">
              <div className="w-full h-full rounded-2xl px-12 py-6 space-y-2 bg-light">
                <Link to={`/profile/${user?.userId}`} className="w-16 h-16 rounded-full cursor-pointer bg-dark-3">
                  <img className="w-16 h-16 rounded-full" src={user.profilePicUrl || "/assets/images/profile-placeholder.jpg"} alt="user profile" />
                </Link>

                <Link to={`/profile/${user?.userId}`} className="flex flex-col justify-center items-center">
                  <h2>{user.name}</h2>
                  <h3
                    className="hover:underline cursor-pointer text-dark-3 text-[14px]"
                    onClick={() => {}}
                  >@{user.name}</h3>
                </Link>

                <Button
                  className="bg-dark-3 hover:bg-dark-3"
                  type="button"
                >Follow</Button>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default People