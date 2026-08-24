import type {
  CreateVehicleInput,
  UpdateVehicleInput,
  VehicleListFilters,
  VehicleRecordWithRelations,
} from './vehicle.types';

export const VEHICLE_REPOSITORY = Symbol('VEHICLE_REPOSITORY');

export interface VehicleRepository {
  create(input: CreateVehicleInput): Promise<VehicleRecordWithRelations>;
  findAll(filters: VehicleListFilters): Promise<VehicleRecordWithRelations[]>;
  findById(id: string): Promise<VehicleRecordWithRelations | null>;
  findByPlate(plate: string): Promise<VehicleRecordWithRelations | null>;
  update(id: string, input: UpdateVehicleInput): Promise<VehicleRecordWithRelations>;
}
