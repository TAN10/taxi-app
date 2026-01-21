
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
      department: 'General',
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
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Employees</h2>
          <p className="text-slate-500 mt-1">Manage corporate accounts and departmental assignments.</p>
        </div>
        <button 
          onClick={addPlaceholderEmployee}
          className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30 font-semibold"
        >
          <UserPlus size={20} />
          <span>Add Employee</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or department..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <p className="text-sm font-medium text-slate-500">
            Total Employees: <span className="text-slate-900">{employees.length}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
          {filteredEmployees.map(emp => (
            <div key={emp.id} className="group p-5 border border-slate-200 rounded-2xl hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/5 transition-all relative overflow-hidden bg-slate-50/30">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  <img 
                    src={emp.avatar} 
                    className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white shadow-md group-hover:scale-105 transition-transform" 
                    alt={emp.name} 
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>
                
                <div>
                  <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{emp.name}</h4>
                  <p className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full mt-1 inline-block">
                    {emp.department}
                  </p>
                </div>

                <div className="flex items-center space-x-2 text-slate-400">
                  <Mail size={14} />
                  <span className="text-xs truncate max-w-[150px]">{emp.email}</span>
                </div>

                <div className="pt-2 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 text-slate-500 hover:bg-slate-200 rounded-lg transition-colors">
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => deleteEmployee(emp.id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <button className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600">
                <MoreHorizontal size={20} />
              </button>
            </div>
          ))}

          {filteredEmployees.length === 0 && (
            <div className="col-span-full py-12 text-center">
              <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Search size={24} />
              </div>
              <p className="text-slate-500 font-medium">No employees found matching your search.</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold">Policy Compliance</h3>
            <p className="text-blue-100 max-w-md mt-2">All 3 active employees are currently compliant with the 2024 Corporate Travel Policy.</p>
          </div>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold text-sm shadow-md hover:bg-blue-50 transition-all">
            Review Policy
          </button>
        </div>
      </div>
    </div>
  );
};

export default Employees;
