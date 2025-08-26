'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Users, DollarSign, Activity, Globe, RefreshCw, Zap, BarChart3, PieChart as ShoppingCart, Leaf, Wifi, TreePine, GraduationCap, Scale } from 'lucide-react';


interface ChartData {
  name: string;
  value: number;
  year?: string;
  country?: string;
  [key: string]: string | number | undefined;
}

const MODERN_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

export default function EUDashboard() {
  const [gdpData, setGdpData] = useState<ChartData[]>([]);
  const [populationData, setPopulationData] = useState<ChartData[]>([]);
  const [unemploymentData, setUnemploymentData] = useState<ChartData[]>([]);
  const [inflationData, setInflationData] = useState<ChartData[]>([]);
  const [tradeData, setTradeData] = useState<ChartData[]>([]);
  const [energyData, setEnergyData] = useState<ChartData[]>([]);
  const [digitalData, setDigitalData] = useState<ChartData[]>([]);
  const [environmentData, setEnvironmentData] = useState<ChartData[]>([]);
  const [educationData, setEducationData] = useState<ChartData[]>([]);
  const [govDebtData, setGovDebtData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeChart, setActiveChart] = useState<string>('gdp');
  const [isMounted, setIsMounted] = useState(false);


  // Dati mock per demo (più belli e realistici)
  const generateMockData = () => {
    // PIL dati mock
    const mockGDP = [
      { name: 'Germania', value: 4259934, country: 'DE', growth: 2.1 },
      { name: 'Francia', value: 2938271, country: 'FR', growth: 1.8 },
      { name: 'Italia', value: 2107702, country: 'IT', growth: 1.2 },
      { name: 'Spagna', value: 1419821, country: 'ES', growth: 2.3 },
      { name: 'Paesi Bassi', value: 1013590, country: 'NL', growth: 1.9 },
      { name: 'Polonia', value: 688176, country: 'PL', growth: 3.8 },
      { name: 'Belgio', value: 553050, country: 'BE', growth: 1.4 }
    ];

    // Popolazione dati mock
    const mockPopulation = [
      { name: 'Germania', value: 83240525, country: 'DE' },
      { name: 'Francia', value: 67842582, country: 'FR' },
      { name: 'Italia', value: 58856847, country: 'IT' },
      { name: 'Spagna', value: 47450795, country: 'ES' },
      { name: 'Polonia', value: 37654247, country: 'PL' },
      { name: 'Paesi Bassi', value: 17533044, country: 'NL' },
      { name: 'Belgio', value: 11555997, country: 'BE' }
    ];

    // Disoccupazione trend temporale
    const mockUnemployment = [
      { name: 'Gen 2023', value: 6.1, year: '2023-01' },
      { name: 'Feb 2023', value: 6.0, year: '2023-02' },
      { name: 'Mar 2023', value: 5.9, year: '2023-03' },
      { name: 'Apr 2023', value: 5.8, year: '2023-04' },
      { name: 'Mag 2023', value: 5.7, year: '2023-05' },
      { name: 'Giu 2023', value: 5.8, year: '2023-06' },
      { name: 'Lug 2023', value: 5.9, year: '2023-07' },
      { name: 'Ago 2023', value: 5.8, year: '2023-08' },
      { name: 'Set 2023', value: 5.7, year: '2023-09' },
      { name: 'Ott 2023', value: 5.6, year: '2023-10' },
      { name: 'Nov 2023', value: 5.5, year: '2023-11' },
      { name: 'Dic 2023', value: 5.4, year: '2023-12' }
    ];

    // Inflazione dati mock
    const mockInflation = [
      { name: 'Germania', value: 3.2, country: 'DE' },
      { name: 'Francia', value: 2.9, country: 'FR' },
      { name: 'Italia', value: 1.8, country: 'IT' },
      { name: 'Spagna', value: 2.4, country: 'ES' },
      { name: 'Paesi Bassi', value: 3.8, country: 'NL' },
      { name: 'Polonia', value: 11.4, country: 'PL' },
      { name: 'Belgio', value: 2.7, country: 'BE' }
    ];

    // Commercio estero (Export in miliardi EUR)
    const mockTrade = [
      { name: 'Germania', value: 1765, country: 'DE', imports: 1547 },
      { name: 'Francia', value: 625, country: 'FR', imports: 598 },
      { name: 'Italia', value: 542, country: 'IT', imports: 498 },
      { name: 'Spagna', value: 352, country: 'ES', imports: 348 },
      { name: 'Paesi Bassi', value: 724, country: 'NL', imports: 665 },
      { name: 'Polonia', value: 298, country: 'PL', imports: 289 },
      { name: 'Belgio', value: 387, country: 'BE', imports: 364 }
    ];

    // Energia rinnovabile (% del totale)
    const mockEnergy = [
      { name: 'Germania', value: 19.3, country: 'DE' },
      { name: 'Francia', value: 19.1, country: 'FR' },
      { name: 'Italia', value: 18.2, country: 'IT' },
      { name: 'Spagna', value: 21.2, country: 'ES' },
      { name: 'Paesi Bassi', value: 12.6, country: 'NL' },
      { name: 'Polonia', value: 12.2, country: 'PL' },
      { name: 'Belgio', value: 13.0, country: 'BE' }
    ];

    // Competenze digitali (% popolazione 16-74 anni)
    const mockDigital = [
      { name: 'Germania', value: 70, country: 'DE' },
      { name: 'Francia', value: 61, country: 'FR' },
      { name: 'Italia', value: 46, country: 'IT' },
      { name: 'Spagna', value: 64, country: 'ES' },
      { name: 'Paesi Bassi', value: 79, country: 'NL' },
      { name: 'Polonia', value: 51, country: 'PL' },
      { name: 'Belgio', value: 61, country: 'BE' }
    ];

    // Emissioni CO2 (tonnellate pro capite)
    const mockEnvironment = [
      { name: 'Germania', value: 8.8, country: 'DE' },
      { name: 'Francia', value: 5.2, country: 'FR' },
      { name: 'Italia', value: 6.8, country: 'IT' },
      { name: 'Spagna', value: 7.5, country: 'ES' },
      { name: 'Paesi Bassi', value: 10.1, country: 'NL' },
      { name: 'Polonia', value: 9.9, country: 'PL' },
      { name: 'Belgio', value: 9.4, country: 'BE' }
    ];

    // Istruzione terziaria (% popolazione 30-34 anni)
    const mockEducation = [
      { name: 'Germania', value: 35.7, country: 'DE' },
      { name: 'Francia', value: 47.4, country: 'FR' },
      { name: 'Italia', value: 27.8, country: 'IT' },
      { name: 'Spagna', value: 44.8, country: 'ES' },
      { name: 'Paesi Bassi', value: 52.3, country: 'NL' },
      { name: 'Polonia', value: 45.7, country: 'PL' },
      { name: 'Belgio', value: 47.8, country: 'BE' }
    ];

    // Debito pubblico (% del PIL)
    const mockGovDebt = [
      { name: 'Germania', value: 69.8, country: 'DE' },
      { name: 'Francia', value: 112.9, country: 'FR' },
      { name: 'Italia', value: 147.1, country: 'IT' },
      { name: 'Spagna', value: 113.2, country: 'ES' },
      { name: 'Paesi Bassi', value: 52.4, country: 'NL' },
      { name: 'Polonia', value: 49.6, country: 'PL' },
      { name: 'Belgio', value: 108.2, country: 'BE' }
    ];

    setGdpData(mockGDP);
    setPopulationData(mockPopulation);
    setUnemploymentData(mockUnemployment);
    setInflationData(mockInflation);
    setTradeData(mockTrade);
    setEnergyData(mockEnergy);
    setDigitalData(mockDigital);
    setEnvironmentData(mockEnvironment);
    setEducationData(mockEducation);
    setGovDebtData(mockGovDebt);
  };

  // Carica tutti i dati
  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    
    // Per ora usiamo dati mock per una demo più bella
    setTimeout(() => {
      generateMockData();
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    setIsMounted(true);
    loadAllData();
  }, []);

  // Calcola statistiche aggregate
  const totalGDP = gdpData.reduce((sum, item) => sum + item.value, 0);
  const totalPopulation = populationData.reduce((sum, item) => sum + item.value, 0);
  const avgUnemployment = unemploymentData.length > 0 ? 
    unemploymentData.reduce((sum, item) => sum + item.value, 0) / unemploymentData.length : 0;
  const avgInflation = inflationData.length > 0 ? 
    inflationData.reduce((sum, item) => sum + item.value, 0) / inflationData.length : 0;
  const totalTrade = tradeData.reduce((sum, item) => sum + item.value, 0);
  const avgEnergy = energyData.length > 0 ? 
    energyData.reduce((sum, item) => sum + item.value, 0) / energyData.length : 0;
  const avgDigital = digitalData.length > 0 ? 
    digitalData.reduce((sum, item) => sum + item.value, 0) / digitalData.length : 0;
  const avgEnvironment = environmentData.length > 0 ? 
    environmentData.reduce((sum, item) => sum + item.value, 0) / environmentData.length : 0;
  const avgEducation = educationData.length > 0 ? 
    educationData.reduce((sum, item) => sum + item.value, 0) / educationData.length : 0;
  const avgDebt = govDebtData.length > 0 ? 
    govDebtData.reduce((sum, item) => sum + item.value, 0) / govDebtData.length : 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">
                <span className="text-primary">EU</span> Dashboard
              </h1>
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <Globe className="w-4 h-4" />
                Eurostat Data
              </div>
            </div>
            <Button 
              onClick={loadAllData} 
              disabled={loading}
              className="rounded-full px-6 relative overflow-hidden"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Caricamento...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Aggiorna Dati
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
            <span className="inline-block animate-fade-in-up">Economia</span>{" "}
            <span className="inline-block text-primary animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Europea
            </span>{" "}
            <span className="inline-block animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              in tempo reale
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            Dashboard interattiva con dati ufficiali Eurostat. Statistiche aggiornate dell&apos;Unione Europea.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 bg-gradient-to-br from-card via-card to-muted/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-blue-500/10 transition-all">
                  <DollarSign className="w-6 h-6 text-blue-500" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold mb-1">
                €{(totalGDP / 1000000).toFixed(1)}T
              </h3>
              <p className="text-sm text-muted-foreground">PIL Totale EU</p>
              <div className="mt-2 text-xs text-green-600 flex items-center">
                <span className="mr-1">↗</span>
                +2.1% vs anno scorso
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 bg-gradient-to-br from-card via-card to-muted/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500/20 to-green-500/5 flex items-center justify-center group-hover:from-green-500/30 group-hover:to-green-500/10 transition-all">
                  <Users className="w-6 h-6 text-green-500" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold mb-1">
                {(totalPopulation / 1000000).toFixed(0)}M
              </h3>
              <p className="text-sm text-muted-foreground">Popolazione EU</p>
              <div className="mt-2 text-xs text-green-600 flex items-center">
                <span className="mr-1">↗</span>
                +0.3% crescita annua
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 bg-gradient-to-br from-card via-card to-muted/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-500/5 flex items-center justify-center group-hover:from-orange-500/30 group-hover:to-orange-500/10 transition-all">
                  <Activity className="w-6 h-6 text-orange-500" />
                </div>
                <TrendingDown className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold mb-1">
                {avgUnemployment.toFixed(1)}%
              </h3>
              <p className="text-sm text-muted-foreground">Disoccupazione</p>
              <div className="mt-2 text-xs text-green-600 flex items-center">
                <span className="mr-1">↘</span>
                -0.7% vs anno scorso
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 bg-gradient-to-br from-card via-card to-muted/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 flex items-center justify-center group-hover:from-emerald-500/30 group-hover:to-emerald-500/10 transition-all">
                  <Leaf className="w-6 h-6 text-emerald-500" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold mb-1">
                {avgEnergy.toFixed(1)}%
              </h3>
              <p className="text-sm text-muted-foreground">Energia Rinnovabile</p>
              <div className="mt-2 text-xs text-green-600 flex items-center">
                <span className="mr-1">↗</span>
                Target 2030: 42.5%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-red-500/20 bg-red-500/5">
            <CardContent className="p-4">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Chart Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {[
            { id: 'gdp', label: 'PIL', icon: BarChart3, color: 'text-blue-500' },
            { id: 'population', label: 'Popolazione', icon: Users, color: 'text-green-500' },
            { id: 'unemployment', label: 'Disoccupazione', icon: Activity, color: 'text-orange-500' },
            { id: 'inflation', label: 'Inflazione', icon: Zap, color: 'text-red-500' },
            { id: 'trade', label: 'Commercio', icon: ShoppingCart, color: 'text-purple-500' },
            { id: 'energy', label: 'Energia Verde', icon: Leaf, color: 'text-emerald-500' },
            { id: 'digital', label: 'Digitale', icon: Wifi, color: 'text-cyan-500' },
            { id: 'environment', label: 'CO2', icon: TreePine, color: 'text-amber-500' },
            { id: 'education', label: 'Istruzione', icon: GraduationCap, color: 'text-indigo-500' },
            { id: 'debt', label: 'Debito Pubblico', icon: Scale, color: 'text-rose-500' }
          ].map((chart) => (
            <Button
              key={chart.id}
              variant={activeChart === chart.id ? "default" : "outline"}
              onClick={() => setActiveChart(chart.id)}
              className="rounded-full px-4 py-2 transition-all duration-300 hover:scale-105 text-sm"
            >
              <chart.icon className={`w-4 h-4 mr-2 ${activeChart === chart.id ? '' : chart.color}`} />
              {chart.label}
            </Button>
          ))}
        </div>

        {/* Main Chart Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Large Chart */}
          <div className="lg:col-span-2">
            <Card className="border-2 bg-gradient-to-br from-card via-card to-muted/10 hover:shadow-2xl transition-all duration-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  {activeChart === 'gdp' && (
                    <>
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-blue-500" />
                      </div>
                      PIL Nominale per Paese (Milioni €)
                    </>
                  )}
                  {activeChart === 'population' && (
                    <>
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 to-green-500/5 flex items-center justify-center">
                        <Users className="w-5 h-5 text-green-500" />
                      </div>
                      Distribuzione Popolazione EU
                    </>
                  )}
                  {activeChart === 'unemployment' && (
                    <>
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-500/5 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-orange-500" />
                      </div>
                      Tasso Disoccupazione - Trend 2023
                    </>
                  )}
                  {activeChart === 'inflation' && (
                    <>
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500/20 to-red-500/5 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-red-500" />
                      </div>
                      Inflazione per Paese (%)
                    </>
                  )}
                  {activeChart === 'trade' && (
                    <>
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5 text-purple-500" />
                      </div>
                      Export per Paese (Miliardi €)
                    </>
                  )}
                  {activeChart === 'energy' && (
                    <>
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 flex items-center justify-center">
                        <Leaf className="w-5 h-5 text-emerald-500" />
                      </div>
                      Energie Rinnovabili (% del totale)
                    </>
                  )}
                  {activeChart === 'digital' && (
                    <>
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 flex items-center justify-center">
                        <Wifi className="w-5 h-5 text-cyan-500" />
                      </div>
                      Competenze Digitali (% popolazione)
                    </>
                  )}
                  {activeChart === 'environment' && (
                    <>
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-500/5 flex items-center justify-center">
                        <TreePine className="w-5 h-5 text-amber-500" />
                      </div>
                      Emissioni CO2 (tonnellate pro capite)
                    </>
                  )}
                  {activeChart === 'education' && (
                    <>
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-indigo-500/5 flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-indigo-500" />
                      </div>
                      Istruzione Terziaria (% pop. 30-34 anni)
                    </>
                  )}
                  {activeChart === 'debt' && (
                    <>
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-rose-500/20 to-rose-500/5 flex items-center justify-center">
                        <Scale className="w-5 h-5 text-rose-500" />
                      </div>
                      Debito Pubblico (% del PIL)
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  {loading || !isMounted ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="flex flex-col items-center gap-4">
                        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
                        <p className="text-muted-foreground">Caricamento dati...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center overflow-auto">
                      {activeChart === 'gdp' && gdpData.length > 0 && (
                        <BarChart width={750} height={350} data={gdpData}>
                          <defs>
                            <linearGradient id="gdpGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.2}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                          <XAxis 
                            dataKey="name" 
                            angle={-45} 
                            textAnchor="end" 
                            height={100}
                            stroke="#9CA3AF"
                          />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                              color: 'hsl(var(--foreground))'
                            }}
                            formatter={(value: number) => [Number(value).toLocaleString() + ' M€', 'PIL']} 
                          />
                          <Bar dataKey="value" fill="url(#gdpGradient)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      )}

                      {activeChart === 'population' && populationData.length > 0 && (
                        <PieChart width={750} height={350}>
                          <Pie
                            data={populationData}
                            cx="50%"
                            cy="50%"
                            outerRadius={120}
                            innerRadius={60}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(1)}%`}
                          >
                            {populationData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={MODERN_COLORS[index % MODERN_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#ffffff', 
                              border: '2px solid #e5e7eb',
                              borderRadius: '8px',
                              color: '#1f2937',
                              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
                            }}
                            formatter={(value: number, name: string) => [
                              `${Number(value).toLocaleString()} abitanti`, 
                              name || 'Popolazione'
                            ]}
                            labelFormatter={(label: string) => `${label}`}
                          />
                        </PieChart>
                      )}

                      {activeChart === 'unemployment' && unemploymentData.length > 0 && (
                        <AreaChart width={750} height={350} data={unemploymentData}>
                          <defs>
                            <linearGradient id="unemploymentGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                          <XAxis dataKey="name" stroke="#9CA3AF" />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                              color: 'hsl(var(--foreground))'
                            }}
                            formatter={(value: number) => [`${value}%`, 'Disoccupazione']} 
                          />
                          <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#F59E0B" 
                            fillOpacity={1} 
                            fill="url(#unemploymentGradient)"
                            strokeWidth={3}
                          />
                        </AreaChart>
                      )}

                      {activeChart === 'inflation' && inflationData.length > 0 && (
                        <BarChart width={750} height={350} data={inflationData}>
                          <defs>
                            <linearGradient id="inflationGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#EF4444" stopOpacity={0.2}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                          <XAxis 
                            dataKey="name" 
                            angle={-45} 
                            textAnchor="end" 
                            height={100}
                            stroke="#9CA3AF"
                          />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                              color: 'hsl(var(--foreground))'
                            }}
                            formatter={(value: number) => [`${value}%`, 'Inflazione']} 
                          />
                                                  <Bar dataKey="value" fill="url(#inflationGradient)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                      )}

                      {activeChart === 'trade' && tradeData.length > 0 && (
                        <BarChart width={750} height={350} data={tradeData}>
                          <defs>
                            <linearGradient id="tradeGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.2}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                          <XAxis 
                            dataKey="name" 
                            angle={-45} 
                            textAnchor="end" 
                            height={100}
                            stroke="#9CA3AF"
                          />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                              color: 'hsl(var(--foreground))'
                            }}
                            formatter={(value: number) => [`${value} Mld €`, 'Export']} 
                          />
                          <Bar dataKey="value" fill="url(#tradeGradient)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      )}

                      {activeChart === 'energy' && energyData.length > 0 && (
                        <BarChart width={750} height={350} data={energyData}>
                          <defs>
                            <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#10B981" stopOpacity={0.2}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                          <XAxis 
                            dataKey="name" 
                            angle={-45} 
                            textAnchor="end" 
                            height={100}
                            stroke="#9CA3AF"
                          />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                              color: 'hsl(var(--foreground))'
                            }}
                            formatter={(value: number) => [`${value}%`, 'Energie Rinnovabili']} 
                          />
                          <Bar dataKey="value" fill="url(#energyGradient)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      )}

                      {activeChart === 'digital' && digitalData.length > 0 && (
                        <BarChart width={750} height={350} data={digitalData}>
                          <defs>
                            <linearGradient id="digitalGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.2}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                          <XAxis 
                            dataKey="name" 
                            angle={-45} 
                            textAnchor="end" 
                            height={100}
                            stroke="#9CA3AF"
                          />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                              color: 'hsl(var(--foreground))'
                            }}
                            formatter={(value: number) => [`${value}%`, 'Competenze Digitali']} 
                          />
                          <Bar dataKey="value" fill="url(#digitalGradient)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      )}

                      {activeChart === 'environment' && environmentData.length > 0 && (
                        <BarChart width={750} height={350} data={environmentData}>
                          <defs>
                            <linearGradient id="environmentGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.2}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                          <XAxis 
                            dataKey="name" 
                            angle={-45} 
                            textAnchor="end" 
                            height={100}
                            stroke="#9CA3AF"
                          />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                              color: 'hsl(var(--foreground))'
                            }}
                            formatter={(value: number) => [`${value} t`, 'CO2 pro capite']} 
                          />
                          <Bar dataKey="value" fill="url(#environmentGradient)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      )}

                      {activeChart === 'education' && educationData.length > 0 && (
                        <BarChart width={750} height={350} data={educationData}>
                          <defs>
                            <linearGradient id="educationGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#6366F1" stopOpacity={0.2}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                          <XAxis 
                            dataKey="name" 
                            angle={-45} 
                            textAnchor="end" 
                            height={100}
                            stroke="#9CA3AF"
                          />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                              color: 'hsl(var(--foreground))'
                            }}
                            formatter={(value: number) => [`${value}%`, 'Istruzione Terziaria']} 
                          />
                          <Bar dataKey="value" fill="url(#educationGradient)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      )}

                      {activeChart === 'debt' && govDebtData.length > 0 && (
                        <BarChart width={750} height={350} data={govDebtData}>
                          <defs>
                            <linearGradient id="debtGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.2}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                          <XAxis 
                            dataKey="name" 
                            angle={-45} 
                            textAnchor="end" 
                            height={100}
                            stroke="#9CA3AF"
                          />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                              color: 'hsl(var(--foreground))'
                            }}
                            formatter={(value: number) => [`${value}%`, 'Debito/PIL']} 
                          />
                          <Bar dataKey="value" fill="url(#debtGradient)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Top Countries - Dynamic */}
            <Card className="border-2 bg-gradient-to-br from-card via-card to-muted/10">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  {activeChart === 'gdp' && <><BarChart3 className="w-4 h-4 text-blue-500" />Top Paesi - PIL</>}
                  {activeChart === 'population' && <><Users className="w-4 h-4 text-green-500" />Top Paesi - Popolazione</>}
                  {activeChart === 'unemployment' && <><Activity className="w-4 h-4 text-orange-500" />Trend Disoccupazione</>}
                  {activeChart === 'inflation' && <><Zap className="w-4 h-4 text-red-500" />Top Paesi - Inflazione</>}
                  {activeChart === 'trade' && <><ShoppingCart className="w-4 h-4 text-purple-500" />Top Paesi - Export</>}
                  {activeChart === 'energy' && <><Leaf className="w-4 h-4 text-emerald-500" />Top Paesi - Rinnovabili</>}
                  {activeChart === 'digital' && <><Wifi className="w-4 h-4 text-cyan-500" />Top Paesi - Digitale</>}
                  {activeChart === 'environment' && <><TreePine className="w-4 h-4 text-amber-500" />Top Paesi - CO2</>}
                  {activeChart === 'education' && <><GraduationCap className="w-4 h-4 text-indigo-500" />Top Paesi - Istruzione</>}
                  {activeChart === 'debt' && <><Scale className="w-4 h-4 text-rose-500" />Top Paesi - Debito</>}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <>
                    {activeChart === 'gdp' && gdpData.slice(0, 5).map((country, index) => (
                      <div key={country.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm
                            ${index === 0 ? 'from-yellow-500 to-yellow-600' : 
                              index === 1 ? 'from-gray-400 to-gray-500' : 
                              index === 2 ? 'from-orange-500 to-orange-600' : 
                              'from-blue-500 to-blue-600'}`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-semibold">{country.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(country.value / 1000000).toFixed(1)}T €
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-green-600 flex items-center">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            +{(country as unknown as { growth: number }).growth}%
                          </p>
                        </div>
                      </div>
                    ))}

                    {activeChart === 'population' && populationData.slice(0, 5).map((country, index) => (
                      <div key={country.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm
                            ${index === 0 ? 'from-yellow-500 to-yellow-600' : 
                              index === 1 ? 'from-gray-400 to-gray-500' : 
                              index === 2 ? 'from-orange-500 to-orange-600' : 
                              'from-blue-500 to-blue-600'}`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-semibold">{country.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(country.value / 1000000).toFixed(1)}M abitanti
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-blue-600 flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            {((country.value / populationData.reduce((sum, c) => sum + c.value, 0)) * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    ))}

                    {activeChart === 'unemployment' && unemploymentData.slice(-5).map((period ) => (
                      <div key={period.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-xs">
                            {period.name?.slice(0, 3)}
                          </div>
                          <div>
                            <p className="font-semibold">{period.name}</p>
                            <p className="text-sm text-muted-foreground">2023</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold">
                            {period.value.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    ))}

                    {activeChart === 'trade' && tradeData.slice(0, 5).map((country, index) => (
                      <div key={country.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm
                            ${index === 0 ? 'from-yellow-500 to-yellow-600' : 
                              index === 1 ? 'from-gray-400 to-gray-500' : 
                              index === 2 ? 'from-orange-500 to-orange-600' : 
                              'from-blue-500 to-blue-600'}`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-semibold">{country.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {country.value} Mld €
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-green-600 flex items-center">
                            <ShoppingCart className="w-3 h-3 mr-1" />
                            Export
                          </p>
                        </div>
                      </div>
                    ))}

                    {(activeChart === 'energy' || activeChart === 'digital' || activeChart === 'environment' || activeChart === 'education' || activeChart === 'debt' || activeChart === 'inflation') && 
                      (() => {
                        let data: ChartData[], unit: string, label: string;
                        switch(activeChart) {
                          case 'energy': data = energyData; unit = '%'; label = 'Rinnovabili'; break;
                          case 'digital': data = digitalData; unit = '%'; label = 'Digitale'; break;
                          case 'environment': data = environmentData; unit = 't'; label = 'CO2'; break;
                          case 'education': data = educationData; unit = '%'; label = 'Laurea'; break;
                          case 'debt': data = govDebtData; unit = '%'; label = 'Debito/PIL'; break;
                          case 'inflation': data = inflationData; unit = '%'; label = 'Inflazione'; break;
                          default: data = []; unit = ''; label = '';
                        }
                        return data.slice(0, 5).map((country, index) => (
                          <div key={country.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm
                                ${index === 0 ? 'from-yellow-500 to-yellow-600' : 
                                  index === 1 ? 'from-gray-400 to-gray-500' : 
                                  index === 2 ? 'from-orange-500 to-orange-600' : 
                                  'from-blue-500 to-blue-600'}`}>
                                {index + 1}
                              </div>
                              <div>
                                <p className="font-semibold">{country.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {country.value.toFixed(1)}{unit}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-blue-600">
                                {label}
                              </p>
                            </div>
                          </div>
                        ));
                      })()
                    }
                  </>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats - Dynamic */}
            <Card className="border-2 bg-gradient-to-br from-card via-card to-muted/10">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  Statistiche {activeChart === 'gdp' ? 'PIL' : activeChart === 'population' ? 'Popolazione' : activeChart === 'unemployment' ? 'Disoccupazione' : activeChart === 'inflation' ? 'Inflazione' : activeChart === 'trade' ? 'Commercio' : activeChart === 'energy' ? 'Energia' : activeChart === 'digital' ? 'Digitale' : activeChart === 'environment' ? 'Ambiente' : activeChart === 'education' ? 'Istruzione' : 'Finanza'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <>
                    {activeChart === 'gdp' && (
                      <>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                          <span className="text-sm">PIL totale EU</span>
                          <span className="font-bold">€{(totalGDP / 1000000).toFixed(1)}T</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                          <span className="text-sm">PIL medio/paese</span>
                          <span className="font-bold">€{gdpData.length > 0 ? (totalGDP / gdpData.length / 1000000).toFixed(1) : '0'}T</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                          <span className="text-sm">Leader: Germania</span>
                          <span className="font-bold text-blue-600">26.8% del totale</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                          <span className="text-sm">Crescita media</span>
                          <span className="font-bold text-green-600">+2.2%</span>
                        </div>
                      </>
                    )}

                    {activeChart === 'population' && (
                      <>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                          <span className="text-sm">Popolazione totale</span>
                          <span className="font-bold">{(totalPopulation / 1000000).toFixed(0)}M</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                          <span className="text-sm">Popolazione media</span>
                          <span className="font-bold">{populationData.length > 0 ? (totalPopulation / populationData.length / 1000000).toFixed(1) : '0'}M</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                          <span className="text-sm">Paese più popoloso</span>
                          <span className="font-bold text-green-600">Germania</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                          <span className="text-sm">Crescita annua</span>
                          <span className="font-bold text-green-600">+0.3%</span>
                        </div>
                      </>
                    )}

                    {activeChart === 'unemployment' && (
                      <>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                          <span className="text-sm">Tasso medio EU</span>
                          <span className="font-bold">{avgUnemployment.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                          <span className="text-sm">Trend 2023</span>
                          <span className="font-bold text-green-600">↘ In diminuzione</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                          <span className="text-sm">Valore dicembre</span>
                          <span className="font-bold text-green-600">5.4%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                          <span className="text-sm">Obiettivo Lisbona</span>
                          <span className="font-bold">&lt; 10%</span>
                        </div>
                      </>
                    )}

                    {activeChart === 'energy' && (
                      <>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                          <span className="text-sm">Media EU rinnovabili</span>
                          <span className="font-bold">{avgEnergy.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                          <span className="text-sm">Leader: Spagna</span>
                          <span className="font-bold text-green-600">21.2%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                          <span className="text-sm">Target 2030</span>
                          <span className="font-bold text-amber-600">42.5%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                          <span className="text-sm">Progresso needed</span>
                          <span className="font-bold text-orange-600">+26.0%</span>
                        </div>
                      </>
                    )}

                    {activeChart === 'digital' && (
                      <>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                          <span className="text-sm">Media EU digitale</span>
                          <span className="font-bold">{avgDigital.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                          <span className="text-sm">Leader: Paesi Bassi</span>
                          <span className="font-bold text-cyan-600">79%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                          <span className="text-sm">Target DESI 2030</span>
                          <span className="font-bold text-blue-600">80%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                          <span className="text-sm">Gap da colmare</span>
                          <span className="font-bold text-orange-600">18.1%</span>
                        </div>
                      </>
                    )}

                    {(activeChart === 'trade' || activeChart === 'environment' || activeChart === 'education' || activeChart === 'debt' || activeChart === 'inflation') && (
                      <>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                          <span className="text-sm">Valore medio</span>
                          <span className="font-bold">
                            {activeChart === 'trade' && `${(totalTrade / tradeData.length).toFixed(0)} Mld €`}
                            {activeChart === 'environment' && `${avgEnvironment.toFixed(1)} t CO2`}
                            {activeChart === 'education' && `${avgEducation.toFixed(1)}%`}
                            {activeChart === 'debt' && `${avgDebt.toFixed(1)}%`}
                            {activeChart === 'inflation' && `${avgInflation.toFixed(1)}%`}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                          <span className="text-sm">
                            {activeChart === 'trade' && 'Export totale EU'}
                            {activeChart === 'environment' && 'Target neutralità'}
                            {activeChart === 'education' && 'Target ET 2030'}
                            {activeChart === 'debt' && 'Limite Maastricht'}
                            {activeChart === 'inflation' && 'Target ECB'}
                          </span>
                          <span className="font-bold">
                            {activeChart === 'trade' && `${totalTrade} Mld €`}
                            {activeChart === 'environment' && '0 t CO2'}
                            {activeChart === 'education' && '45%'}
                            {activeChart === 'debt' && '60%'}
                            {activeChart === 'inflation' && '2.0%'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                          <span className="text-sm">
                            {activeChart === 'trade' && 'Leader: Germania'}
                            {activeChart === 'environment' && 'Migliore: Francia'}
                            {activeChart === 'education' && 'Leader: Paesi Bassi'}
                            {activeChart === 'debt' && 'Migliore: Polonia'}
                            {activeChart === 'inflation' && 'Migliore: Italia'}
                          </span>
                          <span className="font-bold text-green-600">
                            {activeChart === 'trade' && '1,765 Mld €'}
                            {activeChart === 'environment' && '5.2 t'}
                            {activeChart === 'education' && '52.3%'}
                            {activeChart === 'debt' && '49.6%'}
                            {activeChart === 'inflation' && '1.8%'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                          <span className="text-sm">Trend generale</span>
                          <span className="font-bold text-blue-600">
                            {activeChart === 'trade' && '↗ Crescita'}
                            {activeChart === 'environment' && '↘ Miglioramento'}
                            {activeChart === 'education' && '↗ Crescita'}
                            {activeChart === 'debt' && '↗ In aumento'}
                            {activeChart === 'inflation' && '↘ In calo'}
                          </span>
                        </div>
                      </>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Data Sources */}
        <Card className="border-2 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-4 flex items-center justify-center gap-3">
                <Globe className="w-8 h-8 text-primary" />
                Fonti Dati Eurostat
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <div className="text-center">
                <h4 className="font-semibold mb-2 flex items-center justify-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-500" />
                  PIL Nominale
                </h4>
                <p className="text-sm text-muted-foreground">
                  Dataset: nama_10_gdp<br/>
                  Aggiornamento: Trimestrale<br/>
                  Unità: Milioni EUR
                </p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold mb-2 flex items-center justify-center gap-2">
                  <Users className="w-4 h-4 text-green-500" />
                  Popolazione
                </h4>
                <p className="text-sm text-muted-foreground">
                  Dataset: demo_pjan<br/>
                  Aggiornamento: Annuale<br/>
                  Dato: 1° Gennaio
                </p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold mb-2 flex items-center justify-center gap-2">
                  <Activity className="w-4 h-4 text-orange-500" />
                  Disoccupazione
                </h4>
                <p className="text-sm text-muted-foreground">
                  Dataset: une_rt_m<br/>
                  Aggiornamento: Mensile<br/>
                  Tipo: Seasonally Adjusted
                </p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold mb-2 flex items-center justify-center gap-2">
                  <Zap className="w-4 h-4 text-red-500" />
                  Inflazione
                </h4>
                <p className="text-sm text-muted-foreground">
                  Dataset: prc_hicp_manr<br/>
                  Aggiornamento: Mensile<br/>
                  Indice: HICP - Annual Rate
                </p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold mb-2 flex items-center justify-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-purple-500" />
                  Commercio Estero
                </h4>
                <p className="text-sm text-muted-foreground">
                  Dataset: ext_lt_maineu<br/>
                  Aggiornamento: Mensile<br/>
                  Unità: Miliardi EUR
                </p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold mb-2 flex items-center justify-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-500" />
                  Energie Rinnovabili
                </h4>
                <p className="text-sm text-muted-foreground">
                  Dataset: nrg_ind_ren<br/>
                  Aggiornamento: Annuale<br/>
                  Unità: % del totale
                </p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold mb-2 flex items-center justify-center gap-2">
                  <Wifi className="w-4 h-4 text-cyan-500" />
                  Competenze Digitali
                </h4>
                <p className="text-sm text-muted-foreground">
                  Dataset: isoc_sk_dskl_i<br/>
                  Aggiornamento: Annuale<br/>
                  Target: Pop. 16-74 anni
                </p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold mb-2 flex items-center justify-center gap-2">
                  <TreePine className="w-4 h-4 text-amber-500" />
                  Emissioni CO2
                </h4>
                <p className="text-sm text-muted-foreground">
                  Dataset: env_air_gge<br/>
                  Aggiornamento: Annuale<br/>
                  Unità: Tonnellate pro capite
                </p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold mb-2 flex items-center justify-center gap-2">
                  <GraduationCap className="w-4 h-4 text-indigo-500" />
                  Istruzione Terziaria
                </h4>
                <p className="text-sm text-muted-foreground">
                  Dataset: edat_lfse_03<br/>
                  Aggiornamento: Annuale<br/>
                  Target: Pop. 30-34 anni
                </p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold mb-2 flex items-center justify-center gap-2">
                  <Scale className="w-4 h-4 text-rose-500" />
                  Debito Pubblico
                </h4>
                <p className="text-sm text-muted-foreground">
                  Dataset: gov_10dd_edpt1<br/>
                  Aggiornamento: Trimestrale<br/>
                  Unità: % del PIL
                </p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-background/60 rounded-lg text-center">
              <p className="text-sm">
                <strong>Eurostat REST API</strong> - Formato JSON-stat 2.0 - 
                <a 
                  href="https://ec.europa.eu/eurostat/web/user-guides/data-browser/api-data-access/api-detailed-guidelines/api-statistics" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline ml-2"
                >
                  Documentazione API →
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
