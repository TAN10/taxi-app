import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Car, 
  Users, 
  LogOut,
  Bell,
  Search,
  Settings as SettingsIcon,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X
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

const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'Trip Approved', message: 'Sarah Chen\'s trip to Tech Park has been approved.', time: '2 mins ago', type: 'success', read: false },
  { id: 2, title: 'Budget Alert', message: 'Monthly travel budget has reached 80%.', time: '1 hour ago', type: 'warning', read: false },
  { id: 3, title: 'New Employee', message: 'Elena Rodriguez was added to the Marketing team.', time: '3 hours ago', type: 'info', read: true },
];

const SidebarItem = ({ icon: Icon, label, to, active }: { icon: any, label: string, to: string, active: boolean }) => (
  <Link 
    to={to} 
    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 translate-x-1' 
        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
    }`}
  >
    <Icon size={20} />
    <span className="font-semibold">{label}</span>
  </Link>
);

const AppContent = () => {
  const location = useLocation();
  const notificationRef = useRef<HTMLDivElement>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

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
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!currentUser) {
    return <Login onLogin={setCurrentUser} />;
  }

  return (
    <div className={`flex min-h-screen ${settings.darkMode ? 'dark bg-slate-950' : 'bg-slate-50'}`}>
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 flex flex-col fixed h-full z-20 shadow-sm transition-colors duration-300">
        <div className="flex items-center space-x-3 px-2 mb-10">
           <div className="p-2 bg-blue-600 rounded-lg text-white">
             <Car size={20} />
           </div>
           <span className="font-bold text-lg text-slate-900 dark:text-white">TaxiManager</span>
        </div>
        
        <div className="space-y-2 flex-1">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/" active={location.pathname === '/'} />
          <SidebarItem icon={Car} label="Trip History" to="/trips" active={location.pathname === '/trips'} />
          <SidebarItem icon={Users} label="Employees" to="/employees" active={location.pathname === '/employees'} />
          <SidebarItem icon={SettingsIcon} label="Settings" to="/settings" active={location.pathname === '/settings'} />
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-3 mb-6 px-2">
            <img src={currentUser.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
            <div className="truncate">
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{currentUser.name}</p>
              <p className="text-[10px] text-slate-400 truncate uppercase tracking-tighter">{currentUser.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 px-4 py-3 rounded-xl w-full transition-all group font-semibold"
          >
            <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen relative transition-colors duration-300">
        <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-4">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              {location.pathname === '/' ? 'Overview' : location.pathname.substring(1)}
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
                    <button onClick={markAllRead} className="text-[10px] font-bold text-blue-600 uppercase hover:underline">Mark all as read</button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map(notif => (
                        <div key={notif.id} className={`p-4 border-b border-slate-50 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${!notif.read ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}>
                          <div className="flex items-start space-x-3">
                            <div className={`p-1.5 rounded-lg mt-0.5 ${
                              notif.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 
                              notif.type === 'warning' ? 'bg-amber-100 text-amber-600' : 
                              'bg-blue-100 text-blue-600'
                            }`}>
                              {notif.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{notif.title}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">{notif.message}</p>
                              <p className="text-[10px] text-slate-400 mt-2 font-medium">{notif.time}</p>
                            </div>
                            {!notif.read && <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5"></div>}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-slate-400">
                        <Bell size={32} className="mx-auto mb-2 opacity-20" />
                        <p className="text-sm font-medium">No new notifications</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>
            <p className="text-xs font-bold text-blue-600 dark:text-blue-400">{settings.companyName}</p>
          </div>
        </header>

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

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;