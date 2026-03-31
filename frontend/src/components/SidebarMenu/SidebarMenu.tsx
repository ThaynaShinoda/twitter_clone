/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./SidebarMenu.module.css";
import { cloneElement, useState, useEffect } from "react";
import LogoBird from "../../assets/twitter_logo_bird.svg?react";
import defaultProfile from "../../assets/default_profile_normal_blue.png";
import { GearSixIcon } from "@phosphor-icons/react";

type MenuItem = {
  to: string;
  label: string;
  icon: React.ReactElement;
};

interface SidebarMenuProps {
  items: MenuItem[];
  className?: string;
  onDrawerToggle?: () => void;
}

export function SidebarMenu({
  items,
  className,
  onDrawerToggle,
}: SidebarMenuProps) {
  const location = useLocation();
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <aside className={`${styles.sidebar} ${className || ""}`}>
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

      {isMobile && (
        <div className={styles.menuItem} onClick={onDrawerToggle}>
          <GearSixIcon size={24} weight="regular" />
          <span className={styles.linkText}>Logout</span>
        </div>
      )}
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
