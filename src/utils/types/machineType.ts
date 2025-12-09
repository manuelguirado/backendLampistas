export interface MachineryType {
  name: string;
  description: string;
  brand: string;
  companyID: number;
  model: string;
  clientID: number;
  serialNumber: string;
  maintenanceDate?: Date;
  lastInspectionDate?: Date;
  installedAT?: Date;
  companyName?: string;
  machineType?: string;
}
