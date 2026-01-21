
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Car, 
  Users, 
  PlusCircle, 
  LogOut,
  Bell,
  Search,
  Settings as SettingsIcon,
  ShieldCheck
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Trips from './pages/Trips';
import Employees from './pages/Employees';
import Settings from './pages/Settings';
import Login from './pages/Login';
import { Employee, Trip, User, AppSettings } from './types';

const INITIAL_EMPLOYEES: Employee[] = [
  { id: '1', name: 'Sarah Chen', department: 'Sales', email: 'sarah.c@company.com', avatar: 'https://picsum.photos/seed/sarah/100/100' },
  { id: '2', name: 'James Wilson', department: 'Engineering', email: 'james.w@company.com', avatar: 'https://picsum.photos/seed/james/100/100' },
  { id: '3', name: 'Elena Rodriguez', department: 'Marketing', email: 'elena.r@company.com', avatar: 'https://picsum.photos/seed/elena/100/100' },
];

const INITIAL_TRIPS: Trip[] = [
  { id: '101', employeeId: '1', date: '2023-10-24', time: '09:00', pickup: 'Downtown Office', dropoff: 'Client HQ - Tech Park', amount: 32.50, currency: 'USD', status: 'Approved', purpose: 'Q4 Strategy Meeting', category: 'Client Meeting' },
  { id: '102', employeeId: '2', date: '2023-10-24', time: '18:30', pickup: 'Office', dropoff: 'Central Station', amount: 15.00, currency: 'USD', status: 'Pending', purpose: 'Evening Commute', category: 'Office Commute' },
  { id: '103', employeeId: '3', date: '2023-10-25', time: '11:15', pickup: 'Airport Terminal 2', dropoff: 'Main Office', amount: 45.00, currency: 'USD', status: 'Approved', purpose: 'Return from Conference', category: 'Event' },
];

const DEFAULT_SETTINGS: AppSettings = {
  currency: 'USD',
  autoAI: true,
  darkMode: false,
  companyName: 'Acme Corp',
  monthlyBudget: 5000
};

const SidebarItem = ({ icon: Icon, label, to, active }: { icon: any, label: string, to: string, active: boolean }) => (
  <Link 
    to={to} 
    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
      active 
        ? 'bg-blue-600 text-white shadow-md' 
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </Link>
);

const Navbar = ({ user }: { user: User }) => (
  <header className="h-16 border-b border-slate-200 bg-white px-8 flex items-center justify-between sticky top-0 z-10">
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <div className="bg-blue-600 p-1.5 rounded-lg shadow-blue-200 shadow-md">
           <Car className="text-white" size={20} />
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          TaxiManager Pro
        </h1>
      </div>
      <div className="hidden lg:flex relative ml-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Search records..." 
          className="pl-10 pr-4 py-2 border border-slate-200 rounded-full bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 text-sm"
        />
      </div>
    </div>
    <div className="flex items-center space-x-5">
      <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
        <Bell size={20} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
      </button>
      <div className="flex items-center space-x-3 pl-5 border-l border-slate-200">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold">{user.name}</p>
          <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">{user.role}</p>
        </div>
        <img 
          src={user.avatar} 
          alt="Avatar" 
          className="w-10 h-10 rounded-full ring-2 ring-slate-100 object-cover"
        />
      </div>
    </div>
  </header>
);

const AppContent = () => {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('tm_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('tm_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('tm_employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [trips, setTrips] = useState<Trip[]>(() => {
    const saved = localStorage.getItem('tm_trips');
    return saved ? JSON.parse(saved) : INITIAL_TRIPS;
  });

  useEffect(() => {
    if (currentUser) localStorage.setItem('tm_user', JSON.stringify(currentUser));
    else localStorage.removeItem('tm_user');
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('tm_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('tm_employees', JSON.stringify(employees));
    localStorage.setItem('tm_trips', JSON.stringify(trips));
  }, [employees, trips]);

  const addTrip = (trip: Trip) => setTrips([trip, ...trips]);
  const updateTripStatus = (id: string, status: Trip['status']) => {
    setTrips(trips.map(t => t.id === id ? { ...t, status } : t));
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to sign out?')) {
      setCurrentUser(null);
    }
  };

  if (!currentUser) {
    return <Login onLogin={setCurrentUser} />;
  }

  return (
    <div className={`flex min-h-screen bg-slate-50 ${settings.darkMode ? 'dark-mode-sim' : ''}`}>
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col fixed h-full">
        <div className="flex items-center space-x-2 px-2 mb-6">
           <ShieldCheck className="text-blue-600" size={24} />
           <span className="font-bold text-slate-900">Admin Control</span>
        </div>
        
        <div className="space-y-2 flex-1 mt-4">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/" active={location.pathname === '/'} />
          <SidebarItem icon={Car} label="Trip History" to="/trips" active={location.pathname === '/trips'} />
          <SidebarItem icon={Users} label="Employees" to="/employees" active={location.pathname === '/employees'} />
          <SidebarItem icon={SettingsIcon} label="Settings" to="/settings" active={location.pathname === '/settings'} />
        </div>

        <div className="pt-6 border-t border-slate-200">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 text-slate-500 hover:text-red-500 hover:bg-red-50 px-4 py-3 rounded-lg w-full transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        <Navbar user={currentUser} />
        <div className="p-8">
          <Routes>
            <Route path="/" element={<Dashboard trips={trips} employees={employees} settings={settings} />} />
            <Route path="/trips" element={<Trips trips={trips} employees={employees} onAddTrip={addTrip} onUpdateStatus={updateTripStatus} />} />
            <Route path="/employees" element={<Employees employees={employees} setEmployees={setEmployees} />} />
            <Route path="/settings" element={
              <Settings 
                settings={settings} 
                setSettings={setSettings} 
                currentUser={currentUser} 
                setCurrentUser={setCurrentUser} 
              />
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
