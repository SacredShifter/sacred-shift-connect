export interface CosmicStructure {
  id: string;
  name: string;
  type: 'galaxy' | 'nebula' | 'star_cluster' | 'quasar' | 'black_hole' | 'pulsar';
  coordinates: {
    rightAscension: number; // hours
    declination: number; // degrees
    distance?: number; // light years
  };
  physicalProperties: {
    mass?: number; // solar masses
    diameter?: number; // light years
    temperature?: number; // Kelvin
    luminosity?: number; // solar luminosities
    spectralClass?: string;
  };
  audioMapping: {
    baseFrequency: number; // Hz
    harmonicSeries: number[];
    amplitude: number; // 0-1
    duration: number; // seconds
  };
  discoveryInfo: {
    discoveryDate?: string;
    observatory?: string;
    catalogId?: string;
    confidence: 'confirmed' | 'probable' | 'theoretical';
  };
}

export interface CosmicDataResponse {
  timestamp: number;
  structures: CosmicStructure[];
  observatoryStatus: {
    jwst: boolean;
    hubble: boolean;
    chandra: boolean;
    spitzer: boolean;
  };
  dataQuality: number; // 0-1
}

export class CosmicDataStream {
  private isStreaming = false;
  private streamingInterval: number | null = null;
  private listeners: Set<(data: CosmicDataResponse) => void> = new Set();
  private cachedStructures: CosmicStructure[] = [];
  
  // Mock observatory APIs (would be real endpoints in production)
  private readonly API_ENDPOINTS = {
    jwst: 'https://api.jwst.nasa.gov/data',
    hubble: 'https://api.hubblesite.org/data',
    chandra: 'https://api.chandra.harvard.edu/data',
    vizier: 'https://vizier.u-strasbg.fr/viz-bin/asu-xml'
  };

  constructor() {
    this.initializeCosmicDatabase();
  }

  /**
   * Initialize with known cosmic structures
   */
  private initializeCosmicDatabase(): void {
    this.cachedStructures = [
      {
        id: 'andromeda_galaxy',
        name: 'Andromeda Galaxy (M31)',
        type: 'galaxy',
        coordinates: {
          rightAscension: 0.712, // 00h 42m 44.3s
          declination: 41.269, // +41° 16′ 09″
          distance: 2537000 // light years
        },
        physicalProperties: {
          mass: 1.5e12, // solar masses
          diameter: 220000, // light years
          luminosity: 25.4e9
        },
        audioMapping: {
          baseFrequency: 55, // A1
          harmonicSeries: [1, 1.618, 2, 2.618, 3, 4, 5.236], // Golden ratio harmonics
          amplitude: 0.7,
          duration: 300 // 5 minutes
        },
        discoveryInfo: {
          discoveryDate: '964 AD',
          observatory: 'Abd al-Rahman al-Sufi',
          catalogId: 'M31, NGC 224',
          confidence: 'confirmed'
        }
      },
      {
        id: 'orion_nebula',
        name: 'Orion Nebula (M42)',
        type: 'nebula',
        coordinates: {
          rightAscension: 5.590, // 05h 35m 24s
          declination: -5.391, // −05° 23′ 28″
          distance: 1344
        },
        physicalProperties: {
          diameter: 24, // light years
          temperature: 10000, // Kelvin
          mass: 2000 // solar masses
        },
        audioMapping: {
          baseFrequency: 110, // A2
          harmonicSeries: [1, 2, 3, 4, 5, 6, 7, 8],
          amplitude: 0.8,
          duration: 180
        },
        discoveryInfo: {
          discoveryDate: '1610',
          observatory: 'Nicolas-Claude Fabri de Peiresc',
          catalogId: 'M42, NGC 1976',
          confidence: 'confirmed'
        }
      },
      {
        id: 'sagittarius_a_star',
        name: 'Sagittarius A*',
        type: 'black_hole',
        coordinates: {
          rightAscension: 17.761, // 17h 45m 40.0s
          declination: -29.008, // −29° 00′ 28″
          distance: 26000
        },
        physicalProperties: {
          mass: 4.154e6, // solar masses (supermassive black hole)
          diameter: 0.000008 // Schwarzschild radius in light years
        },
        audioMapping: {
          baseFrequency: 27.5, // A0
          harmonicSeries: [1, 0.5, 0.25, 0.125], // Sub-harmonics for black hole
          amplitude: 0.9,
          duration: 600 // 10 minutes
        },
        discoveryInfo: {
          discoveryDate: '1974',
          observatory: 'Very Large Array',
          catalogId: 'Sgr A*',
          confidence: 'confirmed'
        }
      },
      {
        id: 'pleiades_cluster',
        name: 'Pleiades (M45)',
        type: 'star_cluster',
        coordinates: {
          rightAscension: 3.790, // 03h 47m 24s
          declination: 24.117, // +24° 07′ 00″
          distance: 444
        },
        physicalProperties: {
          diameter: 17.5,
          mass: 800,
          temperature: 20000
        },
        audioMapping: {
          baseFrequency: 220, // A3
          harmonicSeries: [1, 1.5, 2, 2.5, 3, 4, 5, 6, 7], // Rich harmonics
          amplitude: 0.6,
          duration: 240
        },
        discoveryInfo: {
          discoveryDate: 'Prehistoric',
          observatory: 'Naked eye observation',
          catalogId: 'M45, NGC 1432',
          confidence: 'confirmed'
        }
      },
      {
        id: 'crab_nebula',
        name: 'Crab Nebula (M1)',
        type: 'nebula',
        coordinates: {
          rightAscension: 5.575, // 05h 34m 31.94s
          declination: 22.015, // +22° 00′ 52.2″
          distance: 6500
        },
        physicalProperties: {
          diameter: 11,
          mass: 4.6,
          temperature: 15000
        },
        audioMapping: {
          baseFrequency: 440, // A4
          harmonicSeries: [1, 2.3, 3.8, 5.2, 7.1, 9.4], // Irregular pulsar harmonics
          amplitude: 0.75,
          duration: 150
        },
        discoveryInfo: {
          discoveryDate: '1054 AD',
          observatory: 'Chinese astronomers',
          catalogId: 'M1, NGC 1952',
          confidence: 'confirmed'
        }
      },
      {
        id: 'vega_star',
        name: 'Vega (Alpha Lyrae)',
        type: 'star_cluster', // Using as single star
        coordinates: {
          rightAscension: 18.615, // 18h 36m 56.3s
          declination: 38.784, // +38° 47′ 01″
          distance: 25
        },
        physicalProperties: {
          mass: 2.135,
          diameter: 0.000000234, // ~2.36 solar radii in light years
          temperature: 9602,
          luminosity: 40.12
        },
        audioMapping: {
          baseFrequency: 880, // A5
          harmonicSeries: [1, 2, 3, 4, 5, 6, 8, 10],
          amplitude: 0.5,
          duration: 120
        },
        discoveryInfo: {
          discoveryDate: 'Prehistoric',
          observatory: 'Naked eye',
          catalogId: 'HR 7001, HD 172167',
          confidence: 'confirmed'
        }
      }
    ];
  }

  /**
   * Start streaming cosmic data
   */
  startStreaming(): void {
    if (this.isStreaming) return;

    this.isStreaming = true;
    this.streamingInterval = window.setInterval(() => {
      this.fetchCosmicData();
    }, 5000); // Update every 5 seconds

    // Initial fetch
    this.fetchCosmicData();
  }

  /**
   * Stop streaming cosmic data
   */
  stopStreaming(): void {
    this.isStreaming = false;
    if (this.streamingInterval) {
      clearInterval(this.streamingInterval);
      this.streamingInterval = null;
    }
  }

  /**
   * Fetch current cosmic data (simulated with real-time variations)
   */
  private async fetchCosmicData(): Promise<void> {
    try {
      // In production, this would make real API calls
      const enhancedStructures = this.enhanceWithRealTimeData(this.cachedStructures);
      
      const response: CosmicDataResponse = {
        timestamp: Date.now(),
        structures: enhancedStructures,
        observatoryStatus: {
          jwst: Math.random() > 0.1, // 90% uptime
          hubble: Math.random() > 0.15, // 85% uptime
          chandra: Math.random() > 0.2, // 80% uptime
          spitzer: false // Decommissioned
        },
        dataQuality: 0.7 + Math.random() * 0.3 // 70-100% quality
      };

      // Notify listeners
      this.listeners.forEach(callback => callback(response));
      
    } catch (error) {
      console.error('Failed to fetch cosmic data:', error);
    }
  }

  /**
   * Enhance cached structures with real-time astronomical data
   */
  private enhanceWithRealTimeData(structures: CosmicStructure[]): CosmicStructure[] {
    return structures.map(structure => {
      const enhanced = { ...structure };
      
      // Simulate real-time variations in observable properties
      const time = Date.now() / 1000;
      const variation = Math.sin(time * 0.001 + Math.random()) * 0.1;
      
      // Vary luminosity for variable objects
      if (enhanced.physicalProperties.luminosity) {
        enhanced.physicalProperties.luminosity *= (1 + variation);
      }
      
      // Vary audio mapping based on current observations
      enhanced.audioMapping = {
        ...enhanced.audioMapping,
        amplitude: Math.max(0.1, Math.min(1.0, enhanced.audioMapping.amplitude + variation * 0.2)),
        baseFrequency: enhanced.audioMapping.baseFrequency * (1 + variation * 0.05)
      };
      
      return enhanced;
    });
  }

  /**
   * Get structure by ID
   */
  getStructureById(id: string): CosmicStructure | null {
    return this.cachedStructures.find(s => s.id === id) || null;
  }

  /**
   * Search structures by name or type
   */
  searchStructures(query: string): CosmicStructure[] {
    const lowercaseQuery = query.toLowerCase();
    return this.cachedStructures.filter(structure =>
      structure.name.toLowerCase().includes(lowercaseQuery) ||
      structure.type.toLowerCase().includes(lowercaseQuery) ||
      structure.discoveryInfo.catalogId?.toLowerCase().includes(lowercaseQuery)
    );
  }

  /**
   * Get structures within distance range (light years)
   */
  getStructuresInRange(minDistance: number, maxDistance: number): CosmicStructure[] {
    return this.cachedStructures.filter(structure => {
      const distance = structure.coordinates.distance;
      return distance && distance >= minDistance && distance <= maxDistance;
    });
  }

  /**
   * Calculate angular distance between two cosmic structures
   */
  calculateAngularDistance(struct1: CosmicStructure, struct2: CosmicStructure): number {
    const ra1 = struct1.coordinates.rightAscension * 15; // Convert hours to degrees
    const dec1 = struct1.coordinates.declination;
    const ra2 = struct2.coordinates.rightAscension * 15;
    const dec2 = struct2.coordinates.declination;
    
    // Haversine formula for angular distance on celestial sphere
    const dRA = (ra2 - ra1) * Math.PI / 180;
    const dDec = (dec2 - dec1) * Math.PI / 180;
    const dec1Rad = dec1 * Math.PI / 180;
    const dec2Rad = dec2 * Math.PI / 180;
    
    const a = Math.sin(dDec / 2) ** 2 + 
              Math.cos(dec1Rad) * Math.cos(dec2Rad) * Math.sin(dRA / 2) ** 2;
    
    return 2 * Math.asin(Math.sqrt(a)) * 180 / Math.PI; // Return in degrees
  }

  /**
   * Generate GAA preset from cosmic structure
   */
  generateGAAPreset(structure: CosmicStructure): any {
    const { audioMapping, physicalProperties, coordinates } = structure;
    
    // Convert astronomical properties to GAA parameters
    const distanceNorm = Math.log10((coordinates.distance || 1000) / 1000) / 3; // Normalize log distance
    const massNorm = Math.log10((physicalProperties.mass || 1) / 1e6) / 6; // Normalize log mass
    
    return {
      id: `gaa_${structure.id}`,
      label: `${structure.name} - Cosmic Resonance`,
      params: {
        R: 1 + distanceNorm * 0.5, // Scale based on distance
        r: 0.3 + massNorm * 0.4, // Scale based on mass
        n: Math.floor(3 + audioMapping.harmonicSeries.length / 2), // Harmonic complexity
        phi0: (coordinates.rightAscension / 24) * 2 * Math.PI, // RA as initial phase
        omega: audioMapping.baseFrequency / 440, // Frequency ratio to A440
        eta: 0.1 + (coordinates.declination + 90) / 180 * 0.8, // Declination coupling
        kappaRef: 0.3 + distanceNorm * 0.4,
        tauRef: 0.5 + massNorm * 0.5,
        alpha: [
          0.1 + distanceNorm * 0.2,
          0.2 + massNorm * 0.1,
          0.15 + audioMapping.amplitude * 0.2,
          0.1 + (physicalProperties.temperature || 5000) / 50000
        ],
        beta: [
          0.4 + audioMapping.amplitude * 0.3,
          0.5 + distanceNorm * 0.2
        ],
        gamma: [
          0.6 + massNorm * 0.2,
          0.7 + audioMapping.amplitude * 0.1
        ],
        Lmin: 0.0,
        Lmax: 1.0
      },
      polarity: {
        polarityEnabled: structure.type === 'black_hole' || structure.type === 'nebula',
        shadowMode: structure.type === 'black_hole',
        darkWeight: structure.type === 'black_hole' ? 0.9 : 0.3,
        lightWeight: structure.type === 'black_hole' ? 0.1 : 0.7,
        darkEnergyEnabled: ['black_hole', 'galaxy'].includes(structure.type),
        darkEnergy: {
          driftRate: structure.type === 'black_hole' ? 0.001 : 0.0001,
          depth: structure.type === 'black_hole' ? 0.8 : 0.2
        },
        manifestDarkPhase: {
          duration: audioMapping.duration,
          intensity: structure.type === 'black_hole' ? 0.9 : 0.3,
          curve: structure.type === 'pulsar' ? 'exp' : 'linear'
        }
      },
      evidence: {
        status: 'multi-source' as const,
        refs: [
          {
            title: `${structure.name} - Astronomical Database`,
            doiOrUrl: `https://simbad.u-strasbg.fr/simbad/sim-id?Ident=${structure.discoveryInfo.catalogId?.split(',')[0]}`,
            summary: `Observational data from ${structure.discoveryInfo.observatory}`
          }
        ]
      }
    };
  }

  /**
   * Add listener for cosmic data updates
   */
  addListener(callback: (data: CosmicDataResponse) => void): void {
    this.listeners.add(callback);
  }

  /**
   * Remove listener
   */
  removeListener(callback: (data: CosmicDataResponse) => void): void {
    this.listeners.delete(callback);
  }

  /**
   * Get all cached structures
   */
  getAllStructures(): CosmicStructure[] {
    return [...this.cachedStructures];
  }

  /**
   * Check if currently streaming
   */
  get streaming(): boolean {
    return this.isStreaming;
  }
}