import { apiClient } from "./client";
import type {
  AppointmentSlot,
  Department,
  Doctor,
  DoctorShift,
  Hospital,
  SlotGenerationParams,
  SlotGenerationResponse,
} from "@/types";

export const hospitalsService = {
  async list(params?: { city?: string; search?: string }): Promise<Hospital[]> {
    const query = new URLSearchParams();
    if (params?.city) query.set("city", params.city);
    if (params?.search) query.set("search", params.search);
    const qs = query.toString() ? `?${query.toString()}` : "";
    return apiClient.get<Hospital[]>(`hospitals/${qs}`);
  },

  async get(id: string): Promise<Hospital> {
    return apiClient.get<Hospital>(`hospitals/${id}/`);
  },

  async create(data: Partial<Hospital>): Promise<Hospital> {
    return apiClient.post<Hospital>("hospitals/", data);
  },

  async update(id: string, data: Partial<Hospital>): Promise<Hospital> {
    return apiClient.patch<Hospital>(`hospitals/${id}/`, data);
  },
};

export const departmentsService = {
  async list(params?: { hospital_id?: string; search?: string }): Promise<Department[]> {
    const query = new URLSearchParams();
    if (params?.hospital_id) query.set("hospital_id", params.hospital_id);
    if (params?.search) query.set("search", params.search);
    const qs = query.toString() ? `?${query.toString()}` : "";
    return apiClient.get<Department[]>(`departments/${qs}`);
  },

  async get(id: string): Promise<Department> {
    return apiClient.get<Department>(`departments/${id}/`);
  },

  async create(data: Partial<Department>): Promise<Department> {
    return apiClient.post<Department>("departments/", data);
  },

  async update(id: string, data: Partial<Department>): Promise<Department> {
    return apiClient.patch<Department>(`departments/${id}/`, data);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`departments/${id}/`);
  },
};

export const doctorsService = {
  async list(params?: {
    hospital_id?: string;
    department_id?: string;
    search?: string;
  }): Promise<Doctor[]> {
    const query = new URLSearchParams();
    if (params?.hospital_id) query.set("hospital_id", params.hospital_id);
    if (params?.department_id) query.set("department_id", params.department_id);
    if (params?.search) query.set("search", params.search);
    const qs = query.toString() ? `?${query.toString()}` : "";
    return apiClient.get<Doctor[]>(`doctors/${qs}`);
  },

  async get(id: string): Promise<Doctor> {
    return apiClient.get<Doctor>(`doctors/${id}/`);
  },

  async create(data: {
    email: string;
    first_name: string;
    last_name: string;
    phone_number?: string;
    password?: string;
    hospital: string;
    department: string;
    license_number: string;
    specialization: string;
    qualifications?: string;
    experience_years?: number;
    bio?: string;
    room_number?: string;
    consultation_fee?: number;
    default_consultation_minutes?: number;
    max_daily_patients?: number;
    is_available_for_teleconsult?: boolean;
  }): Promise<Doctor> {
    return apiClient.post<Doctor>("doctors/", data);
  },

  async update(id: string, data: Partial<Doctor>): Promise<Doctor> {
    return apiClient.patch<Doctor>(`doctors/${id}/`, data);
  },

  async listShifts(doctorId: string): Promise<DoctorShift[]> {
    return apiClient.get<DoctorShift[]>(`doctors/${doctorId}/shifts/`);
  },

  async addShift(doctorId: string, data: Partial<DoctorShift>): Promise<DoctorShift> {
    return apiClient.post<DoctorShift>(`doctors/${doctorId}/shifts/`, data);
  },

  async updateShift(shiftId: string, data: Partial<DoctorShift>): Promise<DoctorShift> {
    return apiClient.patch<DoctorShift>(`doctors/shifts/${shiftId}/`, data);
  },

  async deleteShift(shiftId: string): Promise<void> {
    return apiClient.delete<void>(`doctors/shifts/${shiftId}/`);
  },
};

export const slotsService = {
  async list(params?: {
    doctor_id?: string;
    hospital_id?: string;
    date?: string;
    slot_type?: string;
    available_only?: boolean;
  }): Promise<AppointmentSlot[]> {
    const query = new URLSearchParams();
    if (params?.doctor_id) query.set("doctor_id", params.doctor_id);
    if (params?.hospital_id) query.set("hospital_id", params.hospital_id);
    if (params?.date) query.set("date", params.date);
    if (params?.slot_type) query.set("slot_type", params.slot_type);
    if (params?.available_only !== undefined) {
      query.set("available_only", String(params.available_only));
    }
    const qs = query.toString() ? `?${query.toString()}` : "";
    return apiClient.get<AppointmentSlot[]>(`appointments/slots/${qs}`);
  },

  async generate(data: SlotGenerationParams): Promise<SlotGenerationResponse> {
    return apiClient.post<SlotGenerationResponse>("appointments/slots/generate/", data);
  },

  async blockToggle(slotId: string, isBlocked: boolean): Promise<AppointmentSlot> {
    return apiClient.patch<AppointmentSlot>(`appointments/slots/${slotId}/block/`, {
      is_blocked: isBlocked,
    });
  },
};
