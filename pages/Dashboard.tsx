
import React, { useMemo, useState, useEffect } from 'react';
import { 
  TrendingUp, 
  CreditCard, 
  Clock, 
  CheckCircle, 
  Sparkles,
  RefreshCw,
  Wallet
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
import { Trip, Employee, AppSettings } from '../types';
import { getTripInsights } from '../services/gemini';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

interface DashboardProps {
  trips: Trip[];
  employees: Employee[];
  settings: AppSettings;
}

const StatCard = ({ label, value, icon: Icon, trend, color, subValue }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between relative z-10">
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        {subValue && <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">{subValue}</p>}
      </div>
      <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-600`}>
        <Icon size={24} />
      </div>
    </div>
    {trend && (
      <div className="mt-4 flex items-center space-x-1 text-xs relative z-10">
        <TrendingUp size={14} className="text-emerald-500" />
        <span className="text-emerald-500 font-semibold">{trend}%</span>
        <span className="text-slate-400">vs last month</span>
      </div>
    )}
    <div className={`absolute -right-4 -bottom-4 w-16 h-16 bg-${color}-50/30 rounded-full group-hover:scale-150 transition-transform duration-500`}></div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ trips, employees, settings }) => {
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const currencySymbol = settings.currency === 'USD' ? '$' : settings.currency === 'EUR' ? '€' : '£';

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
    if (settings.autoAI && trips.length > 0 && !aiInsights) {
      generateInsights();
    }
  }, [trips, settings.autoAI]);

  const budgetUsage = (stats.totalSpend / settings.monthlyBudget) * 100;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{settings.companyName} Overview</h2>
          <p className="text-slate-500">Financial tracking for corporate travel operations.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors bg-white font-medium text-sm flex items-center space-x-2 shadow-sm">
            <span>Export CSV</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all font-medium text-sm">
            New Audit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Spending" 
          value={`${currencySymbol}${stats.totalSpend.toLocaleString()}`} 
          icon={CreditCard} 
          trend={12} 
          color="blue" 
          subValue="Current Month"
        />
        <StatCard 
          label="Budget Usage" 
          value={`${budgetUsage.toFixed(1)}%`} 
          icon={Wallet} 
          color="indigo" 
          subValue={`Limit: ${currencySymbol}${settings.monthlyBudget.toLocaleString()}`}
        />
        <StatCard 
          label="Pending Approvals" 
          value={stats.pendingCount} 
          icon={Clock} 
          color="amber" 
          subValue="Actions Required"
        />
        <StatCard 
          label="Policy Compliance" 
          value="98.2%" 
          icon={CheckCircle} 
          color="emerald" 
          subValue="Safety Rating"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-lg text-slate-800">Operational Velocity</h3>
            <select className="text-sm border-slate-200 rounded-md py-1 bg-slate-50">
              <option>Daily View</option>
              <option>Weekly View</option>
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

        <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-1 rounded-2xl shadow-xl">
          <div className="bg-white h-full rounded-[14px] p-6 relative overflow-hidden flex flex-col">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="text-indigo-600" size={20} />
              <h3 className="font-bold text-lg text-slate-800">AI Financial Advisory</h3>
            </div>
            
            {isGenerating ? (
              <div className="flex-1 flex flex-col items-center justify-center py-12 space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <p className="text-slate-500 text-sm animate-pulse font-medium">Computing patterns...</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-between space-y-4">
                <div className="prose prose-sm text-slate-600 leading-relaxed overflow-y-auto max-h-[250px] pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                  {aiInsights || "Enable 'Auto-AI Insights' in settings to get real-time advice."}
                </div>
                <button 
                  onClick={generateInsights}
                  className="w-full py-3 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors mt-auto"
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
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg text-slate-800 mb-6">Budget Distribution</h3>
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
                  <span className="text-sm font-semibold">{currencySymbol}{dept.value.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
             <h3 className="font-bold text-lg text-slate-800">Top Monthly Spenders</h3>
             <button className="text-xs text-blue-600 font-bold hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {trips
              .sort((a, b) => b.amount - a.amount)
              .slice(0, 4)
              .map(trip => {
                const emp = employees.find(e => e.id === trip.employeeId);
                return (
                  <div key={trip.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                    <div className="flex items-center space-x-3">
                      <img src={emp?.avatar} className="w-10 h-10 rounded-full object-cover shadow-sm" alt="" />
                      <div>
                        <p className="text-sm font-semibold">{emp?.name}</p>
                        <p className="text-xs text-slate-500 truncate w-32 font-medium">{trip.purpose}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{currencySymbol}{trip.amount.toFixed(2)}</p>
                      <p className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">{trip.date}</p>
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
