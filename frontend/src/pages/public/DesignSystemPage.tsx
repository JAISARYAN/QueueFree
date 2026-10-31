import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  Heart,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  User,
  ExternalLink,
  Building2,
} from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { ThemeSegmentedControl } from "@/components/common/ThemeToggle";
import {
  Button,
  Input,
  PasswordInput,
  Select,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Avatar,
  Modal,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSeparator,
  Tooltip,
  Spinner,
  PulseDots,
  HeartbeatLoader,
  EmptyState,
  ErrorState,
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
} from "@/components/ui";
import { useToast } from "@/hooks/useToast";

export const DesignSystemPage: React.FC = () => {
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState("");

  const handleValidateInput = (val: string) => {
    setInputValue(val);
    if (val.length > 0 && val.length < 3) {
      setInputError("Hospital UHID must contain at least 3 characters.");
    } else {
      setInputError("");
    }
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Header & Styleguide Hero */}
      <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-200 dark:border-navy-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 dark:bg-teal-950 dark:border-teal-800 dark:text-teal-300 text-xs font-semibold mb-3">
            <Activity className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
            Healthcare UI Design System — Phase 2
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-navy-900 dark:text-white">
            QueueFree Design System
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            A cohesive, accessible design language for clinical and patient-facing
            surfaces. Built with strictly typed tokens, WCAG AA contrast compliance,
            and role-specific layouts.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <ThemeSegmentedControl />
        </div>
      </section>

      {/* 1. Brand Identity & Logo Variants */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 dark:border-navy-800 pb-2">
          <h2 className="text-xl font-bold text-navy-900 dark:text-white flex items-center gap-2">
            <Heart className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            1. Brand Identity & Visual Assets
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Healthcare clinical cross merged with a dynamic speed forward queue arc
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Full Wordmark & Tagline</CardTitle>
              <CardDescription>Primary brand signature for headers and banners</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-6 bg-slate-50/50 dark:bg-navy-950/40 rounded-xl">
              <Logo size="lg" withTagline />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Symbol Mark Only</CardTitle>
              <CardDescription>App icons, favicons, mobile nav, and compact headers</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-6 bg-slate-50/50 dark:bg-navy-950/40 rounded-xl">
              <Logo variant="mark" size="xl" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Logotype Typography</CardTitle>
              <CardDescription>Text-only rendering with brand tagline</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-8 bg-slate-50/50 dark:bg-navy-950/40 rounded-xl">
              <Logo variant="text" size="lg" withTagline />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 2. Color System & Semantic Tokens */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 dark:border-navy-800 pb-2">
          <h2 className="text-xl font-bold text-navy-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            2. Color Palette & Semantic Tokens
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Deep Navy (#102A43), Healthcare Teal (#0D9488), Soft Mint (#CCFBF1), Slate (#64748B), and White
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-navy-800 dark:bg-navy-900">
            <div className="h-12 w-full rounded-lg bg-[#102A43] shadow-xs" />
            <div className="mt-2.5">
              <span className="block text-xs font-bold text-navy-900 dark:text-white">
                Deep Navy
              </span>
              <span className="block text-[11px] font-mono text-slate-500">
                #102A43
              </span>
              <span className="text-[10px] text-teal-600 dark:text-teal-400 font-medium">
                Primary Brand
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-navy-800 dark:bg-navy-900">
            <div className="h-12 w-full rounded-lg bg-[#0D9488] shadow-xs" />
            <div className="mt-2.5">
              <span className="block text-xs font-bold text-navy-900 dark:text-white">
                Healthcare Teal
              </span>
              <span className="block text-[11px] font-mono text-slate-500">
                #0D9488
              </span>
              <span className="text-[10px] text-teal-600 dark:text-teal-400 font-medium">
                Accent & Care
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-navy-800 dark:bg-navy-900">
            <div className="h-12 w-full rounded-lg bg-[#CCFBF1] border border-teal-200 shadow-xs" />
            <div className="mt-2.5">
              <span className="block text-xs font-bold text-navy-900 dark:text-white">
                Soft Mint
              </span>
              <span className="block text-[11px] font-mono text-slate-500">
                #CCFBF1
              </span>
              <span className="text-[10px] text-teal-600 dark:text-teal-400 font-medium">
                Highlight & Pill
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-navy-800 dark:bg-navy-900">
            <div className="h-12 w-full rounded-lg bg-[#64748B] shadow-xs" />
            <div className="mt-2.5">
              <span className="block text-xs font-bold text-navy-900 dark:text-white">
                Slate
              </span>
              <span className="block text-[11px] font-mono text-slate-500">
                #64748B
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                Muted & Borders
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-navy-800 dark:bg-navy-900">
            <div className="h-12 w-full rounded-lg bg-[#059669] shadow-xs" />
            <div className="mt-2.5">
              <span className="block text-xs font-bold text-navy-900 dark:text-white">
                Success Emerald
              </span>
              <span className="block text-[11px] font-mono text-slate-500">
                #059669
              </span>
              <span className="text-[10px] text-emerald-600 font-medium">
                Checked-In
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-navy-800 dark:bg-navy-900">
            <div className="h-12 w-full rounded-lg bg-[#DC2626] shadow-xs" />
            <div className="mt-2.5">
              <span className="block text-xs font-bold text-navy-900 dark:text-white">
                Clinical Rose
              </span>
              <span className="block text-[11px] font-mono text-slate-500">
                #DC2626
              </span>
              <span className="text-[10px] text-rose-600 font-medium">
                Emergency & Alert
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Typography Hierarchy */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 dark:border-navy-800 pb-2">
          <h2 className="text-xl font-bold text-navy-900 dark:text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            3. Typography System
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Display, page, section, body, label, and caption hierarchies
          </p>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-6 divide-y divide-slate-100 dark:divide-navy-800">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <span className="text-xs font-mono text-slate-400 w-36">Display Heading</span>
              <h1 className="text-4xl font-extrabold tracking-tight text-navy-900 dark:text-white">
                SKIP THE LINE. SAVE YOUR TIME.
              </h1>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <span className="text-xs font-mono text-slate-400 w-36">Page Heading</span>
              <h2 className="text-2xl font-bold tracking-tight text-navy-900 dark:text-white">
                Outpatient Department Consultation Queue
              </h2>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <span className="text-xs font-mono text-slate-400 w-36">Section Heading</span>
              <h3 className="text-lg font-semibold text-navy-900 dark:text-white">
                Cardiology Department — Room 304
              </h3>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <span className="text-xs font-mono text-slate-400 w-36">Body Text</span>
              <p className="text-sm text-slate-700 dark:text-slate-300 max-w-xl leading-relaxed">
                Your estimated consultation begins at 10:45 AM. There are currently 3
                patients ahead in the active waiting sequence. Please arrive at the
                hospital 15 minutes before your estimated call time.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <span className="text-xs font-mono text-slate-400 w-36">Label & Caption</span>
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-navy-900 dark:text-slate-200">
                  TOKEN #CARD-014
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Estimated wait: 18 mins
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 4. Interactive Reusable Components Showcase */}
      <section className="space-y-8">
        <div className="border-b border-slate-200 dark:border-navy-800 pb-2">
          <h2 className="text-xl font-bold text-navy-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            4. Reusable UI Components Gallery
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Production-ready component library featuring buttons, inputs, modals, toasts, dropdowns, and badges
          </p>
        </div>

        {/* Buttons Gallery */}
        <Card>
          <CardHeader>
            <CardTitle>Button System & Interaction States</CardTitle>
            <CardDescription>
              Framer Motion micro-tap feedback with variant hierarchy and loading states
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Primary Navy</Button>
              <Button variant="teal">Healthcare Teal</Button>
              <Button variant="secondary">Secondary Slate</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link Button</Button>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button size="sm" variant="teal">Small (sm)</Button>
              <Button size="md" variant="teal">Medium (md)</Button>
              <Button size="lg" variant="teal">Large (lg)</Button>
              <Button
                variant="teal"
                isLoading={buttonLoading}
                onClick={() => {
                  setButtonLoading(true);
                  setTimeout(() => setButtonLoading(false), 2000);
                }}
              >
                {buttonLoading ? "Saving..." : "Click For Loading State"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Form Controls: Input, PasswordInput, Select */}
        <Card>
          <CardHeader>
            <CardTitle>Accessible Form Controls</CardTitle>
            <CardDescription>
              Inputs with live error validation, helper text, and password visibility toggling
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Patient UHID Number"
              placeholder="e.g. QF-98214"
              value={inputValue}
              onChange={(e) => handleValidateInput(e.target.value)}
              error={inputError}
              helperText="Type fewer than 3 chars to test live error state"
              required
            />

            <PasswordInput
              label="Staff Security Password"
              placeholder="Enter secure password"
              helperText="Click eye icon to toggle visibility"
              required
            />

            <Select
              label="Clinical Department"
              placeholder="Choose a department..."
              options={[
                { value: "cardiology", label: "Cardiology" },
                { value: "orthopedics", label: "Orthopedics & Joint Care" },
                { value: "pediatrics", label: "Pediatrics & Neonatology" },
                { value: "general", label: "General Medicine" },
              ]}
              helperText="Select specialist OPD clinic"
            />
          </CardContent>
        </Card>

        {/* Badges & Avatars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Status Badges</CardTitle>
              <CardDescription>Queue states with optional pulsing status indicator</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2.5">
              <Badge variant="teal" dot>Checked In</Badge>
              <Badge variant="success" dot>In Consultation</Badge>
              <Badge variant="warning" dot>Doctor Delayed</Badge>
              <Badge variant="error" dot>No Show / Cancelled</Badge>
              <Badge variant="mint">Mint Highlight</Badge>
              <Badge variant="info">Scheduled</Badge>
              <Badge variant="primary">Hospital Admin</Badge>
              <Badge variant="secondary">Walk-In Buffer</Badge>
              <Badge variant="outline">Outline</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Avatars & Presence Indicators</CardTitle>
              <CardDescription>Initials generator with presence status dots</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-4">
              <Avatar name="Dr. Sarah Patel" size="xl" status="online" />
              <Avatar name="Dr. Rohan Gupta" size="lg" status="busy" />
              <Avatar name="Aarav Sharma" size="md" status="away" />
              <Avatar name="Sunil Verma" size="sm" status="offline" />
              <Avatar name="QF" size="xs" />
            </CardContent>
          </Card>
        </div>

        {/* Modals, Dropdowns & Tooltips */}
        <Card>
          <CardHeader>
            <CardTitle>Overlay Primitives: Modals, Dropdowns & Tooltips</CardTitle>
            <CardDescription>
              Framer Motion animated dialogs, action menus, and accessible tooltips
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-6">
            <Button variant="teal" onClick={() => setModalOpen(true)}>
              Open Demo Modal
            </Button>

            <Dropdown>
              <DropdownTrigger>
                <Button variant="outline">Open Actions Dropdown ▾</Button>
              </DropdownTrigger>
              <DropdownMenu align="left">
                <DropdownItem icon={<User className="h-4 w-4" />}>
                  View Patient History
                </DropdownItem>
                <DropdownItem icon={<Calendar className="h-4 w-4" />}>
                  Reschedule OPD Slot
                </DropdownItem>
                <DropdownSeparator />
                <DropdownItem
                  icon={<AlertTriangle className="h-4 w-4" />}
                  destructive
                >
                  Cancel Appointment
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>

            <Tooltip content="Live queue progress is calculated every 30 seconds" position="top">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 cursor-help border-b border-dashed border-teal-500 pb-0.5">
                Hover for Telemetry Tooltip
              </span>
            </Tooltip>
          </CardContent>
        </Card>

        {/* Toast System Triggers */}
        <Card>
          <CardHeader>
            <CardTitle>Toast Notification System</CardTitle>
            <CardDescription>
              Global auto-dismissing toast notifications with slide-in animation
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                toast.success(
                  "Token CARD-014 has been checked in successfully.",
                  "Patient Arrived"
                )
              }
            >
              Trigger Success Toast
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                toast.warning(
                  "Dr. Priya Nambiar has reported a 20-minute clinic delay.",
                  "OPD Delay Notice"
                )
              }
            >
              Trigger Warning Toast
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                toast.error(
                  "Connection to hospital database timed out. Retrying...",
                  "Database Connectivity"
                )
              }
            >
              Trigger Error Toast
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                toast.info(
                  "Please proceed to Room 304 when your token is called.",
                  "Queue Announcement"
                )
              }
            >
              Trigger Info Toast
            </Button>
          </CardContent>
        </Card>

        {/* Loading Indicators & Heartbeat Animation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Healthcare ECG Pulse</CardTitle>
              <CardDescription>Animated clinical heartbeat wave</CardDescription>
            </CardHeader>
            <CardContent>
              <HeartbeatLoader label="Live Queue Heartbeat Active" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Spinners & Pulse Dots</CardTitle>
              <CardDescription>Standard micro-loading indicators</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-6 gap-6">
              <div className="flex items-center gap-4">
                <Spinner size="sm" />
                <Spinner size="md" />
                <Spinner size="lg" />
              </div>
              <PulseDots />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skeleton Loaders</CardTitle>
              <CardDescription>Pulsing layout placeholders</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <SkeletonAvatar size="sm" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-1/2" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
              <SkeletonText lines={2} />
            </CardContent>
          </Card>
        </div>

        {/* Empty States & Error States */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EmptyState
            title="No Active Queue Tokens"
            description="You do not have any appointments scheduled for today. Book a slot or search the hospital directory."
            action={
              <Button variant="teal" size="sm">
                Book OPD Slot
              </Button>
            }
          />

          <ErrorState
            title="Hospital Gateway Connection Failed"
            message="Unable to fetch live OPD rosters from the facility server. Please check your network connection."
            onRetry={() => toast.info("Retrying gateway connection...")}
          />
        </div>
      </section>

      {/* 5. Role-Specific Application Layouts Navigation */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 dark:border-navy-800 pb-2">
          <h2 className="text-xl font-bold text-navy-900 dark:text-white flex items-center gap-2">
            <Building2 className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            5. Role-Specific Application Layout Foundations
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Explore the 7 decoupled layout shells prepared for each healthcare stakeholder
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/patient/dashboard"
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-healthcare hover:border-teal-500 transition-all dark:border-navy-800 dark:bg-navy-900"
          >
            <div className="flex items-center justify-between">
              <Badge variant="teal">Patient Portal</Badge>
              <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400" />
            </div>
            <h3 className="mt-3 font-bold text-navy-900 dark:text-white text-sm">
              Patient Dashboard Layout
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Live token tracker, slot reservation, appointment history, and family records.
            </p>
          </Link>

          <Link
            to="/doctor/dashboard"
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-healthcare hover:border-teal-500 transition-all dark:border-navy-800 dark:bg-navy-900"
          >
            <div className="flex items-center justify-between">
              <Badge variant="teal">Doctor Console</Badge>
              <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400" />
            </div>
            <h3 className="mt-3 font-bold text-navy-900 dark:text-white text-sm">
              Doctor Clinical Layout
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              OPD session control, call next token, consultation history, and delay reporting.
            </p>
          </Link>

          <Link
            to="/receptionist/dashboard"
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-healthcare hover:border-teal-500 transition-all dark:border-navy-800 dark:bg-navy-900"
          >
            <div className="flex items-center justify-between">
              <Badge variant="info">Front Desk</Badge>
              <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400" />
            </div>
            <h3 className="mt-3 font-bold text-navy-900 dark:text-white text-sm">
              Receptionist Intake Layout
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Arrival check-in, walk-in token issuance, queue triage, and waiting hall display.
            </p>
          </Link>

          <Link
            to="/admin/dashboard"
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-healthcare hover:border-teal-500 transition-all dark:border-navy-800 dark:bg-navy-900"
          >
            <div className="flex items-center justify-between">
              <Badge variant="primary">Hospital Admin</Badge>
              <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400" />
            </div>
            <h3 className="mt-3 font-bold text-navy-900 dark:text-white text-sm">
              Hospital Admin Layout
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Clinical departments, doctor quotas, queue buffer policies, and audit logs.
            </p>
          </Link>

          <Link
            to="/superadmin/dashboard"
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-healthcare hover:border-teal-500 transition-all dark:border-navy-800 dark:bg-navy-900"
          >
            <div className="flex items-center justify-between">
              <Badge variant="warning">Platform SuperAdmin</Badge>
              <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400" />
            </div>
            <h3 className="mt-3 font-bold text-navy-900 dark:text-white text-sm">
              Platform Admin Layout
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Multi-tenant hospital directory, system gateways, and compliance monitoring.
            </p>
          </Link>

          <Link
            to="/auth/login"
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-healthcare hover:border-teal-500 transition-all dark:border-navy-800 dark:bg-navy-900"
          >
            <div className="flex items-center justify-between">
              <Badge variant="mint">Authentication</Badge>
              <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400" />
            </div>
            <h3 className="mt-3 font-bold text-navy-900 dark:text-white text-sm">
              Auth Split-Screen Layout
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Clean healthcare hero with clinical security credentials and centered form.
            </p>
          </Link>
        </div>
      </section>

      {/* Modal Dialog Demo Instance */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Patient Token Check-In Confirmation"
        description="Verify patient appointment details before issuing active queue token."
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="teal"
              size="sm"
              onClick={() => {
                setModalOpen(false);
                toast.success(
                  "Token CARD-014 issued for Cardiology Consultation.",
                  "Check-In Complete"
                );
              }}
            >
              Confirm & Issue Token
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 dark:bg-navy-950 dark:border-navy-800">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Patient:</span>
              <span className="font-bold text-navy-900 dark:text-white">
                Aarav Sharma (UHID #QF-98214)
              </span>
            </div>
            <div className="flex justify-between items-center text-xs mt-2">
              <span className="text-slate-500">Doctor:</span>
              <span className="font-bold text-navy-900 dark:text-white">
                Dr. Priya Nambiar (Cardiology, Room 304)
              </span>
            </div>
            <div className="flex justify-between items-center text-xs mt-2">
              <span className="text-slate-500">Scheduled Slot:</span>
              <span className="font-semibold text-teal-700 dark:text-teal-400">
                10:30 AM - 10:45 AM
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            By issuing this token, the patient is placed into the active waiting hall
            queue. An automated arrival SMS and WhatsApp notification will be dispatched.
          </p>
        </div>
      </Modal>
    </div>
  );
};
