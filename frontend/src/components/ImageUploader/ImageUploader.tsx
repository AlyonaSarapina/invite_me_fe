import { useState } from "react";
import { toast } from "react-toastify";
import styles from "./ImageUploader.module.css";

type Props = {
  id?: number | null;
  imageUrl: string | null;
  onUploadedUrl?: (url: string) => void;
  onUpload: (
    file: File,
    setProgress: (p: number) => void,
    id?: number | undefined
  ) => Promise<any>;
  iconClassName?: string;
  size?: number;
};

const ImageUploader = ({
  id,
  onUploadedUrl,
  imageUrl,
  onUpload,
  iconClassName = "fa-circle-user",
  size = 200,
}: Props) => {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = id
        ? await onUpload(file, setProgress, id)
        : await onUpload(file, setProgress);
      toast.success("Upload successful");

      if (result.logo_url && onUploadedUrl) {
        onUploadedUrl(result.logo_url);
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div>
      <div
        className={`position-relative d-inline-block mb-2 ${styles.imageWrapper}`}
      >
        <img
          src={imageUrl || (id ? "/default-restaurant.png" : "/user.png")}
          alt="Uploaded"
          className={`img-fluid ${styles.imagePreview}`}
          style={{ width: `${size}px`, height: `${size}px` }}
        />

        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className={styles.fileInput}
          disabled={uploading}
        />

        <label
          htmlFor="image-upload"
          className={styles.uploadLabel}
          title="Change photo"
        >
          <i className={`fa-solid ${iconClassName} ${styles.icon}`}></i>
        </label>
      </div>

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

export default ImageUploader;
