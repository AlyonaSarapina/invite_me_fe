import { Instance, cast, flow, types } from "mobx-state-tree";
import { api } from "@/utils/axios";
import TableModel from "./models/TableModel";

export const TableStore = types
  .model("TableStore", {
    tables: types.optional(types.array(TableModel), []),
    loading: types.optional(types.boolean, false),
    error: types.maybeNull(types.string),
  })
  .actions((self) => {
    const getTableByRestaurant = flow(function* (restaurantId: number) {
      self.loading = true;
      self.error = null;
      try {
        const res = yield api.get(`/tables/restaurant/${restaurantId}`);
        return res.data;
      } catch (err: any) {
        console.error("Failed to load tables", err);
        self.error = err?.response?.data?.message || "Failed to load tables";
      } finally {
        self.loading = false;
      }
    });

    const createTable = flow(function* (data: any) {
      self.loading = true;
      try {
        const res = yield api.post(`/tables`, data);
        self.tables.push(res.data);
      } catch (err: any) {
        console.error("Failed to create table", err);
        self.error = err?.response?.data?.message || "Failed to create table";
        throw err;
      } finally {
        self.loading = false;
      }
    });
    return { createTable, getTableByRestaurant };
  });

export interface ITableStore extends Instance<typeof TableStore> {}
export const tableStore = TableStore.create({});
