import { useUser } from "@/hooks/useUser"
import { useGetAllUsers } from "@/react-query"
import { useMemo } from "react"
import { useNavigate } from "react-router-dom"

function RightSideBar() {
  const { data: users } = useGetAllUsers()
  const { currentUserId } = useUser()
  const navigate = useNavigate()

  const randomUsers = useMemo(() => {
    if (users && users?.length > 4) {
      const shuffled = [...users].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 4);
    } else {
      return users;
    }
  }, [users])

  return (
    <aside className="hidden xl:block w-[20%] bg-dark-3 absolute right-0 mr-2 pt-4 border border-blue rounded-3xl right-side-bar">
      <ul className="flex flex-col gap-5">
        <div className="flex justify-between px-4">
          <h3 className="text-md">Suggested users</h3>
          <p className="text-sm text-blue cursor-pointer" onClick={() => navigate("/people")}>See all</p>
        </div>

        {randomUsers?.map((user) => {
          return user?.userId! === currentUserId!
            ? null
            : (
              <li key={user?.userId}>
                <div className="flex gap-2 justify-start px-4 items-center">
                  <img className="w-10 h-10 rounded-full cursor-pointer" src={user.profilePicUrl || "/assets/images/profile-placeholder.jpg"} alt="user profile" onClick={() => navigate(`/profile/${user?.userId}`)} />

                  <div>
                    <h4>{user.name}</h4>
                    <p 
                      className="text-gray-400 text-sm cursor-pointer hover:underline"
                      onClick={() => navigate(`/profile/${user?.userId}`)}
                    >
                      @{user.name}
                    </p>
                  </div>
                </div>
              </li>
            )
        })}
      </ul>
    </aside>
  )
}

export default RightSideBar