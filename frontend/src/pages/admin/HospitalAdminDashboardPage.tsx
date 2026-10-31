import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import {
  departmentsService,
  doctorsService,
  hospitalsService,
  slotsService,
} from "@/services/api/clinical";
import type {
  Department,
  Doctor,
  Hospital,
} from "@/types";
import {
  Stethoscope,
  Calendar,
  Settings,
  Plus,
  RefreshCw,
  CheckCircle2,
  Layers,
  Sparkles,
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
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { HeartbeatLoader } from "@/components/ui/loading";

export const HospitalAdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState<"departments" | "doctors" | "slots" | "settings">("departments");
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Department modal state
  const [deptModalOpen, setDeptModalOpen] = useState(false);
  const [deptName, setDeptName] = useState("");
  const [deptCode, setDeptCode] = useState("");
  const [deptFloor, setDeptFloor] = useState("");
  const [deptDesc, setDeptDesc] = useState("");
  const [isSubmittingDept, setIsSubmittingDept] = useState(false);

  // Doctor onboard modal state
  const [doctorModalOpen, setDoctorModalOpen] = useState(false);
  const [docFirstName, setDocFirstName] = useState("");
  const [docLastName, setDocLastName] = useState("");
  const [docEmail, setDocEmail] = useState("");
  const [docPhone, setDocPhone] = useState("");
  const [docDeptId, setDocDeptId] = useState("");
  const [docLicense, setDocLicense] = useState("");
  const [docSpecialization, setDocSpecialization] = useState("");
  const [docRoom, setDocRoom] = useState("");
  const [docFee, setDocFee] = useState("1000");
  const [isSubmittingDoc, setIsSubmittingDoc] = useState(false);

  // Slot generator state
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [slotStartDate, setSlotStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [slotEndDate, setSlotEndDate] = useState(
    new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [isGeneratingSlots, setIsGeneratingSlots] = useState(false);
  const [generationSummary, setGenerationSummary] = useState<string | null>(null);

  const fetchHospitalData = useCallback(async () => {
    setIsLoading(true);
    try {
      const hospitalList = await hospitalsService.list();
      let activeHosp: Hospital | null = null;

      if (user?.hospital_id) {
        activeHosp = hospitalList.find((h) => h.id === user.hospital_id) || hospitalList[0] || null;
      } else {
        activeHosp = hospitalList[0] || null;
      }

      setHospital(activeHosp);

      if (activeHosp) {
        const [deptsData, docsData] = await Promise.all([
          departmentsService.list({ hospital_id: activeHosp.id }),
          doctorsService.list({ hospital_id: activeHosp.id }),
        ]);
        setDepartments(deptsData);
        setDoctors(docsData);
        if (docsData.length > 0 && !selectedDoctorId) {
          setSelectedDoctorId(docsData[0].id);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load facility data.";
      addToast({ type: "error", title: "Error Loading Data", message: msg });
    } finally {
      setIsLoading(false);
    }
  }, [user?.hospital_id, selectedDoctorId, addToast]);

  useEffect(() => {
    fetchHospitalData();
  }, [fetchHospitalData]);

  const handleCreateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hospital) return;

    setIsSubmittingDept(true);
    try {
      await departmentsService.create({
        hospital: hospital.id,
        name: deptName.trim(),
        code: deptCode.trim().toUpperCase(),
        floor_location: deptFloor.trim(),
        description: deptDesc.trim(),
      });

      addToast({
        type: "success",
        title: "Department Added",
        message: `${deptName} (${deptCode}) has been registered in ${hospital.name}.`,
      });

      setDeptModalOpen(false);
      setDeptName("");
      setDeptCode("");
      setDeptFloor("");
      setDeptDesc("");

      // Refresh roster
      const updatedDepts = await departmentsService.list({ hospital_id: hospital.id });
      setDepartments(updatedDepts);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create department.";
      addToast({ type: "error", title: "Creation Failed", message: msg });
    } finally {
      setIsSubmittingDept(false);
    }
  };

  const handleOnboardDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hospital) return;

    setIsSubmittingDoc(true);
    try {
      await doctorsService.create({
        first_name: docFirstName.trim(),
        last_name: docLastName.trim(),
        email: docEmail.trim().toLowerCase(),
        phone_number: docPhone.trim(),
        hospital: hospital.id,
        department: docDeptId,
        license_number: docLicense.trim().toUpperCase(),
        specialization: docSpecialization.trim(),
        room_number: docRoom.trim(),
        consultation_fee: parseFloat(docFee) || 0,
      });

      addToast({
        type: "success",
        title: "Doctor Onboarded",
        message: `Dr. ${docFirstName} ${docLastName} has been provisioned.`,
      });

      setDoctorModalOpen(false);
      setDocFirstName("");
      setDocLastName("");
      setDocEmail("");
      setDocPhone("");
      setDocDeptId("");
      setDocLicense("");
      setDocSpecialization("");
      setDocRoom("");

      // Refresh doctor roster
      const updatedDocs = await doctorsService.list({ hospital_id: hospital.id });
      setDoctors(updatedDocs);
      if (!selectedDoctorId && updatedDocs.length > 0) {
        setSelectedDoctorId(updatedDocs[0].id);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to onboard doctor.";
      addToast({ type: "error", title: "Onboarding Failed", message: msg });
    } finally {
      setIsSubmittingDoc(false);
    }
  };

  const handleGenerateSlots = async () => {
    if (!selectedDoctorId) {
      addToast({ type: "warning", title: "Select Doctor", message: "Please select a clinician first." });
      return;
    }

    setIsGeneratingSlots(true);
    setGenerationSummary(null);

    try {
      const res = await slotsService.generate({
        doctor_id: selectedDoctorId,
        start_date: slotStartDate,
        end_date: slotEndDate,
        replace_existing_unbooked: false,
      });

      setGenerationSummary(res.message);
      addToast({
        type: "success",
        title: "Slots Generated",
        message: res.message,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to generate slots.";
      addToast({ type: "error", title: "Slot Generation Failed", message: msg });
    } finally {
      setIsGeneratingSlots(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <HeartbeatLoader label="Loading facility clinical roster..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy-900 dark:text-white">
            Hospital Operations & Clinical Roster
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {hospital?.name || "Healthcare Facility"} ({hospital?.code || "HQ"}) — Facility Administration & Capacity Planning
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="teal" dot>
            Tenant Operational
          </Badge>
          <Button variant="outline" size="sm" onClick={fetchHospitalData} leftIcon={<RefreshCw className="h-3.5 w-3.5" />}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Facility Quick Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:border-teal-500 transition-colors">
          <CardContent className="pt-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Active Departments
            </span>
            <div className="mt-2 text-3xl font-extrabold text-navy-900 dark:text-white">
              {departments.length}
            </div>
            <p className="mt-1 text-xs text-teal-600 dark:text-teal-400 font-medium">
              Registered clinical specialties
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-teal-500 transition-colors">
          <CardContent className="pt-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Affiliated Doctors
            </span>
            <div className="mt-2 text-3xl font-extrabold text-navy-900 dark:text-white">
              {doctors.length}
            </div>
            <p className="mt-1 text-xs text-slate-500 font-medium">
              Active practicing clinicians
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-teal-500 transition-colors">
          <CardContent className="pt-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Facility Location
            </span>
            <div className="mt-2 text-xl font-bold text-navy-900 dark:text-white truncate">
              {hospital?.city || "New Delhi"}, {hospital?.state || "Delhi"}
            </div>
            <p className="mt-1 text-xs text-slate-500 font-medium">
              PIN: {hospital?.postal_code || "110001"}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-teal-500 transition-colors">
          <CardContent className="pt-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              OPD Timings & Buffer
            </span>
            <div className="mt-2 text-xl font-bold text-navy-900 dark:text-white">
              08:00 — 20:00
            </div>
            <p className="mt-1 text-xs text-teal-600 dark:text-teal-400 font-medium">
              15m default consultation slot
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 dark:border-navy-800 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("departments")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeTab === "departments"
              ? "border-teal-600 text-teal-700 dark:text-teal-400 dark:border-teal-400"
              : "border-transparent text-slate-500 hover:text-navy-900 dark:hover:text-slate-300"
          }`}
        >
          <Layers className="h-4 w-4" />
          Clinical Departments ({departments.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("doctors")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeTab === "doctors"
              ? "border-teal-600 text-teal-700 dark:text-teal-400 dark:border-teal-400"
              : "border-transparent text-slate-500 hover:text-navy-900 dark:hover:text-slate-300"
          }`}
        >
          <Stethoscope className="h-4 w-4" />
          Doctor Registry ({doctors.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("slots")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeTab === "slots"
              ? "border-teal-600 text-teal-700 dark:text-teal-400 dark:border-teal-400"
              : "border-transparent text-slate-500 hover:text-navy-900 dark:hover:text-slate-300"
          }`}
        >
          <Calendar className="h-4 w-4" />
          Slot Generation Engine
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("settings")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeTab === "settings"
              ? "border-teal-600 text-teal-700 dark:text-teal-400 dark:border-teal-400"
              : "border-transparent text-slate-500 hover:text-navy-900 dark:hover:text-slate-300"
          }`}
        >
          <Settings className="h-4 w-4" />
          Facility Parameters
        </button>
      </div>

      {/* Tab 1: Departments Roster */}
      {activeTab === "departments" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Manage clinical specialties, ward locations, and queue prefixes for {hospital?.name}.
            </p>
            <Button
              variant="teal"
              size="sm"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setDeptModalOpen(true)}
            >
              Add Department
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((dept) => (
              <Card key={dept.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="teal">{dept.code}</Badge>
                    <span className="text-[11px] text-slate-400">
                      {dept.floor_location || "Main OPD"}
                    </span>
                  </div>
                  <CardTitle className="mt-2 text-base">{dept.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {dept.description || "General outpatient consultations and diagnostics."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 border-t border-slate-100 dark:border-navy-800 flex justify-between items-center text-xs text-slate-500 py-3">
                  <span>Doctors: {dept.doctors_count ?? 0}</span>
                  <Badge size="sm" variant={dept.is_active ? "success" : "warning"}>
                    {dept.is_active ? "Active" : "Inactive"}
                  </Badge>
                </CardContent>
              </Card>
            ))}
            {departments.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-400 text-xs border-2 border-dashed border-slate-200 dark:border-navy-800 rounded-xl">
                No clinical departments registered yet. Click &quot;Add Department&quot; above to configure your first specialty.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Doctors Registry */}
      {activeTab === "doctors" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Onboard clinicians, assign departmental specializations, and manage OPD cabins.
            </p>
            <Button
              variant="teal"
              size="sm"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => {
                if (departments.length === 0) {
                  addToast({
                    type: "warning",
                    title: "Department Required",
                    message: "Please create at least one clinical department before onboarding doctors.",
                  });
                  return;
                }
                setDocDeptId(departments[0].id);
                setDoctorModalOpen(true);
              }}
            >
              Onboard Doctor
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {doctors.map((doc) => (
              <Card key={doc.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="primary">{doc.department_name || "Specialty"}</Badge>
                    <span className="text-[11px] font-mono text-slate-400">
                      Lic: {doc.license_number}
                    </span>
                  </div>
                  <CardTitle className="mt-2 text-base">{doc.full_name}</CardTitle>
                  <CardDescription className="text-teal-600 dark:text-teal-400 font-medium">
                    {doc.specialization}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-xs text-slate-500 pt-0">
                  <div className="flex justify-between py-1 border-t border-slate-100 dark:border-navy-800">
                    <span>Cabin / Room:</span>
                    <span className="font-semibold text-navy-900 dark:text-white">
                      {doc.room_number || "OPD Cabin"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-t border-slate-100 dark:border-navy-800">
                    <span>Consultation Fee:</span>
                    <span className="font-semibold text-navy-900 dark:text-white">
                      ₹{doc.consultation_fee}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-t border-slate-100 dark:border-navy-800">
                    <span>Slot Duration:</span>
                    <span>{doc.default_consultation_minutes} mins</span>
                  </div>
                </CardContent>
              </Card>
            ))}
            {doctors.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-400 text-xs border-2 border-dashed border-slate-200 dark:border-navy-800 rounded-xl">
                No doctors registered yet. Click &quot;Onboard Doctor&quot; to provision clinician credentials and profiles.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Slot Generation Console */}
      {activeTab === "slots" && (
        <Card className="max-w-3xl">
          <CardHeader>
            <CardTitle>Batch Consultation Slot Generator</CardTitle>
            <CardDescription>
              Generates individual bookable appointment slots based on the doctor&apos;s active weekly shift schedule.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Select Clinician
              </label>
              <select
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-navy-900 dark:border-navy-800 dark:bg-navy-950 dark:text-white"
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
              >
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.full_name} — {d.specialization} ({d.department_name})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Generation Start Date"
                type="date"
                value={slotStartDate}
                onChange={(e) => setSlotStartDate(e.target.value)}
                required
              />
              <Input
                label="Generation End Date"
                type="date"
                value={slotEndDate}
                onChange={(e) => setSlotEndDate(e.target.value)}
                required
              />
            </div>

            {generationSummary && (
              <div className="p-3 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 rounded-xl flex items-center gap-2 text-xs text-teal-800 dark:text-teal-200">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-600" />
                <span>{generationSummary}</span>
              </div>
            )}

            <Button
              variant="teal"
              className="w-full mt-2"
              isLoading={isGeneratingSlots}
              onClick={handleGenerateSlots}
              leftIcon={<Sparkles className="h-4 w-4" />}
            >
              Generate Atomic Consultation Slots
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Tab 4: Facility Configuration */}
      {activeTab === "settings" && (
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Operational Buffer & Rules</CardTitle>
            <CardDescription>
              Configure facility OPD hours, patient queue thresholds, and walk-in interleaving policies.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="OPD Start Time" defaultValue="08:00" />
              <Input label="OPD End Time" defaultValue="20:00" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Buffer Delay (Minutes)" defaultValue="10" helperText="Extra safety buffer per shift" />
              <Input label="Grace Period (Minutes)" defaultValue="15" helperText="Threshold before marking No-Show" />
            </div>
            <div className="pt-2">
              <Button variant="teal" size="sm">
                Save Facility Parameters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Department Modal */}
      <Modal
        isOpen={deptModalOpen}
        onClose={() => setDeptModalOpen(false)}
        title="Add Clinical Department"
        description="Register a specialty unit within this hospital facility."
      >
        <form onSubmit={handleCreateDepartment} className="space-y-4">
          <Input
            label="Department Name"
            placeholder="e.g. Cardiology"
            value={deptName}
            onChange={(e) => setDeptName(e.target.value)}
            required
          />
          <Input
            label="Department Code / Token Prefix"
            placeholder="e.g. CARD"
            value={deptCode}
            onChange={(e) => setDeptCode(e.target.value)}
            helperText="Uppercase alphanumeric token prefix (2-5 letters)."
            required
          />
          <Input
            label="Floor Location / Wing"
            placeholder="e.g. Tower A, 2nd Floor"
            value={deptFloor}
            onChange={(e) => setDeptFloor(e.target.value)}
          />
          <Input
            label="Specialty Description"
            placeholder="Overview of clinical services..."
            value={deptDesc}
            onChange={(e) => setDeptDesc(e.target.value)}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setDeptModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="teal" isLoading={isSubmittingDept}>
              Register Department
            </Button>
          </div>
        </form>
      </Modal>

      {/* Onboard Doctor Modal */}
      <Modal
        isOpen={doctorModalOpen}
        onClose={() => setDoctorModalOpen(false)}
        title="Onboard Doctor Clinician"
        description="Provisions clinician login credentials and binds their profile to this facility."
      >
        <form onSubmit={handleOnboardDoctor} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First Name"
              placeholder="e.g. Rajesh"
              value={docFirstName}
              onChange={(e) => setDocFirstName(e.target.value)}
              required
            />
            <Input
              label="Last Name"
              placeholder="e.g. Sharma"
              value={docLastName}
              onChange={(e) => setDocLastName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Work Email"
              type="email"
              placeholder="dr.sharma@hospital.org"
              value={docEmail}
              onChange={(e) => setDocEmail(e.target.value)}
              required
            />
            <Input
              label="Mobile Phone"
              placeholder="+91 98765 43210"
              value={docPhone}
              onChange={(e) => setDocPhone(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Department Specialty
            </label>
            <select
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-navy-900 dark:border-navy-800 dark:bg-navy-950 dark:text-white"
              value={docDeptId}
              onChange={(e) => setDocDeptId(e.target.value)}
              required
            >
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.code})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Medical License Number"
              placeholder="e.g. MCI-2015-8849"
              value={docLicense}
              onChange={(e) => setDocLicense(e.target.value)}
              required
            />
            <Input
              label="Specialization Title"
              placeholder="e.g. Interventional Cardiologist"
              value={docSpecialization}
              onChange={(e) => setDocSpecialization(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Cabin / Room Number"
              placeholder="e.g. Room 204"
              value={docRoom}
              onChange={(e) => setDocRoom(e.target.value)}
            />
            <Input
              label="Consultation Fee (₹)"
              type="number"
              value={docFee}
              onChange={(e) => setDocFee(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setDoctorModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="teal" isLoading={isSubmittingDoc}>
              Onboard Doctor
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
