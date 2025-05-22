import { useState } from "react";
import { toast } from "react-toastify";

type Props = {
  id?: number | null;
  imageUrl: string | null;
  onUploadedUrl?: (url: string) => void;
  onUpload: (
    file: File,
    setProgress: (p: number) => void,
    id?: number | undefined
  ) => Promise<void>;
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
      <div className="position-relative d-inline-block mb-2">
        <img
          src={imageUrl || (id ? "./default-restaurant.png" : "./user.png")}
          alt="Uploaded"
          className="img-fluid rounded-circle"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            objectFit: "contain",
          }}
        />

        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleUpload}
          style={{ display: "none" }}
          disabled={uploading}
        />

        <label
          htmlFor="image-upload"
          className="position-absolute bottom-0 end-0 text-primary p-1"
          title="Change photo"
          style={{ cursor: "pointer" }}
        >
          <i
            className={`fa-solid ${iconClassName}`}
            style={{ fontSize: "36px" }}
          ></i>
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
