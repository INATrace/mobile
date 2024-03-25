export const PlotSchema = {
  name: 'Plot',
  properties: {
    id: 'string',
    farmerId: 'string',
    userId: 'string',
    data: 'string',
  },
  primaryKey: 'id',
};

export const FarmerSchema = {
  name: 'Farmer',
  properties: {
    id: 'string',
    userId: 'string',
    companyId: 'string',
    data: 'string',
    name: 'string',
    surname: 'string',
  },
  primaryKey: 'id',
};

export const NewFarmerSchema = {
  name: 'Farmer',
  properties: {
    id: 'string',
    userId: 'string',
    companyId: 'string',
    data: 'string',
    name: 'string',
    surname: 'string',
  },
  primaryKey: 'id',
};
