import React from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { type NavItem } from "./Navbar";
import { useRouter } from "next/router";
import { cn } from "~/utils/styles";
import Text from "~/lib/Typo/Text";
import Dropdown from "~/lib/Dropdown";
import { ArrowSmallRightIcon } from "@heroicons/react/24/solid";

export default function NavLink({ link }: { link: NavItem }) {
  const { data: session } = useSession();
  const router = useRouter();
  const canAccess =
    !link.roles || link.roles.includes(session?.user.role ?? null);
  const isActive = link.children
    ? router.asPath.startsWith(link.href)
    : router.asPath === link.href;
  if (!canAccess) {
    return null;
  }

  if (link.children) {
    return (
      <Dropdown className={cn(isActive && "text-primary")} label={link.label}>
        <div className="flex flex-col gap-1">
          {Object.values(link.children).map((child) => (
            <Link key={child.href} href={link.href + child.href}>
              <Dropdown.Item>
                {({ active }) => (
                  <div
                    className={cn(
                      active && "translate-x-2 text-primary",
                      "flex items-center gap-1 transition-all duration-300"
                    )}
                  >
                    {child.label}

                    <ArrowSmallRightIcon
                      className={cn(
                        active ? "opacity-100" : "opacity-0",
                        "h-5 w-5 stroke-2 transition-opacity duration-300"
                      )}
                      style={{
                        transform: "rotate(-45deg)",
                      }}
                    />
                  </div>
                )}
              </Dropdown.Item>
            </Link>
          ))}
        </div>
      </Dropdown>
    );
  }

  return (
    <li>
      <Link href={link.href}>
        <Text className={cn(isActive && "text-primary")}>{link.label}</Text>
      </Link>
    </li>
  );
}
