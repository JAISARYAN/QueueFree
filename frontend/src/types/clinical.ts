export interface HospitalSettings {
  opd_start_time?: string;
  opd_end_time?: string;
  buffer_time_minutes?: number;
  grace_period_minutes?: number;
  walkin_ratio_percentage?: number;
  [key: string]: unknown;
}

export interface Hospital {
  id: string;
  name: string;
  code: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  contact_email: string;
  contact_phone: string;
  settings?: HospitalSettings;
  is_active: boolean;
  departments_count?: number;
  doctors_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Department {
  id: string;
  hospital: string;
  hospital_name?: string;
  name: string;
  code: string;
  floor_location?: string;
  description?: string;
  is_active: boolean;
  doctors_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface DoctorShift {
  id: string;
  doctor: string;
  day_of_week: number;
  day_of_week_display?: string;
  start_time: string;
  end_time: string;
  slot_duration_minutes: number;
  max_online_slots: number;
  max_walkin_slots: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Doctor {
  id: string;
  user: string;
  email: string;
  phone_number?: string;
  first_name: string;
  last_name: string;
  full_name: string;
  hospital: string;
  hospital_name?: string;
  department: string;
  department_name?: string;
  license_number: string;
  specialization: string;
  qualifications?: string;
  experience_years: number;
  bio?: string;
  room_number?: string;
  consultation_fee: string | number;
  default_consultation_minutes: number;
  max_daily_patients: number;
  is_available_for_teleconsult: boolean;
  is_active: boolean;
  shifts?: DoctorShift[];
  created_at?: string;
  updated_at?: string;
}

export type SlotType = "ONLINE" | "WALKIN_BUFFER" | "VIP_EMERGENCY";

export interface AppointmentSlot {
  id: string;
  doctor: string;
  doctor_name: string;
  specialization: string;
  department_name?: string;
  hospital: string;
  hospital_name: string;
  slot_date: string;
  start_time: string;
  end_time: string;
  slot_type: SlotType;
  is_booked: boolean;
  is_blocked: boolean;
  version: number;
  created_at?: string;
  updated_at?: string;
}

export interface SlotGenerationParams {
  doctor_id: string;
  start_date: string;
  end_date: string;
  replace_existing_unbooked?: boolean;
}

export interface SlotGenerationResponse {
  message: string;
  data: {
    slots_created: number;
    slots_skipped: number;
    dates_processed: number;
  };
}
