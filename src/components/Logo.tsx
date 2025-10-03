import { LucideOrbit } from "lucide-react"
import Link from "next/link"

function Logo() {
  return (
    <Link href="/" className="md:w-52">
      <div className="ml-1 mt-[10px] flex justify-center items-center gap-2">
        <LucideOrbit
          color="#A23AF9"
        />

        <h1 className="font-semibold text-lg">Socialsphere</h1>
      </div>
    </Link>
  )
}

export default Logo