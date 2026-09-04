import { Model, Document, FilterQuery, QueryOptions } from "mongoose";
import { TenantUser, buildTenantFilter } from "./tenancy";

export function tenantFind<T extends Document>(
  Model: Model<T>,
  user: TenantUser,
  extraFilter: FilterQuery<T> = {},
  options: QueryOptions = {}
) {
  const tenantFilter = buildTenantFilter(user);
  return Model.find({ ...tenantFilter, ...extraFilter } as FilterQuery<T>, null, options);
}

export function tenantFindOne<T extends Document>(
  Model: Model<T>,
  user: TenantUser,
  extraFilter: FilterQuery<T> = {},
  options: QueryOptions = {}
) {
  const tenantFilter = buildTenantFilter(user);
  return Model.findOne({ ...tenantFilter, ...extraFilter } as FilterQuery<T>, null, options);
}

export function tenantCount<T extends Document>(
  Model: Model<T>,
  user: TenantUser,
  extraFilter: FilterQuery<T> = {}
) {
  const tenantFilter = buildTenantFilter(user);
  return Model.countDocuments({ ...tenantFilter, ...extraFilter } as FilterQuery<T>);
}

export function tenantAggregate<T extends Document>(
  Model: Model<T>,
  user: TenantUser,
  extraPipeline: Record<string, unknown>[] = []
) {
  const tenantFilter = buildTenantFilter(user);
  const matchStage = Object.keys(tenantFilter).length > 0 ? [{ $match: tenantFilter }] : [];
  return Model.aggregate([...matchStage, ...extraPipeline] as any[]);
}
