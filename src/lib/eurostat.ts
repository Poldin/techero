// Servizio per interfacciarsi con l'API Eurostat
// Documentazione: https://ec.europa.eu/eurostat/web/user-guides/data-browser/api-data-access

type EurostatValueObject = { [key: string]: number | null };
type EurostatValueArray = Array<number | null>;
type EurostatValue = EurostatValueObject | EurostatValueArray;

interface EurostatDimension {
  label: string;
  category: {
    index: { [key: string]: number };
    label: { [key: string]: string };
  };
}

interface EurostatResponse {
  version: string;
  class: string;
  label: string;
  source: string;
  updated: string;
  value: EurostatValue;
  dimension: {
    [key: string]: EurostatDimension;
  };
  id: string[];
  size: number[];
}

interface ProcessedData {
  name: string;
  value: number;
  country?: string;
  year?: string;
  period?: string;
  [key: string]: string | number | undefined;
}

// Mapping dei dataset Eurostat (testati e funzionanti)
export const EUROSTAT_DATASETS = {
  GDP: 'nama_10_gdp',           // PIL nazionale annuale
  POPULATION: 'demo_pjan',       // Popolazione al 1° gennaio
  UNEMPLOYMENT: 'une_rt_m',      // Tasso di disoccupazione mensile
  INFLATION: 'prc_hicp_manr',    // Inflazione annuale HICP
  TRADE_EXPORT: 'ext_lt_maineu', // Commercio estero - export
  ENERGY_RENEWABLE: 'nrg_ind_ren', // Quota energie rinnovabili (% del consumo finale lordo)
  DIGITAL_SKILLS: 'isoc_sk_dskl_i', // Competenze digitali
  CO2_EMISSIONS: 'env_air_gge',   // Emissioni gas serra
  EDUCATION: 'edat_lfse_03',      // Istruzione terziaria
  GOVERNMENT_DEBT: 'gov_10dd_edpt1' // Debito pubblico
};

// Mapping dei paesi EU principali
export const EU_COUNTRIES = {
  'DE': 'Germania',
  'FR': 'Francia', 
  'IT': 'Italia',
  'ES': 'Spagna',
  'NL': 'Paesi Bassi',
  'PL': 'Polonia',
  'BE': 'Belgio',
  'SE': 'Svezia',
  'AT': 'Austria',
  'PT': 'Portogallo'
};

// Base URL per l'API Eurostat
const EUROSTAT_BASE_URL = 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data';

class EurostatAPI {
  private baseUrl: string;
  private cache: Map<string, { data: any; timestamp: number }>;
  private cacheDuration: number; // durata cache in millisecond

  constructor() {
    this.baseUrl = EUROSTAT_BASE_URL;
    this.cache = new Map();
    this.cacheDuration = 30 * 60 * 1000; // 30 minuti
  }

  // Metodo principale per fare richieste all'API
  private async fetchData(dataset: string, params: string = ''): Promise<EurostatResponse> {
    const cacheKey = `${dataset}_${params}`;
    
    // Controlla cache
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      console.log('Dati trovati in cache per:', dataset);
      return cached.data;
    }

    try {
      const url = `${this.baseUrl}/${dataset}?format=JSON&${params}`;
      console.log('🌐 Fetching from Eurostat:', url);
      
      const response = await fetch(url);
      
      console.log('📊 Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        // Tenta di leggere il corpo della risposta per maggiori dettagli
        let errorBody = '';
        try {
          errorBody = await response.text();
          console.error('❌ Error response body:', errorBody);
        } catch (e) {
          console.error('❌ Could not read error body');
        }
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText} - Body: ${errorBody}`);
      }
      
      const data: EurostatResponse = await response.json();
      console.log('✅ Data received successfully for:', dataset, '- Size:', JSON.stringify(data).length, 'chars');
      
      // Salva in cache
      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      
      return data;
    } catch (error) {
      console.error('💥 Errore nell\'API Eurostat:', error);
      throw error;
    }
  }

  // Parser migliorato per convertire dati Eurostat in formato utilizzabile
  private parseEurostatData(
    data: EurostatResponse, 
    countryDimension: string = 'geo',
    valueDimension?: string
  ): ProcessedData[] {
    try {
      return this.parseLatestByGeo(data, countryDimension);
    } catch (error) {
      console.error('💥 Errore nel parsing dei dati Eurostat:', error);
      return [];
    }
  }

  // Helpers JSON-stat
  private getTimeDimensionId(data: EurostatResponse): string | null {
    const timeId = data.id.find((d) => d.toLowerCase() === 'time');
    return timeId || null;
  }

  private getLatestTimeIndex(data: EurostatResponse): number | null {
    const timeId = this.getTimeDimensionId(data);
    if (!timeId) return null;
    const timeDim = data.dimension[timeId];
    if (!timeDim) return null;
    const indices = Object.values(timeDim.category.index);
    if (indices.length === 0) return null;
    return Math.max(...indices);
  }

  private computeStrides(sizes: number[]): number[] {
    const strides: number[] = new Array(sizes.length).fill(0);
    let acc = 1;
    for (let i = sizes.length - 1; i >= 0; i--) {
      strides[i] = acc;
      acc *= sizes[i];
    }
    return strides;
  }

  private getValueByIndices(data: EurostatResponse, indices: number[]): number | null {
    const val = data.value as EurostatValue;
    if (Array.isArray(val)) {
      const strides = this.computeStrides(data.size);
      let offset = 0;
      for (let i = 0; i < indices.length; i++) {
        offset += indices[i] * strides[i];
      }
      return val[offset] ?? null;
    }
    const key = indices.join(':');
    const obj = val as EurostatValueObject;
    return (obj[key] ?? obj[String(indices[0])] ?? null) as number | null;
  }

  private parseLatestByGeo(
    data: EurostatResponse,
    countryDimension: string = 'geo',
  ): ProcessedData[] {
    const result: ProcessedData[] = [];
    const dimOrder = new Map<string, number>();
    data.id.forEach((d, i) => dimOrder.set(d, i));

    const geoDim = data.dimension[countryDimension];
    if (!geoDim) return [];

    const latestTimeIdx = this.getLatestTimeIndex(data);

    const geoEntries = Object.entries(geoDim.category.index);
    for (const [geoCode, geoIdx] of geoEntries) {
      const countryName = EU_COUNTRIES[geoCode as keyof typeof EU_COUNTRIES];
      if (!countryName) continue;

      const indices = data.id.map(() => 0);
      const geoPos = dimOrder.get(countryDimension);
      if (geoPos !== undefined) indices[geoPos] = geoIdx;
      const timeId = this.getTimeDimensionId(data);
      if (timeId && latestTimeIdx !== null) {
        const timePos = dimOrder.get(timeId)!;
        indices[timePos] = latestTimeIdx;
      }
      const value = this.getValueByIndices(data, indices);
      if (value !== null && value !== undefined) {
        result.push({ name: countryName, value, country: geoCode });
      }
    }
    return result.sort((a, b) => b.value - a.value);
  }

  private parseTimeSeriesForGeo(
    data: EurostatResponse,
    targetGeoCode: string,
    countryDimension: string = 'geo',
    maxPoints: number = 12,
  ): ProcessedData[] {
    const dimOrder = new Map<string, number>();
    data.id.forEach((d, i) => dimOrder.set(d, i));

    const geoDim = data.dimension[countryDimension];
    const timeId = this.getTimeDimensionId(data);
    if (!geoDim || !timeId) return [];

    const timeDim = data.dimension[timeId];
    const timeEntries = Object.entries(timeDim.category.index).sort((a, b) => a[1] - b[1]);

    const geoIdx = geoDim.category.index[targetGeoCode];
    if (geoIdx === undefined) return [];

    const indices = data.id.map(() => 0);
    const geoPos = dimOrder.get(countryDimension)!;
    const timePos = dimOrder.get(timeId)!;
    indices[geoPos] = geoIdx;

    const timeLabels = (timeDim.category.label || {}) as Record<string, string>;
    const formatTimeLabel = (code: string): string => {
      const label = timeLabels[code] || code;
      const yyyymm = /^([0-9]{4})-([0-9]{2})$/;
      const yyyymmm = /^([0-9]{4})M([0-9]{2})$/;
      let year = '';
      let month = '';
      if (yyyymm.test(code)) {
        const m = code.match(yyyymm)!;
        year = m[1]; month = m[2];
      } else if (yyyymmm.test(code)) {
        const m = code.match(yyyymmm)!;
        year = m[1]; month = m[2];
      }
      if (year && month) {
        try {
          const d = new Date(Number(year), Number(month) - 1, 1);
          const fmt = d.toLocaleDateString('it-IT', { month: 'short', year: 'numeric' });
          return fmt.charAt(0).toUpperCase() + fmt.slice(1);
        } catch {}
      }
      return label;
    };

    const start = Math.max(0, timeEntries.length - maxPoints);
    const picked = timeEntries.slice(start);
    const series: ProcessedData[] = [];
    for (const [timeCode, tIdx] of picked) {
      indices[timePos] = tIdx;
      const value = this.getValueByIndices(data, indices);
      if (value !== null && value !== undefined) {
        series.push({ name: formatTimeLabel(timeCode), value, period: timeCode });
      }
    }
    return series;
  }

  // Ottieni dati PIL - versione semplificata per test
  async getGDPData(): Promise<ProcessedData[]> {
    console.log('💰 [GDP] Inizio caricamento dati PIL...');
    try {
      // Usiamo stessa struttura dell'inflazione che funziona
      const params = 'unit=CP_MEUR&na_item=B1GQ&geo=DE&geo=FR&geo=IT&geo=ES&geo=NL&geo=PL&geo=BE';
      console.log('💰 [GDP] Parametri:', params);
      
      const data = await this.fetchData(EUROSTAT_DATASETS.GDP, params);
      console.log('💰 [GDP] Dati ricevuti, inizio parsing...');
      
      const result = this.parseLatestByGeo(data);
      console.log('💰 [GDP] Parsing completato, risultati:', result.length, 'elementi');
      
      return result;
    } catch (error) {
      console.error('💰 [GDP] Errore nel recupero dati PIL:', error);
      return [];
    }
  }

  // Ottieni dati popolazione - versione semplificata
  async getPopulationData(): Promise<ProcessedData[]> {
    console.log('👥 [POPULATION] Inizio caricamento dati popolazione...');
    try {
      // Usiamo stessa struttura dell'inflazione che funziona
      const params = 'sex=T&age=TOTAL&geo=DE&geo=FR&geo=IT&geo=ES&geo=NL&geo=PL&geo=BE';
      console.log('👥 [POPULATION] Parametri:', params);
      
      const data = await this.fetchData(EUROSTAT_DATASETS.POPULATION, params);
      console.log('👥 [POPULATION] Dati ricevuti, inizio parsing...');
      
      const result = this.parseLatestByGeo(data);
      console.log('👥 [POPULATION] Parsing completato, risultati:', result.length, 'elementi');
      
      return result;
    } catch (error) {
      console.error('👥 [POPULATION] Errore nel recupero dati popolazione:', error);
      return [];
    }
  }

  // Ottieni dati disoccupazione
  async getUnemploymentData(): Promise<ProcessedData[]> {
    console.log('📊 [UNEMPLOYMENT] Inizio caricamento dati disoccupazione...');
    try {
      // Serie temporale per EU27_2020 ultimi 12 mesi
      const params = 's_adj=SA&age=TOTAL&sex=T&geo=EU27_2020';
      console.log('📊 [UNEMPLOYMENT] Parametri:', params);
      
      const data = await this.fetchData(EUROSTAT_DATASETS.UNEMPLOYMENT, params);
      console.log('📊 [UNEMPLOYMENT] Dati ricevuti, inizio parsing...');
      
      const result = this.parseTimeSeriesForGeo(data, 'EU27_2020', 'geo', 12);
      console.log('📊 [UNEMPLOYMENT] Parsing completato, risultati:', result.length, 'elementi');
      
      return result;
    } catch (error) {
      console.error('📊 [UNEMPLOYMENT] Errore nel recupero dati disoccupazione:', error);
      return [];
    }
  }

  // Ottieni dati inflazione
  async getInflationData(): Promise<ProcessedData[]> {
    console.log('📈 [INFLATION] Inizio caricamento dati inflazione...');
    try {
      // HICP - All items, tasso annuale (rimuoviamo time per prendere l'ultimo disponibile)
      const params = 'coicop=CP00&geo=DE&geo=FR&geo=IT&geo=ES&geo=NL&geo=PL&geo=BE';
      console.log('📈 [INFLATION] Parametri:', params);
      
      const data = await this.fetchData(EUROSTAT_DATASETS.INFLATION, params);
      console.log('📈 [INFLATION] Dati ricevuti, inizio parsing...');
      
      const result = this.parseLatestByGeo(data);
      console.log('📈 [INFLATION] Parsing completato, risultati:', result.length, 'elementi');
      
      return result;
    } catch (error) {
      console.error('📈 [INFLATION] Errore nel recupero dati inflazione:', error);
      return [];
    }
  }

  // Ottieni dati energie rinnovabili
  async getEnergyData(): Promise<ProcessedData[]> {
    console.log('🌱 [ENERGY] Inizio caricamento dati energia rinnovabile...');
    try {
      // Semplifichiamo drasticamente - solo paesi senza parametri problematici
      const params = 'geo=DE&geo=FR&geo=IT&geo=ES&geo=NL&geo=PL&geo=BE';
      console.log('🌱 [ENERGY] Parametri semplificati:', params);
      
      const data = await this.fetchData(EUROSTAT_DATASETS.ENERGY_RENEWABLE, params);
      console.log('🌱 [ENERGY] Dati ricevuti, inizio parsing...');
      
      const result = this.parseLatestByGeo(data);
      console.log('🌱 [ENERGY] Parsing completato, risultati:', result.length, 'elementi');
      
      return result;
    } catch (error) {
      console.error('🌱 [ENERGY] Errore nel recupero dati energia:', error);
      return [];
    }
  }

  // Metodo di test molto basilare
  async getBasicTest(): Promise<any> {
    console.log('🧪 [TEST] Inizio test di connessione basilare...');
    try {
      // Test ultra-semplice senza parametri complessi
      console.log('🔍 [TEST] Test basilare senza filtri complessi...');
      const params = 'geo=DE';
      const url = `${this.baseUrl}/${EUROSTAT_DATASETS.POPULATION}?format=JSON&${params}`;
      console.log('🌐 [TEST] URL test:', url);
      
      const response = await fetch(url);
      console.log('📊 [TEST] Status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [TEST] Error body:', errorText);
        return null;
      }
      
      const data = await response.json();
      console.log('✅ [TEST] Raw data keys:', Object.keys(data));
      console.log('✅ [TEST] Dimensions:', data.dimension ? Object.keys(data.dimension) : 'No dimensions');
      console.log('✅ [TEST] Values count:', Object.keys(data.value || {}).length);
      
      return data;
    } catch (error) {
      console.error('💥 [TEST] Test error:', error);
      return null;
    }
  }

  // Metodo semplificato per test - un dataset per volta
  async getTestData(): Promise<ProcessedData[]> {
    console.log('🧪 [TEST-DATA] Inizio test parsing dati...');
    try {
      // Prima facciamo il test basilare
      const testResult = await this.getBasicTest();
      if (!testResult) {
        console.error('🧪 [TEST-DATA] Test basilare fallito');
        return [];
      }
      
      console.log('🧪 [TEST-DATA] Test basilare riuscito, tentativo parsing...');
      // Se il test basilare funziona, proviamo il parsing
      const parsed = this.parseEurostatData(testResult);
      console.log('🧪 [TEST-DATA] Parsing completato:', parsed.length, 'elementi');
      return parsed;
    } catch (error) {
      console.error('🧪 [TEST-DATA] Errore nel test dataset:', error);
      return [];
    }
  }

  // Metodo per ottenere tutti i dati principali
  async getAllMainData() {
    console.log('🚀 [MAIN] Inizio caricamento completo dati...');
    try {
      console.log('🔄 [MAIN] Iniziando caricamento dati sequenziale...');
      
      const result = {
        gdp: [] as ProcessedData[],
        population: [] as ProcessedData[],
        unemployment: [] as ProcessedData[],
        inflation: [] as ProcessedData[],
        energy: [] as ProcessedData[]
      };

      // Caricamento sequenziale per debug
      try {
        console.log('🔄 [MAIN] === CARICANDO PIL ===');
        result.gdp = await this.getGDPData();
        console.log('🔄 [MAIN] PIL caricato:', result.gdp.length, 'elementi');
      } catch (error) {
        console.error('🔄 [MAIN] Errore PIL:', error);
      }

      try {
        console.log('🔄 [MAIN] === CARICANDO POPOLAZIONE ===');
        result.population = await this.getPopulationData();
        console.log('🔄 [MAIN] Popolazione caricata:', result.population.length, 'elementi');
      } catch (error) {
        console.error('🔄 [MAIN] Errore popolazione:', error);
      }

      try {
        console.log('🔄 [MAIN] === CARICANDO DISOCCUPAZIONE ===');
        result.unemployment = await this.getUnemploymentData();
        console.log('🔄 [MAIN] Disoccupazione caricata:', result.unemployment.length, 'elementi');
      } catch (error) {
        console.error('🔄 [MAIN] Errore disoccupazione:', error);
      }

      try {
        console.log('🔄 [MAIN] === CARICANDO INFLAZIONE ===');
        result.inflation = await this.getInflationData();
        console.log('🔄 [MAIN] Inflazione caricata:', result.inflation.length, 'elementi');
      } catch (error) {
        console.error('🔄 [MAIN] Errore inflazione:', error);
      }

      try {
        console.log('🔄 [MAIN] === CARICANDO ENERGIA ===');
        result.energy = await this.getEnergyData();
        console.log('🔄 [MAIN] Energia caricata:', result.energy.length, 'elementi');
      } catch (error) {
        console.error('🔄 [MAIN] Errore energia:', error);
      }
      
      console.log('🔄 [MAIN] CARICAMENTO COMPLETATO - Risultati finali:', {
        gdp: result.gdp.length,
        population: result.population.length,
        unemployment: result.unemployment.length,
        inflation: result.inflation.length,
        energy: result.energy.length
      });
      
      return result;
    } catch (error) {
      console.error('🔄 [MAIN] Errore nel recupero di tutti i dati:', error);
      throw error;
    }
  }
}

// Esporta istanza singleton
export const eurostatAPI = new EurostatAPI();

// Log per verificare che il modulo sia caricato
console.log('🌍 [EUROSTAT] Modulo eurostat.ts caricato correttamente');
console.log('🌍 [EUROSTAT] EurostatAPI istanza creata:', !!eurostatAPI);

// Funzione di utilità per formattare numeri
export const formatValue = (value: number, type: 'currency' | 'percentage' | 'number'): string => {
  switch (type) {
    case 'currency':
      return new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'EUR',
        notation: 'compact',
        maximumFractionDigits: 1
      }).format(value);
    case 'percentage':
      return `${value.toFixed(1)}%`;
    case 'number':
      return new Intl.NumberFormat('it-IT', {
        notation: 'compact',
        maximumFractionDigits: 1
      }).format(value);
    default:
      return value.toString();
  }
};
