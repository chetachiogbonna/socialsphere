"use client";

import { leftSideNavLinks } from '@/constants'
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import Settings from './Settings';

function LeftSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:block md:w-[25%] xl:w-[20%] bg-dark-3 h-[100dvh] mt-[60px] pt-6">
      <ul className="flex flex-col px-4 gap-5 h-full relative">
        {leftSideNavLinks.map((link) => {
          const isActive = link.route === pathname;

          return (
            <li key={link.label}>
              <Link
                href={link.route}
                className={cn("flex gap-2 w-full items-center p-2 rounded-full link", isActive ? "bg-blue link-active" : "hover:bg-light")}
              >
                <Image
                  src={link.image}
                  alt={link.label}
                  width={24}
                  height={24}
                  className="change-icon-color h-6 w-6"
                />

                <div className="text-[13px] text-nowrap">{link.label}</div>
              </Link>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}

export default LeftSidebar