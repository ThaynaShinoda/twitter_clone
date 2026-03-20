/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./SidebarMenu.module.css";
import { cloneElement } from "react";
import LogoBird from "../../assets/twitter_logo_bird.svg?react";
import defaultProfile from "../../assets/default_profile_normal_blue.png"

type MenuItem = {
  to: string;
  label: string;
  icon: React.ReactElement;
};

interface SidebarMenuProps {
  items: MenuItem[];
}

export function SidebarMenu({ items }: SidebarMenuProps) {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <aside className={styles.sidebar}>
      <LogoBird className={styles.logo} />
      {items.map((item) => (
        <div
          key={item.to}
          className={`${styles.menuItem} ${location.pathname === item.to ? styles.selected : ""}`}
        >
          {cloneElement(item.icon as React.ReactElement<any>, {
            weight: location.pathname === item.to ? "fill" : "regular",
          })}
          <Link className={styles.linkText} to={item.to}>
            {item.label}
          </Link>
        </div>
      ))}
      <div className={styles.userBox}>
        <img
          src={user?.avatar || defaultProfile}
          alt="Avatar"
          className={styles.avatar}
        />
        <span className={styles.username}>@{user?.username || "Usuário"}</span>
      </div>
    </aside>
  );
}
