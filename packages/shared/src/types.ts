// ==========================================
// BookEasy Shared Types
// ==========================================

// Booking Status
export const BOOKING_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
} as const;

export type BookingStatus = (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS];

// Days of Week
export const DAYS_OF_WEEK = {
  MONDAY: 0,
  TUESDAY: 1,
  WEDNESDAY: 2,
  THURSDAY: 3,
  FRIDAY: 4,
  SATURDAY: 5,
  SUNDAY: 6,
} as const;

export type DayOfWeek = (typeof DAYS_OF_WEEK)[keyof typeof DAYS_OF_WEEK];

// ==========================================
// Service Types
// ==========================================

export interface Service {
  id: string;
  name: string;
  durationMin: number;
  priceCents: number;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceCreateInput {
  name: string;
  durationMin: number;
  priceCents: number;
  description?: string;
  isActive?: boolean;
}

export interface ServiceUpdateInput {
  name?: string;
  durationMin?: number;
  priceCents?: number;
  description?: string;
  isActive?: boolean;
}

// ==========================================
// Availability Types
// ==========================================

export interface AvailabilityRule {
  id: string;
  dayOfWeek: number;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  slotStepMin: number;
  capacity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AvailabilityRuleCreateInput {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotStepMin?: number;
  capacity?: number;
}

export interface AvailabilityRuleUpdateInput {
  dayOfWeek?: number;
  startTime?: string;
  endTime?: string;
  slotStepMin?: number;
  capacity?: number;
}

export interface AvailabilityException {
  id: string;
  date: Date;
  isClosed: boolean;
  customStartTime: string | null;
  customEndTime: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AvailabilityExceptionCreateInput {
  date: string; // ISO date string
  isClosed?: boolean;
  customStartTime?: string;
  customEndTime?: string;
}

export interface AvailabilityExceptionUpdateInput {
  date?: string;
  isClosed?: boolean;
  customStartTime?: string;
  customEndTime?: string;
}

// Slot for availability response
export interface TimeSlot {
  startTime: string; // ISO datetime
  endTime: string; // ISO datetime
  available: boolean;
  remainingCapacity: number;
}

// ==========================================
// Booking Types
// ==========================================

export interface Booking {
  id: string;
  serviceId: string;
  service?: Service;
  startAt: Date;
  endAt: Date;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  customerNote: string | null;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
  notes?: BookingNote[];
}

export interface BookingCreateInput {
  serviceId: string;
  startAt: string; // ISO datetime
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerNote?: string;
}

export interface BookingUpdateInput {
  status?: BookingStatus;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerNote?: string;
}

export interface BookingNote {
  id: string;
  bookingId: string;
  content: string;
  createdAt: Date;
}

export interface BookingNoteCreateInput {
  content: string;
}

// ==========================================
// Admin Types
// ==========================================

export interface AdminUser {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  admin: AdminUser;
}

// ==========================================
// API Response Types
// ==========================================

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BookingFilters {
  status?: BookingStatus;
  serviceId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface DashboardStats {
  todayBookings: number;
  weekBookings: number;
  monthBookings: number;
  cancelledThisWeek: number;
  pendingBookings: number;
  recentBookings: Booking[];
}

// ==========================================
// API Error Types
// ==========================================

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, string[]>;
}
