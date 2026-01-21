import React, { useState } from 'react';
import { 
  Plus, 
  Filter, 
  MoreVertical, 
  MapPin, 
  Clock, 
  Check,
  X,
  Sparkles,
  Search,
  Car
} from 'lucide-react';
import { Trip, Employee, TripCategory, TripStatus } from '../types';
import { suggestTripDetails } from '../services/gemini';

interface TripsProps {
  trips: Trip[];
  employees: Employee[];
  onAddTrip: (trip: Trip) => void;
  onUpdateStatus: (id: string, status: TripStatus) => void;
}

const Trips: React.FC<TripsProps> = ({ trips, employees, onAddTrip, onUpdateStatus }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [newTrip, setNewTrip] = useState({
    employeeId: employees[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    pickup: '',
    dropoff: '',
    amount: 0,
    purpose: '',
    category: 'Client Meeting' as TripCategory
  });

  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTrips = trips.filter(trip => {
    const matchesStatus = filterStatus === 'All' || trip.status === filterStatus;
    const emp = employees.find(e => e.id === trip.employeeId);
    const matchesSearch = 
      emp?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      trip.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trip: Trip = {
      ...newTrip,
      id: Math.random().toString(36).substr(2, 9),
      currency: 'USD',
      status: 'Pending'
    };
    onAddTrip(trip);
    setIsModalOpen(false);
    setNewTrip({
      employeeId: employees[0]?.id || '',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      pickup: '',
      dropoff: '',
      amount: 0,
      purpose: '',
      category: 'Client Meeting'
    });
  };

  const handleAISuggest = async () => {
    if (!newTrip.pickup || !newTrip.dropoff) {
      alert("Please enter pickup and dropoff locations first.");
      return;
    }
    setIsSuggesting(true);
    const suggestion = await suggestTripDetails(newTrip.pickup, newTrip.dropoff);
    if (suggestion) {
      setNewTrip(prev => ({
        ...prev,
        purpose: suggestion.purpose,
        category: suggestion.category as TripCategory
      }));
    }
    setIsSuggesting(false);
  };

  const StatusBadge = ({ status }: { status: TripStatus }) => {
    const styles = {
      'Pending': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      'Approved': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      'Rejected': 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Trip History</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 font-semibold"
        >
          <Plus size={20} />
          <span>Log New Trip</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors duration-300">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select 
                className="pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search history..." 
                className="pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 sm:w-64 transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
            Displaying <span className="text-slate-900 dark:text-white font-bold">{filteredTrips.length}</span> Records
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 dark:bg-slate-800/30">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Details</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Route</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTrips.map(trip => {
                const emp = employees.find(e => e.id === trip.employeeId);
                return (
                  <tr key={trip.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img src={emp?.avatar} className="w-9 h-9 rounded-full shadow-sm" alt="" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{emp?.name}</p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">{emp?.department}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{trip.purpose}</p>
                      <div className="flex items-center text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-bold">
                        <Clock size={10} className="mr-1" />
                        <span>{trip.date} • {trip.time}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-400">
                        <div className="flex flex-col items-center">
                          <div className="w-2 h-2 rounded-full border border-blue-500"></div>
                          <div className="w-px h-3 bg-slate-300 dark:bg-slate-700"></div>
                          <MapPin size={10} className="text-red-500" />
                        </div>
                        <div className="space-y-1 min-w-0">
                          <p className="truncate w-32 font-medium">{trip.pickup}</p>
                          <p className="truncate w-32 font-medium">{trip.dropoff}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className="font-bold text-slate-900 dark:text-white text-sm">${trip.amount.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={trip.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      {trip.status === 'Pending' ? (
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => onUpdateStatus(trip.id, 'Approved')}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-colors"
                          >
                            <Check size={18} />
                          </button>
                          <button 
                            onClick={() => onUpdateStatus(trip.id, 'Rejected')}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ) : (
                        <button className="text-slate-300 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400">
                          <MoreVertical size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Trip Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in duration-200 border border-white/10">
            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
                <Car className="mr-3 text-blue-600" size={24} />
                Log Trip Details
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-all">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Employee</label>
                  <select 
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm dark:text-white"
                    value={newTrip.employeeId}
                    onChange={e => setNewTrip({...newTrip, employeeId: e.target.value})}
                  >
                    {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Date</label>
                  <input 
                    type="date" 
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm dark:text-white"
                    value={newTrip.date}
                    onChange={e => setNewTrip({...newTrip, date: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Route Info</label>
                  <button 
                    type="button"
                    onClick={handleAISuggest}
                    disabled={isSuggesting}
                    className="text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 px-2 py-1 rounded flex items-center space-x-1 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 disabled:opacity-50 transition-colors"
                  >
                    <Sparkles size={10} />
                    <span>{isSuggesting ? 'Analyzing...' : 'AI Autofill'}</span>
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 border-blue-500"></div>
                    <input 
                      type="text" 
                      placeholder="Pickup location" 
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm dark:text-white"
                      value={newTrip.pickup}
                      onChange={e => setNewTrip({...newTrip, pickup: e.target.value})}
                      required
                    />
                  </div>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-500" />
                    <input 
                      type="text" 
                      placeholder="Dropoff location" 
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm dark:text-white"
                      value={newTrip.dropoff}
                      onChange={e => setNewTrip({...newTrip, dropoff: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Category</label>
                  <select 
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm dark:text-white"
                    value={newTrip.category}
                    onChange={e => setNewTrip({...newTrip, category: e.target.value as TripCategory})}
                  >
                    <option value="Client Meeting">Client Meeting</option>
                    <option value="Office Commute">Office Commute</option>
                    <option value="Event">Event</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Total Amount ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm dark:text-white"
                    value={newTrip.amount}
                    onChange={e => setNewTrip({...newTrip, amount: parseFloat(e.target.value)})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Purpose of Trip</label>
                <textarea 
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm h-24 resize-none dark:text-white"
                  placeholder="Describe why this trip was necessary..."
                  value={newTrip.purpose}
                  onChange={e => setNewTrip({...newTrip, purpose: e.target.value})}
                  required
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 text-slate-600 dark:text-slate-300 font-bold text-sm bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 text-white font-bold text-sm bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/30 transition-all"
                >
                  Confirm Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trips;