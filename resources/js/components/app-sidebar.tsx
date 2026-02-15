import { Link, usePage } from "@inertiajs/react";
import {
  BookOpen, Folder, KeyRound, LayoutGrid, Shield, Users, UserCog,
} from "lucide-react";
import { NavFooter } from "@/components/nav-footer";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar";
import { dashboard } from "@/routes";
import type { NavItem } from "@/types";
import AppLogo from "./app-logo";

type PageProps = {
  auth: {
    permissions: string[];
    roles: string[];
  };
};

export function AppSidebar() {
  const { auth } = usePage<PageProps>().props;
  

  const can = (permission: string) => auth?.permissions?.includes(permission);
  const canAny = (permissions: string[]) => permissions.some((p) => can(p));

  const mainNavItems: NavItem[] = [
    {
      title: "Dashboard",
      href: dashboard(),
      icon: LayoutGrid,
    },

    // Role & Permissions group
    ...(canAny(["admin.users", "admin.roles", "admin.permissions"])
      ? [
          {
            title: "Role & Permissions",
            icon: Shield,
            items: [
              ...(can("admin.users")
                ? [
                    {
                      title: "Users",
                      href: "/admin/users",
                      icon: Users,
                    },
                  ]
                : []),

              ...(can("admin.roles")
                ? [
                    {
                      title: "Roles",
                      href: "/admin/roles",
                      icon: UserCog,
                    },
                  ]
                : []),

              ...(can("admin.permissions")
                ? [
                    {
                      title: "Permissions",
                      href: "/admin/permissions",
                      icon: KeyRound,
                    },
                  ]
                : []),
            ],
          },
        ]
      : []),
  ];

  const footerNavItems: NavItem[] = [
    {
      title: "Repository",
      href: "https://github.com/laravel/react-starter-kit",
      icon: Folder,
    },
    {
      title: "Documentation",
      href: "https://laravel.com/docs/starter-kits#react",
      icon: BookOpen,
    },
  ];

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={dashboard()} prefetch>
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={mainNavItems} />
      </SidebarContent>

      <SidebarFooter>
        <NavFooter items={footerNavItems} className="mt-auto" />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
