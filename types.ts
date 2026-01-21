
export type TripStatus = 'Pending' | 'Approved' | 'Rejected';
export type TripCategory = 'Client Meeting' | 'Office Commute' | 'Event' | 'Other';

export interface Employee {
  id: string;
  name: string;
  department: string;
  email: string;
  avatar?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

export interface AppSettings {
  currency: 'USD' | 'EUR' | 'GBP';
  autoAI: boolean;
  darkMode: boolean;
  companyName: string;
  monthlyBudget: number;
}

export interface Trip {
  id: string;
  employeeId: string;
  date: string;
  time: string;
  pickup: string;
  dropoff: string;
  amount: number;
  currency: string;
  status: TripStatus;
  purpose: string;
  category: TripCategory;
}

export interface DashboardStats {
  totalSpend: number;
  totalTrips: number;
  pendingCount: number;
  spendByDepartment: { name: string; value: number }[];
  tripsByDay: { date: string; count: number }[];
}
