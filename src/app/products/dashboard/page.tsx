'use client'

import React from 'react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Activity, Users, ArrowUp, ArrowDown, DollarSign, Clock, Bell } from 'lucide-react';
import TechProducts from '@/app/landing/techproductsection';

// Interfaces
interface StatsCardProps {
  title: string;
  value: string;
  trend: 'up' | 'down';
  trendValue: string;
  icon: React.ElementType;
  color: string;
}

interface RevenueData {
  month: string;
  revenue: number;
}

interface UsersData {
  month: string;
  users: number;
}

// Dati simulati
const revenueData: RevenueData[] = [
  { month: 'Gen', revenue: 4500 },
  { month: 'Feb', revenue: 5200 },
  { month: 'Mar', revenue: 4800 },
  { month: 'Apr', revenue: 6000 },
  { month: 'Mag', revenue: 5700 },
  { month: 'Giu', revenue: 7000 },
].map(item => ({ ...item, revenue: item.revenue + Math.random() * 1000 }));

const usersData: UsersData[] = [
  { month: 'Gen', users: 1200 },
  { month: 'Feb', users: 1400 },
  { month: 'Mar', users: 1800 },
  { month: 'Apr', users: 2200 },
  { month: 'Mag', users: 2600 },
  { month: 'Giu', users: 3000 },
].map(item => ({ ...item, users: item.users + Math.random() * 200 }));

const StatsCard: React.FC<StatsCardProps> = ({ title, value, trend, trendValue, icon: Icon, color }) => (
  <Card className="border border-white/10 bg-black/40 backdrop-blur-sm">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-base font-medium text-white/80">{title}</CardTitle>
      <Icon className={`h-6 w-6 ${color}`} />
    </CardHeader>
    <CardContent>
      <div className="text-4xl text-gray-200 font-bold mb-2">{value}</div>
      <div className="flex items-center gap-2">
        {trend === 'up' ? (
          <ArrowUp className="h-5 w-5 text-green-500" />
        ) : (
          <ArrowDown className="h-5 w-5 text-red-500" />
        )}
        <span className={`text-base font-medium ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
          {trendValue}
        </span>
      </div>
    </CardContent>
  </Card>
);

const DemoDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12 flex justify-between items-center">
          <div>
            <h1 className="text-4xl text-gray-200 font-bold mb-3">Dashboard Demo</h1>
            <p className="text-xl text-white/80">Una panoramica delle performance in tempo reale</p>
          </div>
          <div className="flex gap-4 items-center">
            <Badge variant="outline" className="border-gray-500 text-gray-500 px-4 py-2">
              Live Demo
            </Badge>
            <Bell className="text-white/60 h-6 w-6 cursor-pointer hover:text-white transition-colors" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatsCard
            title="Utenti Attivi"
            value="3,427"
            trend="up"
            trendValue="+14.2%"
            icon={Users}
            color="text-blue-500"
          />
          <StatsCard
            title="Ricavi Mensili"
            value="€ 54,320"
            trend="up"
            trendValue="+8.1%"
            icon={DollarSign}
            color="text-green-500"
          />
          <StatsCard
            title="Tempo Medio Sessione"
            value="24.3m"
            trend="down"
            trendValue="-2.5%"
            icon={Clock}
            color="text-yellow-500"
          />
          <StatsCard
            title="Tasso di Conversione"
            value="3.8%"
            trend="up"
            trendValue="+1.2%"
            icon={Activity}
            color="text-purple-500"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="border border-white/10 bg-black/40 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Andamento Ricavi</CardTitle>
              <CardDescription className="text-base text-white/80">Ultimi 6 mesi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis dataKey="month" stroke="#ffffff80" fontSize={14} />
                    <YAxis stroke="#ffffff80" fontSize={14} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#000000cc',
                        border: '1px solid #ffffff20',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-black/40 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Crescita Utenti</CardTitle>
              <CardDescription className="text-base text-white/80">Trend di acquisizione</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={usersData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis dataKey="month" stroke="#ffffff80" fontSize={14} />
                    <YAxis stroke="#ffffff80" fontSize={14} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#000000cc',
                        border: '1px solid #ffffff20',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="users" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      dot={{ stroke: '#10b981', fill: '#10b981', r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border border-white/10 bg-black/40 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Obiettivi Q3</CardTitle>
              <CardDescription className="text-base text-white/80">Progresso attuale</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-lg font-medium">Acquisizione Clienti</span>
                    <span className="text-lg font-medium text-white/80">78%</span>
                  </div>
                  <Progress value={78} className="h-3 [&>div]:bg-blue-500" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-lg font-medium">Fatturato</span>
                    <span className="text-lg font-medium text-white/80">92%</span>
                  </div>
                  <Progress value={92} className="h-3 [&>div]:bg-green-500" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-lg font-medium">Soddisfazione Utenti</span>
                    <span className="text-lg font-medium text-white/80">85%</span>
                  </div>
                  <Progress value={85} className="h-3 [&>div]:bg-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-black/40 backdrop-blur-sm col-span-2">
            <CardHeader>
              <CardTitle className="text-2xl">Performance per Settore</CardTitle>
              <CardDescription className="text-base text-white/80">Distribuzione dei ricavi per area</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[
                  { name: 'E-commerce', value: '€32.5K', growth: '+12%', color: 'text-blue-500' },
                  { name: 'SaaS', value: '€28.3K', growth: '+18%', color: 'text-green-500' },
                  { name: 'Consulenza', value: '€15.7K', growth: '+5%', color: 'text-purple-500' },
                  { name: 'Marketing', value: '€12.9K', growth: '+9%', color: 'text-yellow-500' },
                  { name: 'Formazione', value: '€8.2K', growth: '+15%', color: 'text-pink-500' },
                  { name: 'Servizi', value: '€6.4K', growth: '+7%', color: 'text-teal-500' },
                ].map((sector, index) => (
                  <div key={index} className="p-6 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="text-lg text-white/80 mb-2">{sector.name}</div>
                    <div className="text-3xl text-gray-200 font-bold mb-2">{sector.value}</div>
                    <div className={`text-lg font-medium ${sector.color}`}>{sector.growth}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          
        </div>

        {/* Tech Products Section */}
        <TechProducts />
      </div>
    </div>
  );
};

export default DemoDashboard;