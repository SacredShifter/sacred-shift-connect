import { useState, useEffect } from 'react';

export interface CosmicAlignmentData {
  sirius: {
    azimuth: number;
    altitude: number;
    visible: boolean;
  };
  orion: {
    azimuth: number;
    altitude: number;
    visible: boolean;
  };
  solstice: {
    isSolstice: boolean;
    type: 'summer' | 'winter' | null;
  };
  lastUpdated: Date;
}

// FIXME: This is a mock API function. In a real implementation, this would fetch
// from a service like NASA's JPL Horizons or a custom astronomical data provider.
const fetchCosmicData = async (): Promise<CosmicAlignmentData> => {
  console.log('Fetching cosmic alignment data (mocked)...');
  // Simulate network delay
  await new Promise(res => setTimeout(res, 500));

  const now = new Date();
  const month = now.getMonth(); // 0-11

  // Simulate Sirius visibility (prominent in Northern Hemisphere winter)
  const isSiriusVisible = month >= 9 || month <= 2; // Oct - Mar

  // Simulate Orion visibility (also a winter constellation)
  const isOrionVisible = month >= 10 || month <= 3; // Nov - Apr

  // Simulate Solstice events
  const day = now.getDate();
  let isSolstice = false;
  let solsticeType: 'summer' | 'winter' | null = null;
  if ((month === 5 && day >= 20 && day <= 22) /* June Solstice */) {
      isSolstice = true;
      solsticeType = 'summer';
  }
  if ((month === 11 && day >= 20 && day <= 22) /* December Solstice */) {
    isSolstice = true;
    solsticeType = 'winter';
  }


  return {
    sirius: {
      azimuth: Math.random() * 360,
      altitude: isSiriusVisible ? Math.random() * 90 : -10,
      visible: isSiriusVisible,
    },
    orion: {
      azimuth: Math.random() * 360,
      altitude: isOrionVisible ? Math.random() * 90 : -10,
      visible: isOrionVisible,
    },
    solstice: {
      isSolstice: isSolstice,
      type: solsticeType,
    },
    lastUpdated: new Date(),
  };
};

export const useCosmicAlignment = (refreshInterval: number = 60000) => {
  const [data, setData] = useState<CosmicAlignmentData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getAndSetData = async () => {
      try {
        setIsLoading(true);
        const cosmicData = await fetchCosmicData();
        setData(cosmicData);
        setError(null);
      } catch (err) {
        setError(err as Error);
        console.error("Failed to fetch cosmic alignment data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    getAndSetData(); // Initial fetch

    const intervalId = setInterval(getAndSetData, refreshInterval);

    return () => clearInterval(intervalId);
  }, [refreshInterval]);

  return { data, isLoading, error };
};
