export type ExtendedMapping = {
  active: boolean;
  displayName: string;
  isArray: boolean;
  type: string;
  field: string;
  rangeStep?: number;
};

export type ExtendedMappingResults = {
  loading: boolean;
  data: ExtendedMapping[];
};
