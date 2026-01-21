import React, { useState } from 'react';
import { Mail, Search, MoreHorizontal, UserPlus, Trash2, Edit } from 'lucide-react';
import { Employee } from '../types';

interface EmployeesProps {
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
}

const Employees: React.FC<EmployeesProps> = ({ employees, setEmployees }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmployees = employees.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addPlaceholderEmployee = () => {
    const newEmp: Employee = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Employee',
      department: 'Operations',
      email: 'new.emp@company.com',
      avatar: `https://picsum.photos/seed/${Math.random()}/100/100`
    };
    setEmployees([...employees, newEmp]);
  };

  const deleteEmployee = (id: string) => {
    if (confirm('Are you sure you want to remove this employee? Their trip history will be preserved as unassigned.')) {
      setEmployees(employees.filter(e => e.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Employee Roster</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage departmental access and fleet policy assignments.</p>
        </div>
        <button 
          onClick={addPlaceholderEmployee}
          className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30 font-semibold"
        >
          <UserPlus size={20} />
          <span>Add Member</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors duration-300">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/30 dark:bg-slate-800/20">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Filter by name, department..." 
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm dark:text-white transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            {filteredEmployees.length} Total Accounts
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
          {filteredEmployees.map(emp => (
            <div key={emp.id} className="group p-5 border border-slate-200 dark:border-slate-700 rounded-2xl hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5 transition-all relative overflow-hidden bg-white dark:bg-slate-800/40">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  <img 
                    src={emp.avatar} 
                    className="w-20 h-20 rounded-2xl object-cover ring-4 ring-slate-50 dark:ring-slate-700 shadow-md group-hover:scale-105 transition-transform duration-300" 
                    alt={emp.name} 
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
                </div>
                
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{emp.name}</h4>
                  <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full mt-2 inline-block uppercase tracking-wider">
                    {emp.department}
                  </p>
                </div>

                <div className="flex items-center space-x-2 text-slate-400 dark:text-slate-500">
                  <Mail size={14} />
                  <span className="text-xs truncate max-w-[150px] font-medium">{emp.email}</span>
                </div>

                <div className="pt-2 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => deleteEmployee(emp.id)}
                    className="p-2 text-rose-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <button className="absolute top-4 right-4 p-1 text-slate-300 hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-400">
                <MoreHorizontal size={20} />
              </button>
            </div>
          ))}

          {filteredEmployees.length === 0 && (
            <div className="col-span-full py-16 text-center">
              <div className="bg-slate-100 dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 dark:text-slate-700">
                <Search size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No results found</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Try refining your search terms.</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <h3 className="text-2xl font-bold">Policy Compliance Insight</h3>
            <p className="text-indigo-100 max-w-md mt-2 text-sm leading-relaxed">
              Based on recent trip logs, 100% of active members are adhering to the Corporate Travel Code. No violations reported this cycle.
            </p>
          </div>
          <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 py-3 rounded-xl font-bold text-sm border border-white/20 transition-all">
            Review Policy PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default Employees;