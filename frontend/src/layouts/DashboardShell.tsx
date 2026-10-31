import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Bell,
  Search,
  ChevronRight,
  LogOut,
  User,
  Settings,
} from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSeparator,
} from "@/components/ui/dropdown";
import { cn } from "@/utils/cn";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string | number;
}

export interface DashboardShellProps {
  roleTitle: string;
  roleBadge: string;
  roleBadgeVariant?: "teal" | "primary" | "info" | "warning" | "success";
  navItems: NavItem[];
  userDisplayName?: string;
  userEmail?: string;
  hospitalName?: string;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({
  roleTitle,
  roleBadge,
  roleBadgeVariant = "teal",
  navItems,
  userDisplayName = "Dr. Healthcare User",
  userEmail = "user@queuefree.health",
  hospitalName = "Apollo Multispecialty Hospital",
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-slate-50 text-navy-900 dark:bg-navy-950 dark:text-slate-100">
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 z-30 border-r border-slate-200/80 bg-white dark:border-navy-800 dark:bg-navy-900">
        {/* Brand Header */}
        <div className="flex h-16 items-center px-6 border-b border-slate-100 dark:border-navy-800">
          <Logo size="md" />
        </div>

        {/* Tenant Scoping Pill */}
        {hospitalName && (
          <div className="px-5 py-3 mx-3 my-3 rounded-xl bg-slate-50 border border-slate-200/70 dark:bg-navy-950/60 dark:border-navy-800">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Active Facility
            </span>
            <span className="block text-xs font-semibold text-navy-900 truncate dark:text-slate-200 mt-0.5">
              {hospitalName}
            </span>
          </div>
        )}

        {/* Navigation Section */}
        <nav className="flex-1 space-y-1 px-3 py-2 overflow-y-auto">
          <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {roleTitle} Navigation
          </div>
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.label}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all select-none group",
                  isActive
                    ? "bg-teal-50 text-teal-900 shadow-xs dark:bg-teal-950/60 dark:text-teal-200 border border-teal-200/60 dark:border-teal-800/60"
                    : "text-slate-600 hover:bg-slate-100 hover:text-navy-900 dark:text-slate-400 dark:hover:bg-navy-800 dark:hover:text-slate-200"
                )}
              >
                <span
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    isActive
                      ? "text-teal-600 dark:text-teal-400"
                      : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300"
                  )}
                >
                  {item.icon}
                </span>
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge && (
                  <Badge size="sm" variant="mint">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Card at bottom of sidebar */}
        <div className="p-3 border-t border-slate-100 dark:border-navy-800">
          <div className="flex items-center gap-3 rounded-xl p-2.5 hover:bg-slate-50 dark:hover:bg-navy-800/60 transition-colors">
            <Avatar name={userDisplayName} size="sm" status="online" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-navy-900 truncate dark:text-white">
                {userDisplayName}
              </p>
              <div className="mt-0.5">
                <Badge size="sm" variant={roleBadgeVariant}>
                  {roleBadge}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Navigation Backdrop and Sheet */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-navy-950/60 backdrop-blur-sm"
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white p-6 shadow-healthcare-lg flex flex-col justify-between dark:bg-navy-900 dark:border-r dark:border-navy-800"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-navy-800">
                  <Logo size="sm" />
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg p-1 text-slate-400 hover:text-navy-900 dark:hover:text-white"
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-4 mb-2">
                  <Badge variant={roleBadgeVariant} size="sm">
                    {roleBadge}
                  </Badge>
                </div>

                <nav className="mt-4 space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.label}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-navy-800"
                    >
                      <span className="h-4 w-4 text-teal-600 dark:text-teal-400">
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="border-t border-slate-100 pt-4 dark:border-navy-800">
                <div className="flex items-center gap-3">
                  <Avatar name={userDisplayName} size="sm" status="online" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate dark:text-white">
                      {userDisplayName}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {userEmail}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Layout Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Operational Header */}
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 sm:px-6 backdrop-blur-sm dark:border-navy-800 dark:bg-navy-900/95">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-navy-800"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Breadcrumb / Title */}
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-navy-900 dark:text-white">
                QueueFree
              </span>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="font-medium text-teal-700 dark:text-teal-400">
                {roleTitle}
              </span>
            </div>
          </div>

          {/* Right Header Utilities */}
          <div className="flex items-center gap-3">
            {/* Quick search input shortcut */}
            <div className="hidden md:flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-400 dark:border-navy-800 dark:bg-navy-950">
              <Search className="h-3.5 w-3.5" />
              <span>Search appointments, doctors, tokens...</span>
              <kbd className="rounded bg-white px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-500 shadow-xs border border-slate-200 dark:bg-navy-900 dark:border-navy-700">
                ⌘K
              </kbd>
            </div>

            {/* Notification trigger */}
            <button
              type="button"
              className="relative rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-navy-800 transition-colors"
              aria-label="View notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-teal-500 ring-2 ring-white dark:ring-navy-900" />
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Profile Menu */}
            <Dropdown>
              <DropdownTrigger>
                <div className="flex items-center gap-2 pl-2">
                  <Avatar name={userDisplayName} size="sm" />
                </div>
              </DropdownTrigger>
              <DropdownMenu align="right">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-navy-800">
                  <p className="text-xs font-bold text-navy-900 dark:text-white">
                    {userDisplayName}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {userEmail}
                  </p>
                  <div className="mt-1.5">
                    <Badge size="sm" variant={roleBadgeVariant}>
                      {roleBadge}
                    </Badge>
                  </div>
                </div>

                <DropdownItem icon={<User className="h-3.5 w-3.5" />}>
                  My Profile
                </DropdownItem>
                <DropdownItem icon={<Settings className="h-3.5 w-3.5" />}>
                  Preferences
                </DropdownItem>
                <DropdownSeparator />
                <DropdownItem
                  icon={<LogOut className="h-3.5 w-3.5" />}
                  destructive
                >
                  Sign Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </header>

        {/* Content View Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
