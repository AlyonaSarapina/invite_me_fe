import { useStore } from "@/stores/context";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { toast } from "react-toastify";

const ProfilePicUploader = () => {
  const { userStore } = useStore();
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await userStore.uploadProfilePic(file, setProgress);
      toast.success("Profile picture updated successfully");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div>
      {userStore.user?.profile_pic_url && (
        <div className="position-relative d-inline-block mb-2">
          <img
            src={
              userStore.user?.profile_pic_url
                ? userStore.user.profile_pic_url
                : "/user.png"
            }
            alt="Profile"
            className="img-fluid rounded-circle"
            style={{ width: "200px", height: "200px", objectFit: "cover" }}
          />

          <input
            id="profile-pic"
            type="file"
            accept="image/*"
            onChange={handleUpload}
            style={{ display: "none" }}
            disabled={uploading}
          />

          <label
            htmlFor="profile-pic"
            className="position-absolute bottom-0 end-0 text-primary p-1"
            title="Change photo"
            style={{ cursor: "pointer" }}
          >
            <i
              className="fa-solid fa-circle-user"
              style={{
                fontSize: "36px",
              }}
            ></i>
          </label>
        </div>
      )}

      {uploading && (
        <div className="progress mt-2">
          <div
            className="progress-bar progress-bar-striped progress-bar-animated"
            role="progressbar"
            style={{ width: `${progress}%` }}
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            {progress}%
          </div>
        </div>
      )}
    </div>
  );
};

export default observer(ProfilePicUploader);
