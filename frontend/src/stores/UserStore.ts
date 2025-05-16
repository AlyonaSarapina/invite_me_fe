import { types, flow, Instance } from "mobx-state-tree";
import { api } from "@/utils/axios";
import { UserModel } from "./models/UserModel";

export const UserStore = types
  .model("UserStore", {
    user: types.maybeNull(UserModel),
    loading: types.optional(types.boolean, false),
    error: types.maybe(types.string),
  })
  .views((self) => ({
    get isOwner() {
      return self.user?.role === "owner";
    },
    get isClient() {
      return self.user?.role === "client";
    },
  }))
  .actions((self) => {
    const checkAuth = flow(function* () {
      const token = localStorage.getItem("token");

      if (!token) {
        removeUser();
        return;
      }

      self.loading = true;
      try {
        const { data: user } = yield api.get("/users/me");
        self.user = user;
      } catch (err) {
        console.error("Session restore failed", err);
        localStorage.removeItem("token");
        removeUser();
      } finally {
        self.loading = false;
      }
    });

    const updateUser = flow(function* (updates: Partial<typeof UserModel>) {
      try {
        const { data } = yield api.patch("users/me", updates);
        self.user = data;
      } catch (err) {
        console.error("Failed to update user:", err);
        throw err;
      }
    });

    const uploadProfilePic = flow(function* (
      file: File,
      onProgress?: (progress: number) => void
    ) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const { data } = yield api.patch("users/me/file", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            onProgress?.(percent);
          },
        });

        self.user = data;
      } catch (err) {
        console.error("Failed to upload profile picture:", err);
        throw err;
      }
    });

    const removeUser = () => {
      self.user = null;
    };

    return { checkAuth, updateUser, uploadProfilePic, removeUser };
  });

export interface IUserStore extends Instance<typeof UserStore> {}
export const userStore = UserStore.create({});
