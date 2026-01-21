
import React, { useState } from 'react';
/* Added Search and Car icons to the import list to resolve undefined icon errors */
import { 
  Plus, 
  Filter, 
  MoreVertical, 
  MapPin, 
  Clock, 
  User,
  ArrowRight,
  Check,
  X,
  Sparkles,
  Info,
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
      'Pending': 'bg-amber-100 text-amber-700',
      'Approved': 'bg-emerald-100 text-emerald-700',
      'Rejected': 'bg-rose-100 text-rose-700'
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Trip History</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 font-semibold"
        >
          <Plus size={20} />
          <span>Log New Trip</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select 
                className="pl-9 pr-4 py-2 border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option>All Status</option>
                <option>Pending</option>
                <option>Approved</option>
                <option>Rejected</option>
              </select>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search history..." 
                className="pl-9 pr-4 py-2 border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 sm:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Showing <span className="text-slate-900">{filteredTrips.length}</span> of <span className="text-slate-900">{trips.length}</span> trips
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Details</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Route</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTrips.map(trip => {
                const emp = employees.find(e => e.id === trip.employeeId);
                return (
                  <tr key={trip.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img src={emp?.avatar} className="w-9 h-9 rounded-full" alt="" />
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{emp?.name}</p>
                          <p className="text-xs text-slate-500">{emp?.department}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-900">{trip.purpose}</p>
                      <div className="flex items-center text-xs text-slate-500 mt-1">
                        <Clock size={12} className="mr-1" />
                        <span>{trip.date} • {trip.time}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 text-xs text-slate-600">
                        <div className="flex flex-col items-center">
                          <div className="w-2 h-2 rounded-full border border-blue-500"></div>
                          <div className="w-px h-3 bg-slate-300"></div>
                          <MapPin size={10} className="text-red-500" />
                        </div>
                        <div className="space-y-1">
                          <p className="truncate w-32 font-medium">{trip.pickup}</p>
                          <p className="truncate w-32 font-medium">{trip.dropoff}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">${trip.amount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={trip.status} />
                    </td>
                    <td className="px-6 py-4">
                      {trip.status === 'Pending' ? (
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => onUpdateStatus(trip.id, 'Approved')}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <Check size={18} />
                          </button>
                          <button 
                            onClick={() => onUpdateStatus(trip.id, 'Rejected')}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ) : (
                        <button className="text-slate-400 hover:text-slate-600">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-900 flex items-center">
                <Car className="mr-2 text-blue-600" size={24} />
                Log Trip Details
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-200 rounded-full transition-all">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Employee</label>
                  <select 
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                    value={newTrip.employeeId}
                    onChange={e => setNewTrip({...newTrip, employeeId: e.target.value})}
                  >
                    {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Date</label>
                  <input 
                    type="date" 
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                    value={newTrip.date}
                    onChange={e => setNewTrip({...newTrip, date: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Route</label>
                  <button 
                    type="button"
                    onClick={handleAISuggest}
                    disabled={isSuggesting}
                    className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-1 rounded flex items-center space-x-1 hover:bg-indigo-200 disabled:opacity-50 transition-colors"
                  >
                    <Sparkles size={10} />
                    <span>{isSuggesting ? 'Thinking...' : 'AI Suggestions'}</span>
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 border-blue-500"></div>
                    <input 
                      type="text" 
                      placeholder="Pickup location" 
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
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
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                      value={newTrip.dropoff}
                      onChange={e => setNewTrip({...newTrip, dropoff: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Trip Category</label>
                  <select 
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                    value={newTrip.category}
                    onChange={e => setNewTrip({...newTrip, category: e.target.value as TripCategory})}
                  >
                    <option>Client Meeting</option>
                    <option>Office Commute</option>
                    <option>Event</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Amount ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                    value={newTrip.amount}
                    onChange={e => setNewTrip({...newTrip, amount: parseFloat(e.target.value)})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Trip Purpose</label>
                <textarea 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm h-24 resize-none"
                  placeholder="E.g. Quarterly audit at main branch"
                  value={newTrip.purpose}
                  onChange={e => setNewTrip({...newTrip, purpose: e.target.value})}
                  required
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 text-slate-600 font-bold text-sm bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 text-white font-bold text-sm bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/30 transition-all"
                >
                  Save Trip
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
