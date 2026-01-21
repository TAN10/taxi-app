
import React, { useMemo, useState, useEffect } from 'react';
import { 
  TrendingUp, 
  CreditCard, 
  Clock, 
  CheckCircle, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { Trip, Employee } from '../types';
import { getTripInsights } from '../services/gemini';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

interface DashboardProps {
  trips: Trip[];
  employees: Employee[];
}

const StatCard = ({ label, value, icon: Icon, trend, color }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-600`}>
        <Icon size={24} />
      </div>
    </div>
    {trend && (
      <div className="mt-4 flex items-center space-x-1 text-xs">
        <TrendingUp size={14} className="text-emerald-500" />
        <span className="text-emerald-500 font-semibold">{trend}%</span>
        <span className="text-slate-400">vs last month</span>
      </div>
    )}
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ trips, employees }) => {
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const stats = useMemo(() => {
    const totalSpend = trips.reduce((acc, curr) => acc + curr.amount, 0);
    const pendingCount = trips.filter(t => t.status === 'Pending').length;
    
    // Group spend by department
    const deptSpendMap: Record<string, number> = {};
    trips.forEach(trip => {
      const emp = employees.find(e => e.id === trip.employeeId);
      const dept = emp?.department || 'Other';
      deptSpendMap[dept] = (deptSpendMap[dept] || 0) + trip.amount;
    });
    const spendByDepartment = Object.entries(deptSpendMap).map(([name, value]) => ({ name, value }));

    // Group trips by date
    const dateCountMap: Record<string, number> = {};
    trips.forEach(trip => {
      dateCountMap[trip.date] = (dateCountMap[trip.date] || 0) + 1;
    });
    const tripsByDay = Object.entries(dateCountMap)
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .map(([date, count]) => ({ date, count }));

    return {
      totalSpend,
      totalTrips: trips.length,
      pendingCount,
      spendByDepartment,
      tripsByDay
    };
  }, [trips, employees]);

  const generateInsights = async () => {
    setIsGenerating(true);
    const insights = await getTripInsights(trips);
    setAiInsights(insights || "No data available for insights.");
    setIsGenerating(false);
  };

  useEffect(() => {
    if (trips.length > 0 && !aiInsights) {
      generateInsights();
    }
  }, [trips]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
          <p className="text-slate-500">Track and manage corporate travel expenses in real-time.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors bg-white font-medium text-sm flex items-center space-x-2">
            <span>Download Report</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all font-medium text-sm">
            Configure Budgets
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Spending" 
          value={`$${stats.totalSpend.toLocaleString()}`} 
          icon={CreditCard} 
          trend={12} 
          color="blue" 
        />
        <StatCard 
          label="Total Trips" 
          value={stats.totalTrips} 
          icon={RefreshCw} 
          trend={8} 
          color="indigo" 
        />
        <StatCard 
          label="Pending Approvals" 
          value={stats.pendingCount} 
          icon={Clock} 
          color="amber" 
        />
        <StatCard 
          label="Approval Rate" 
          value="94%" 
          icon={CheckCircle} 
          color="emerald" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Spending Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-lg text-slate-800">Trip Volume Trends</h3>
            <select className="text-sm border-slate-200 rounded-md py-1 bg-slate-50">
              <option>Last 30 Days</option>
              <option>Last Quarter</option>
              <option>Year to Date</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.tripsByDay}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights Card */}
        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-1 rounded-2xl shadow-xl">
          <div className="bg-white h-full rounded-[14px] p-6 relative overflow-hidden">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="text-indigo-600" size={20} />
              <h3 className="font-bold text-lg text-slate-800">AI Spending Insights</h3>
            </div>
            
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <p className="text-slate-500 text-sm animate-pulse">Analyzing travel data...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-slate-600 leading-relaxed">
                  {aiInsights || "No insights generated yet."}
                </p>
                <button 
                  onClick={generateInsights}
                  className="w-full py-2 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold hover:bg-indigo-100 transition-colors"
                >
                  Regenerate Analysis
                </button>
              </div>
            )}
            
            <div className="absolute -bottom-6 -right-6 opacity-5 pointer-events-none">
              <Sparkles size={120} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Departmental Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg text-slate-800 mb-6">Spending by Department</h3>
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.spendByDepartment}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.spendByDepartment.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 space-y-4 mt-4 md:mt-0 px-4">
              {stats.spendByDepartment.map((dept, index) => (
                <div key={dept.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-sm text-slate-600">{dept.name}</span>
                  </div>
                  <span className="text-sm font-semibold">${dept.value.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Expenses */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg text-slate-800 mb-6">Recent Large Trips</h3>
          <div className="space-y-4">
            {trips
              .sort((a, b) => b.amount - a.amount)
              .slice(0, 4)
              .map(trip => {
                const emp = employees.find(e => e.id === trip.employeeId);
                return (
                  <div key={trip.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <img src={emp?.avatar} className="w-10 h-10 rounded-full" alt="" />
                      <div>
                        <p className="text-sm font-semibold">{emp?.name}</p>
                        <p className="text-xs text-slate-500 truncate w-32">{trip.purpose}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">${trip.amount.toFixed(2)}</p>
                      <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">{trip.date}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
