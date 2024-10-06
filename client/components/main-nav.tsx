'use client'

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

interface MainNavProps extends React.HTMLAttributes<HTMLElement> {
  scolled: boolean;
}


const MainNav = ({ className, scolled, ...props }: MainNavProps) => {
    const pathName = usePathname();
    const params = useParams();
    const routes = [
      {
        href: "/",
        label: "Home",
        active: pathName === "/",
      },
      {
        href: "/menu",
        active: pathName === "/menu",
        label: "Menu",
      },
      {
        href: "/orders",
        active: pathName === "/orders",
        label: "Order",
      },
      {
        href: "/about",
        active: pathName === "/about",
        label: "About",
      },
      {
        href: "/contacts",
        active: pathName === "/contacts",
        label: "Contact",
      },
    ];
  return (
    <nav className="ml-auto">
      <nav
        className={cn(
          "flex items-center space-x-4 lg:space-x-12 pl-6",
          className
        )}
      >
        {routes.map((route) => (
          <Link
            href={route.href}
            key={route.href}
            className={cn(
              "text-base font-bold transition-colors hover:text-primary",
              route.active
                ? `${
                    scolled
                      ? "text-green-500 font-bold"
                      : "text-black dark:text-white"
                  }`
                : `${scolled ? "text-black" : " text-white"}`
            )}
          >
            {route.label}
          </Link>
        ))}
      </nav>
    </nav>
  );
};
 
export default MainNav;