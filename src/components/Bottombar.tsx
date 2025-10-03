"use client";

import { bottomNavLinks } from "@/constants"
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Bottombar() {
  const pathname = usePathname();

  return (
    <section className="md:hidden fixed bottom-0 right-0 left-0 z-10000">
      <ul className="bg-dark-2 h-10 flex justify-between items-center px-5">
        {bottomNavLinks.map((link) => {
          const isActive = link.route === pathname;

          return (
            <li key={link.label}>
              <Link
                href={link.route}
                className={
                  cn("flex hover:bg-blue items-center p-2 rounded-md link", isActive ? "bg-blue link-active" : "hover:bg-light")
                }
              >
                <Image
                  src={link.image}
                  alt={link.label}
                  width={20}
                  height={20}
                  className="change-icon-color"
                />
              </Link>

            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default Bottombar