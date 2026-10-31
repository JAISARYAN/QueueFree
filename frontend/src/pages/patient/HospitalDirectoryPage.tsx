import React, { useCallback, useEffect, useState } from "react";
import {
  MapPin,
  Search,
  Phone,
  Mail,
  ShieldCheck,
} from "lucide-react";
import {
  departmentsService,
  doctorsService,
  hospitalsService,
} from "@/services/api/clinical";
import type { Department, Doctor, Hospital } from "@/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { HeartbeatLoader } from "@/components/ui/loading";

export const HospitalDirectoryPage: React.FC = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadHospitals = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await hospitalsService.list({
        search: searchQuery.trim(),
        city: cityFilter.trim(),
      });
      setHospitals(data);
      if (data.length > 0 && !selectedHospital) {
        setSelectedHospital(data[0]);
      }
    } catch {
      // Graceful fallback
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, cityFilter, selectedHospital]);

  useEffect(() => {
    loadHospitals();
  }, [loadHospitals]);

  useEffect(() => {
    if (selectedHospital) {
      departmentsService
        .list({ hospital_id: selectedHospital.id })
        .then(setDepartments);
      doctorsService
        .list({ hospital_id: selectedHospital.id })
        .then(setDoctors);
    }
  }, [selectedHospital]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy-900 dark:text-white">
            Hospital & Facility Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Discover accredited partner hospitals, outpatient specialties, and available clinicians.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search hospitals by name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
        <div className="w-full sm:w-64">
          <Input
            placeholder="Filter by city (e.g. New Delhi)"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            leftIcon={<MapPin className="h-4 w-4" />}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="py-24 flex items-center justify-center">
          <HeartbeatLoader label="Loading accredited healthcare facilities..." />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Hospital List */}
          <div className="space-y-3 lg:col-span-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Partner Hospitals ({hospitals.length})
            </h2>
            {hospitals.map((hosp) => {
              const isSelected = selectedHospital?.id === hosp.id;
              return (
                <div
                  key={hosp.id}
                  onClick={() => setSelectedHospital(hosp)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "border-teal-500 bg-teal-50/40 dark:bg-teal-950/20 shadow-xs"
                      : "border-slate-200 bg-white hover:border-slate-300 dark:border-navy-800 dark:bg-navy-900"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-navy-900 dark:text-white">
                      {hosp.name}
                    </span>
                    <Badge variant={isSelected ? "teal" : "outline"} size="sm">
                      {hosp.code}
                    </Badge>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                    <span>
                      {hosp.city}, {hosp.state}
                    </span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-navy-800 flex justify-between text-[11px] text-slate-400">
                    <span>{hosp.departments_count ?? 0} Departments</span>
                    <span>{hosp.doctors_count ?? 0} Doctors</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Hospital Details & Departments */}
          <div className="lg:col-span-2 space-y-6">
            {selectedHospital ? (
              <>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="teal">{selectedHospital.code}</Badge>
                      <div className="flex items-center gap-1.5 text-xs text-teal-600 dark:text-teal-400 font-medium">
                        <ShieldCheck className="h-4 w-4" />
                        <span>QueueFree Verified Facility</span>
                      </div>
                    </div>
                    <CardTitle className="text-xl mt-2">{selectedHospital.name}</CardTitle>
                    <CardDescription>
                      {selectedHospital.address_line1}, {selectedHospital.city}, {selectedHospital.state} - {selectedHospital.postal_code}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 flex flex-wrap gap-4 text-xs text-slate-500 border-t border-slate-100 dark:border-navy-800 py-3">
                    <span className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5 text-teal-600" />
                      {selectedHospital.contact_phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5 text-teal-600" />
                      {selectedHospital.contact_email}
                    </span>
                  </CardContent>
                </Card>

                {/* Specialties & Doctors */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Clinical Specialties ({departments.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {departments.map((dept) => (
                      <div
                        key={dept.id}
                        className="p-3 rounded-xl border border-slate-200 bg-white dark:border-navy-800 dark:bg-navy-900 text-xs"
                      >
                        <div className="font-bold text-navy-900 dark:text-white flex justify-between">
                          <span>{dept.name}</span>
                          <span className="text-teal-600 font-mono">{dept.code}</span>
                        </div>
                        <p className="mt-1 text-[11px] text-slate-400">
                          {dept.floor_location || "OPD Wing"}
                        </p>
                      </div>
                    ))}
                  </div>

                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pt-2">
                    Consultant Doctors ({doctors.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {doctors.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-3 rounded-xl border border-slate-200 bg-white dark:border-navy-800 dark:bg-navy-900 text-xs space-y-1.5"
                      >
                        <div className="font-bold text-navy-900 dark:text-white">
                          {doc.full_name}
                        </div>
                        <p className="text-teal-600 text-[11px] font-medium">
                          {doc.specialization} ({doc.department_name})
                        </p>
                        <div className="flex justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100 dark:border-navy-800">
                          <span>Fee: ₹{doc.consultation_fee}</span>
                          <span>Room: {doc.room_number || "OPD Cabin"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="py-24 text-center text-slate-400 text-xs">
                Select a hospital from the list to view departments and doctors.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
