'use client'

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

const MainNav = ({
  className,
  ...props
}: React.HtmlHTMLAttributes<HTMLElement>) => {
    const pathName = usePathname();
    const params = useParams();

    const routes = [
      {
        href: `/${params.storeId}`,
        label: "Overview",
        active: pathName === `/${params.storeId}`,
      },
      {
        href: `/${params.storeId}/billboards`,
        label: "Billboards",
        active: pathName === `/${params.storeId}/billboards`,
      },
      {
        href: `/${params.storeId}/settings`,
        label: "Settings",
        active: pathName === `/${params.storeId}/settings`,
      },
    ];
  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6 pl-6")}>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active
              ? "text-red-500 dark:text-white bg-gray-200 px-2 py-2 rounded-md"
              : "text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
};
 
export default MainNav;