import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { doctorsService, slotsService } from "@/services/api/clinical";
import type { AppointmentSlot, Doctor, DoctorShift } from "@/types";
import {
  Calendar,
  Clock,
  Ban,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HeartbeatLoader } from "@/components/ui/loading";

const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const DoctorDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [shifts, setShifts] = useState<DoctorShift[]>([]);
  const [slots, setSlots] = useState<AppointmentSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const fetchDoctorData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Find doctor profile matching current authenticated user
      const doctorsList = await doctorsService.list();
      let activeDoc = doctorsList.find((d) => d.user === user?.id || d.email === user?.email);

      if (!activeDoc && doctorsList.length > 0) {
        // Fallback for preview / superadmin testing
        activeDoc = doctorsList[0];
      }

      setDoctor(activeDoc || null);

      if (activeDoc) {
        const [shiftsData, slotsData] = await Promise.all([
          doctorsService.listShifts(activeDoc.id),
          slotsService.list({ doctor_id: activeDoc.id, date: selectedDate, available_only: false }),
        ]);
        setShifts(shiftsData);
        setSlots(slotsData);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load clinical schedule.";
      addToast({ type: "error", title: "Error", message: msg });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, user?.email, selectedDate, addToast]);

  useEffect(() => {
    fetchDoctorData();
  }, [fetchDoctorData]);

  const handleToggleBlock = async (slotId: string, currentBlocked: boolean) => {
    try {
      const updated = await slotsService.blockToggle(slotId, !currentBlocked);
      setSlots((prev) =>
        prev.map((s) => (s.id === slotId ? { ...s, is_blocked: updated.is_blocked } : s))
      );
      addToast({
        type: "success",
        title: updated.is_blocked ? "Slot Blocked" : "Slot Unblocked",
        message: `Slot has been ${updated.is_blocked ? "blocked from" : "opened for"} patient booking.`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update slot status.";
      addToast({ type: "error", title: "Action Failed", message: msg });
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <HeartbeatLoader label="Loading doctor clinical schedule..." />
      </div>
    );
  }

  const doctorName = doctor ? doctor.full_name : `Dr. ${user?.first_name || ""} ${user?.last_name || ""}`;

  return (
    <div className="space-y-6">
      {/* Clinician Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy-900 dark:text-white">
            {doctorName}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {doctor?.specialization || "Clinical Consultant"} — {doctor?.department_name || "Specialty"} (Cabin: {doctor?.room_number || "OPD Cabin"})
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="teal" dot>
            Clinical Practice Active
          </Badge>
          <Button variant="outline" size="sm" onClick={fetchDoctorData} leftIcon={<RefreshCw className="h-3.5 w-3.5" />}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Shifts & Slot Management Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Recurring Shift Schedule */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-teal-600" />
                Weekly Shifts
              </CardTitle>
              <Badge variant="mint">{shifts.length} Active</Badge>
            </div>
            <CardDescription>
              Configured recurring shift blocks governing consultation slot generation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {shifts.map((shift) => (
              <div
                key={shift.id}
                className="p-3 rounded-xl border border-slate-200 dark:border-navy-800 bg-slate-50/50 dark:bg-navy-900/40 text-xs space-y-1"
              >
                <div className="flex items-center justify-between font-bold text-navy-900 dark:text-white">
                  <span>{DAY_NAMES[shift.day_of_week] || "Day"}</span>
                  <span className="text-teal-600 dark:text-teal-400">
                    {shift.start_time.slice(0, 5)} - {shift.end_time.slice(0, 5)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Slot Duration: {shift.slot_duration_minutes}m</span>
                  <span>Online: {shift.max_online_slots} | Walk-in: {shift.max_walkin_slots}</span>
                </div>
              </div>
            ))}
            {shifts.length === 0 && (
              <div className="py-8 text-center text-xs text-slate-400 border border-dashed rounded-xl">
                No recurring weekly shifts configured yet.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Calendar Consultation Slots for Selected Day */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-teal-600" />
                  Consultation Slots Roster
                </CardTitle>
                <CardDescription>
                  Review generated booking slots for the selected date or block emergency intervals.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-navy-900 dark:border-navy-800 dark:bg-navy-950 dark:text-white shadow-xs"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {slots.map((slot) => {
                const isBlocked = slot.is_blocked;
                const isBooked = slot.is_booked;

                let variantStyle = "border-slate-200 bg-white hover:border-teal-500 dark:border-navy-800 dark:bg-navy-900";
                if (isBlocked) {
                  variantStyle = "border-red-300 bg-red-50/50 dark:border-red-900/60 dark:bg-red-950/20";
                } else if (isBooked) {
                  variantStyle = "border-amber-300 bg-amber-50/50 dark:border-amber-900/60 dark:bg-amber-950/20";
                }

                return (
                  <div
                    key={slot.id}
                    className={`p-3 rounded-xl border transition-all text-xs flex flex-col justify-between gap-2 ${variantStyle}`}
                  >
                    <div>
                      <div className="font-bold text-navy-900 dark:text-white flex items-center justify-between">
                        <span>{slot.start_time.slice(0, 5)}</span>
                        <span className="text-[10px] text-slate-400">
                          {slot.end_time.slice(0, 5)}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-1">
                        <Badge
                          size="sm"
                          variant={
                            isBlocked
                              ? "error"
                              : isBooked
                              ? "warning"
                              : "teal"
                          }
                        >
                          {isBlocked ? "Blocked" : isBooked ? "Booked" : slot.slot_type}
                        </Badge>
                      </div>
                    </div>

                    {!isBooked && (
                      <button
                        type="button"
                        onClick={() => handleToggleBlock(slot.id, slot.is_blocked)}
                        className={`text-[11px] font-semibold flex items-center gap-1 pt-1.5 border-t border-slate-100 dark:border-navy-800 transition-colors ${
                          isBlocked
                            ? "text-teal-600 hover:text-teal-700 dark:text-teal-400"
                            : "text-red-600 hover:text-red-700 dark:text-red-400"
                        }`}
                      >
                        {isBlocked ? (
                          <>
                            <CheckCircle className="h-3 w-3" /> Unblock
                          </>
                        ) : (
                          <>
                            <Ban className="h-3 w-3" /> Block
                          </>
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {slots.length === 0 && (
              <div className="py-12 text-center text-xs text-slate-400 border border-dashed rounded-xl space-y-2">
                <p>No consultation slots generated for {selectedDate}.</p>
                <p className="text-[11px] text-slate-500">
                  Slots can be generated by hospital administration from the Slot Generation Engine tab.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
