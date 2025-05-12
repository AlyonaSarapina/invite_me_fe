import { Instance, types } from "mobx-state-tree";
import { UserRole } from "@/types/enums";

export const UserModel = types.model("UserModel", {
  id: types.identifierNumber,
  name: types.string,
  email: types.string,
  phone: types.string,
  role: types.enumeration(Object.values(UserRole)),
  profile_pic_url: types.maybeNull(types.string),
  date_of_birth: types.maybeNull(types.string),
});

export interface IUser extends Instance<typeof UserModel> {}
