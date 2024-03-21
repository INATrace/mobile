export interface Plot {
  id: string;
  plotName: string;
  crop: string;
  numberOfPlants: number;
  unit: string;
  size: number;
  geoId: string;
  certification: string;
  organicStartOfTransition: string;
  featureInfo: FeatureInfo;
}

export interface FeatureInfo {
  type: 'Feature';
  properties: any;
  id: string;
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
}
