// src/app/page.tsx
'use client';

import React from 'react';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Wrench, 
  Users, 
  Building2, 
  Calendar, 
  MoreVertical, 
  ArrowUpRight,
  ShieldCheck,
  FileText,
  Video,
  HeartHandshake
} from 'lucide-react';

export default function OnboardingDashboard() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans antialiased pb-16">
      
      {/* Top Header Navigation */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-[#EB1C24] flex items-center justify-center text-white font-bold text-lg">
              S
            </div>
            <span className="font-bold tracking-wider text-lg text-gray-900">SITECORE</span>
          </div>

          <div className="relative w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search HR KB & Policies..." 
              className="w-full bg-[#F1F3F5] text-sm rounded-full pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#5C2D91]/30 transition-all"
            />
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-8 font-medium text-sm">
          <a href="#" className="text-[#5C2D91] border-b-2 border-[#5C2D91] pb-1">My Journey</a>
          <a href="#" className="text-gray-600 hover:text-[#5C2D91] transition-colors">Tasks</a>
          <a href="#" className="text-gray-600 hover:text-[#5C2D91] transition-colors">HR Resources</a>
          <a href="#" className="text-gray-600 hover:text-[#5C2D91] transition-colors">Connect</a>
        </nav>

        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#EB1C24] rounded-full"></span>
          </button>
          
          <div className="flex items-center space-x-3 pl-2 border-l border-gray-200">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces" 
              alt="Alex Chen" 
              className="w-9 h-9 rounded-full object-cover border border-gray-300"
            />
            <div className="hidden lg:block text-left">
              <div className="text-sm font-semibold text-gray-900 leading-tight">Alex Chen</div>
              <div className="text-xs text-gray-500 mt-0.5">HR Operations Specialist</div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>
        </div>
      </header>

      {/* Hero Banner Section */}
      <div className="bg-[#5C2D91] text-white px-8 pt-8 pb-16 relative overflow-hidden shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center relative z-10">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold tracking-tight">Welcome, Alex! Your HR Onboarding Journey</h1>
              <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
                Day 40
              </span>
            </div>
            <p className="text-purple-200 text-sm">People Experience & HR Operations • Global Talent Team</p>
          </div>

          <div className="mt-4 md:mt-0">
            <button className="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-all backdrop-blur-sm">
              <span>HR Views</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-6 -mt-8 relative z-20 space-y-6">

        {/* Progress Overview Card */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-base font-bold text-gray-900 mb-6">Progress Overview</h2>
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            
            {/* Timeline Bar */}
            <div className="flex-1 w-full flex items-center justify-between relative px-4">
              <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-gray-200 -z-0"></div>
              <div className="absolute left-6 w-[45%] top-1/2 -translate-y-1/2 h-1 bg-[#5C2D91] -z-0"></div>

              {/* Node 1 */}
              <div className="relative z-10 flex flex-col items-center group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-[#5C2D91] text-white flex items-center justify-center shadow-md">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-gray-600 mt-2">Days 1</span>
              </div>

              {/* Node 2 */}
              <div className="relative z-10 flex flex-col items-center group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-[#5C2D91] text-white flex items-center justify-center shadow-md">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-gray-600 mt-2">Days 15</span>
              </div>

              {/* Node 3 (Current Marker) */}
              <div className="relative z-10 flex flex-col items-center group cursor-pointer">
                <span className="absolute -top-7 bg-[#5C2D91] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                  Day 40
                </span>
                <div className="w-12 h-12 rounded-full bg-[#5C2D91] text-white flex items-center justify-center shadow-lg ring-4 ring-purple-100">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-[#5C2D91] mt-2">Days 30</span>
              </div>

              {/* Node 4 */}
              <div className="relative z-10 flex flex-col items-center group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-gray-400 mt-2">Days 45</span>
              </div>

              {/* Node 5 */}
              <div className="relative z-10 flex flex-col items-center group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-gray-400 mt-2">Days 60</span>
              </div>

              {/* Node 6 */}
              <div className="relative z-10 flex flex-col items-center group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-gray-400 mt-2">Days 90</span>
              </div>
            </div>

            {/* Circular Progress Meter */}
            <div className="flex items-center space-x-6 border-l lg:border-l-gray-200 lg:pl-8">
              <div className="relative flex items-center justify-center">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" className="text-gray-100" fill="transparent" />
                  <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" className="text-[#EB1C24]" fill="transparent" strokeDasharray="251.2" strokeDashoffset="138.2" strokeLinecap="round" />
                </svg>
                <div className="absolute text-center">
                  <span className="text-xl font-bold text-gray-900">45%</span>
                </div>
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-gray-900">Complete</div>
                <div className="text-xs text-gray-500 mt-0.5">Day 40 of 90</div>
                <div className="text-xs text-gray-400">18 of 40 tasks done</div>
              </div>
            </div>

          </div>

          {/* Mini Milestone Badges */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-100 text-center">
            <div className="flex flex-col items-center justify-center bg-[#F8F9FA] p-3 rounded-xl border border-gray-100">
              <span className="text-xs font-semibold text-gray-500">HR Systems Prep</span>
              <span className="text-sm font-bold text-[#5C2D91] mt-1">85% Complete</span>
            </div>
            <div className="flex flex-col items-center justify-center bg-[#F8F9FA] p-3 rounded-xl border border-gray-100">
              <span className="text-xs font-semibold text-gray-500">Policy & Compliance</span>
              <span className="text-sm font-bold text-[#5C2D91] mt-1">60% Complete</span>
            </div>
            <div className="flex flex-col items-center justify-center bg-[#F8F9FA] p-3 rounded-xl border border-gray-100">
              <span className="text-xs font-semibold text-gray-500">Starter Facilitation</span>
              <span className="text-sm font-bold text-[#EB1C24] mt-1">30% Complete</span>
            </div>
          </div>
        </section>

        {/* 3-Column Bento Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Current Tasks Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2 text-gray-900 font-bold">
                  <CheckCircle2 className="w-5 h-5 text-[#EB1C24]" />
                  <span>HR Tasks & Checklists</span>
                </div>
                <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-4 h-4" /></button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" defaultChecked className="rounded text-[#5C2D91] focus:ring-[#5C2D91] w-4 h-4" />
                    <span className="text-sm font-medium text-gray-800">Workday Admin Training</span>
                  </div>
                  <div className="w-24 bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#5C2D91] h-full w-4/5"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded text-[#EB1C24] focus:ring-[#EB1C24] w-4 h-4" />
                    <span className="text-sm font-medium text-gray-800">Global Benefits Policy Review</span>
                  </div>
                  <div className="w-24 bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#EB1C24] h-full w-2/5"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded text-[#EB1C24] focus:ring-[#EB1C24] w-4 h-4" />
                    <span className="text-sm font-medium text-gray-800">New Starter Cohort Sync</span>
                  </div>
                  <div className="w-24 bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#EB1C24] h-full w-1/5"></div>
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full mt-6 bg-[#F8F9FA] hover:bg-gray-100 text-gray-800 text-xs font-semibold py-2.5 rounded-xl transition-all border border-gray-200">
              View All HR Action Items
            </button>
          </div>

          {/* Learning Path Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2 text-gray-900 font-bold">
                  <BookOpen className="w-5 h-5 text-[#5C2D91]" />
                  <span>HR Learning Path</span>
                </div>
                <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-4 h-4" /></button>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between pb-3 border-b border-gray-50">
                  <span className="font-medium text-gray-800">Sitecore People Ops Basics</span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full font-medium">4/5 modules</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-gray-50">
                  <span className="font-medium text-gray-800">Onboarding & Offboarding Workflows</span>
                  <div className="w-16 bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#5C2D91] h-full w-3/4"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800">Performance Review Lifecycle</span>
                  <span className="text-xs text-[#5C2D91] font-semibold flex items-center">Start <ArrowUpRight className="w-3 h-3 ml-0.5" /></span>
                </div>
              </div>
            </div>

            <button className="w-full mt-6 bg-[#F8F9FA] hover:bg-gray-100 text-gray-800 text-xs font-semibold py-2.5 rounded-xl transition-all border border-gray-200">
              Explore HR Knowledge Base
            </button>
          </div>

          {/* Essential HR Tools Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2 text-gray-900 font-bold">
                  <Wrench className="w-5 h-5 text-[#EB1C24]" />
                  <span>HR Systems Access</span>
                </div>
                <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-4 h-4" /></button>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between p-2.5 bg-[#F8F9FA] rounded-xl">
                  <span className="font-medium text-gray-800">Workday HCM Portal</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5"></span> Active
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-[#F8F9FA] rounded-xl">
                  <span className="font-medium text-gray-800">Greenhouse ATS</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5"></span> Active
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-[#F8F9FA] rounded-xl">
                  <span className="font-medium text-gray-800">Culture Amp Surveys</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5"></span> Active
                  </span>
                </div>
              </div>
            </div>

            <button className="w-full mt-6 bg-[#F8F9FA] hover:bg-gray-100 text-gray-800 text-xs font-semibold py-2.5 rounded-xl transition-all border border-gray-200">
              Request Platform Permissions
            </button>
          </div>

        </div>

        {/* Bottom Row: HR Team, Policies & Check-ins */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* My HR Team Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2 text-gray-900 font-bold">
                  <Users className="w-5 h-5 text-[#5C2D91]" />
                  <span>HR & People Team</span>
                </div>
                <span className="text-xs font-semibold text-[#5C2D91] cursor-pointer hover:underline">Directory</span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=faces" alt="Sarah J." className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Sarah J. (HR Director)</div>
                      <div className="text-xs text-gray-500">People Experience Lead</div>
                    </div>
                  </div>
                  <button className="bg-[#5C2D91] hover:bg-[#4a2375] text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all">
                    Connect
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces" alt="Ben L." className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Ben L. (Talent Partner)</div>
                      <div className="text-xs text-gray-500">HR Buddy & Mentor</div>
                    </div>
                  </div>
                  <button className="bg-[#EB1C24] hover:bg-[#c4151b] text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all">
                    Connect
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Company Culture & HR Guidelines Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2 text-gray-900 font-bold">
                  <Building2 className="w-5 h-5 text-[#EB1C24]" />
                  <span>HR Policies & Culture</span>
                </div>
                <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-4 h-4" /></button>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between p-3 bg-[#F8F9FA] rounded-xl hover:bg-gray-100 transition-all cursor-pointer">
                  <span className="font-medium text-gray-800">Global Employee Handbook</span>
                  <ArrowUpRight className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex items-center justify-between p-3 bg-[#F8F9FA] rounded-xl hover:bg-gray-100 transition-all cursor-pointer">
                  <span className="font-medium text-gray-800">DE&I Guidelines & Initiatives</span>
                  <ArrowUpRight className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex items-center justify-between p-3 bg-[#F8F9FA] rounded-xl hover:bg-gray-100 transition-all cursor-pointer">
                  <span className="font-medium text-gray-800">Global Compensation & Benefits</span>
                  <ArrowUpRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Events & Check-ins Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2 text-gray-900 font-bold">
                  <Calendar className="w-5 h-5 text-[#5C2D91]" />
                  <span>HR Syncs & Events</span>
                </div>
                <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-4 h-4" /></button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Today</span>
                    <div className="text-sm font-semibold text-gray-900 flex items-center mt-0.5">
                      <Video className="w-4 h-4 text-[#5C2D91] mr-1.5" /> 30-Day HR Check-in Sync
                    </div>
                  </div>
                  <button className="bg-[#5C2D91] hover:bg-[#4a2375] text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all">
                    Join Call
                  </button>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tomorrow</span>
                    <div className="text-sm font-semibold text-gray-900 flex items-center mt-0.5">
                      <FileText className="w-4 h-4 text-[#EB1C24] mr-1.5" /> New Starter Orientation Workshop
                    </div>
                  </div>
                  <button className="bg-[#EB1C24] hover:bg-[#c4151b] text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all">
                    Schedule
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}

// Custom icon component for final milestone badge
function Award(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
  );
}