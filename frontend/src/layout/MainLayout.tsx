import { SidebarMenu } from "../components/SidebarMenu/SidebarMenu";
import { HouseIcon, UserIcon, UserPlusIcon } from "@phosphor-icons/react";

import styles from "./MainLayout.module.css";
import { Outlet } from "react-router-dom";
import { SidebarInfos } from "../components/SidebarInfos/SidebarInfos";
import { useState } from "react";

const menuItems = [
  { to: "/feed", label: "Home", icon: <HouseIcon size={24} /> },
  { to: "/follow", label: "Follow", icon: <UserPlusIcon size={24} /> },
  { to: "/profile", label: "Profile", icon: <UserIcon size={24} /> },
];

export function MainLayout() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className={styles.layout}>
      <SidebarMenu
        items={menuItems}
        className={styles.sidebarMenu}
        onDrawerToggle={() => setIsDrawerOpen(!isDrawerOpen)}
      />
      <main className={styles.content}>
        <Outlet />
      </main>
      <SidebarInfos
        className={styles.sidebarInfos}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
