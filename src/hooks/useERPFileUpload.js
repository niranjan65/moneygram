import { useState, useCallback } from "react";

export const useERPFileUpload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadFile = useCallback(async (file, options = {}) => {
    if (!file) {
      setError("No file provided");
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      const {
        isPrivate = 0,
        doctype = "Currency Exchange For Customer",
        docname = null,
        fieldname = null,
      } = options;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("is_private", isPrivate);
      // formData.append("doctype", doctype);

      // if (docname) formData.append("docname", docname);
      // if (fieldname) formData.append("fieldname", fieldname);

      const response = await fetch(
        "http://192.168.101.182:81/api/method/upload_file",
        {
          method: "POST",
           headers: {
              "Authorization": "token 661457e17b8612a:32a5ddcc5a9c177"
            },
          // credentials: "include",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("File upload failed");
      }

      const data = await response.json();

      if (!data?.message?.file_url) {
        throw new Error("Invalid ERP response");
      }

      return data.message.file_url;
    } catch (err) {
      setError(err.message || "Upload failed");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    uploadFile,
    loading,
    error,
  };
};