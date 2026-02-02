export const BOOKING_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
} as const;

export type BookingStatus = (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS];

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

export interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
  remainingCapacity: number;
}

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

export interface BookingNote {
  id: string;
  bookingId: string;
  content: string;
  createdAt: Date;
}

export interface AdminUser {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  token: string;
  admin: AdminUser;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DashboardStats {
  todayBookings: number;
  weekBookings: number;
  monthBookings: number;
  cancelledThisWeek: number;
  pendingBookings: number;
  recentBookings: Booking[];
}

export interface AvailabilityRule {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotStepMin: number;
  capacity: number;
}

export interface AvailabilityException {
  id: string;
  date: Date;
  isClosed: boolean;
  customStartTime: string | null;
  customEndTime: string | null;
}
