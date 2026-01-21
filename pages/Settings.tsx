
import React, { useState } from 'react';
import { 
  User, 
  Building, 
  Settings as SettingsIcon, 
  Shield, 
  Bell, 
  CreditCard,
  Save,
  Moon,
  Sun,
  Cpu,
  Globe
} from 'lucide-react';
import { AppSettings, User as UserType } from '../types';

interface SettingsProps {
  settings: AppSettings;
  setSettings: (settings: AppSettings) => void;
  currentUser: UserType;
  setCurrentUser: (user: UserType) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, setSettings, currentUser, setCurrentUser }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'app' | 'company'>('profile');

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentUser({ ...currentUser, [e.target.name]: e.target.value });
  };

  const handleSettingsChange = (name: keyof AppSettings, value: any) => {
    setSettings({ ...settings, [name]: value });
  };

  const TabButton = ({ id, icon: Icon, label }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        activeTab === id 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'text-slate-500 hover:bg-slate-100'
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h2>
          <p className="text-slate-500">Manage your account and platform preferences.</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium">
          <Save size={18} />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="flex space-x-2 border-b border-slate-200 pb-4">
        <TabButton id="profile" icon={User} label="Profile" />
        <TabButton id="app" icon={SettingsIcon} label="App Preferences" />
        <TabButton id="company" icon={Building} label="Company" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'profile' && (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center space-x-6">
                <div className="relative group">
                  <img src={currentUser.avatar} alt="Avatar" className="w-24 h-24 rounded-2xl object-cover ring-4 ring-slate-50 shadow-lg" />
                  <button className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                    <SettingsIcon size={20} />
                  </button>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900">{currentUser.name}</h4>
                  <p className="text-slate-500 text-sm">{currentUser.role}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                  <input 
                    name="name"
                    value={currentUser.name}
                    onChange={handleUserChange}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                  <input 
                    name="email"
                    value={currentUser.email}
                    onChange={handleUserChange}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Role</label>
                  <input 
                    name="role"
                    value={currentUser.role}
                    onChange={handleUserChange}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'app' && (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
              <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Cpu size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Auto-AI Insights</p>
                    <p className="text-xs text-slate-500">Automatically analyze trips as they are added.</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleSettingsChange('autoAI', !settings.autoAI)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${settings.autoAI ? 'bg-blue-600' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.autoAI ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    {settings.darkMode ? <Moon size={20} /> : <Sun size={20} />}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Dark Mode Interface</p>
                    <p className="text-xs text-slate-500">Reduce eye strain in low-light environments.</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleSettingsChange('darkMode', !settings.darkMode)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${settings.darkMode ? 'bg-indigo-600' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.darkMode ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <Globe size={18} />
                  <span>Regional Preferences</span>
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Default Currency</label>
                    <select 
                      value={settings.currency}
                      onChange={(e) => handleSettingsChange('currency', e.target.value)}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'company' && (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Company Name</label>
                  <input 
                    value={settings.companyName}
                    onChange={(e) => handleSettingsChange('companyName', e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Monthly Travel Budget</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <input 
                      type="number"
                      value={settings.monthlyBudget}
                      onChange={(e) => handleSettingsChange('monthlyBudget', parseInt(e.target.value))}
                      className="w-full pl-8 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl">
            <h4 className="font-bold flex items-center space-x-2 mb-4">
              <Shield size={18} className="text-blue-400" />
              <span>Security Status</span>
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>2FA Status</span>
                <span className="text-emerald-400 font-bold">Enabled</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>Last Login</span>
                <span>Today, 09:12 AM</span>
              </div>
              <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-all mt-4">
                Update Password
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h4 className="font-bold flex items-center space-x-2 mb-4 text-slate-900">
              <Bell size={18} className="text-amber-500" />
              <span>Notifications</span>
            </h4>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 text-sm text-slate-600">
                <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                <span>Trip Approval Requests</span>
              </label>
              <label className="flex items-center space-x-3 text-sm text-slate-600">
                <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                <span>Monthly Budget Alerts</span>
              </label>
              <label className="flex items-center space-x-3 text-sm text-slate-600">
                <input type="checkbox" className="rounded text-blue-600" />
                <span>AI Performance Tips</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
