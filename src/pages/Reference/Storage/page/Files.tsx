import { ChangeEvent, FormEvent, useState } from "react";
import { useUploadFileMutation, useReadFileQuery } from "../reducers/files";

import { skipToken } from "@reduxjs/toolkit/query";
import { useParams } from "react-router";

interface UploadResponse {
  url: string;
}

const Files: React.FC = () => {
  const { id } = useParams();
  const userTypeId = String(id);
  const entityId = userTypeId;
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const [uploadFile, { data, isLoading }] = useUploadFileMutation();
  const { data: fileData, isLoading: isFileLoading } = useReadFileQuery(
    entityId && fileName ? { entityId, filename: fileName } : skipToken
  );

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (file && entityId) {
      try {
        const result: UploadResponse = await uploadFile({
          entityId,
          file,
        }).unwrap();
        setFileName(result.url.split("/").pop() || null);
      } catch (uploadError) {
        console.error("Upload error:", uploadError);
      }
    }
  };

  const handleDownload = () => {
    if (fileData) {
      const blobUrl = URL.createObjectURL(fileData);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = fileName || "downloaded_file";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="fileInput">File:</label>
          <input
            id="fileInput"
            type="file"
            className="border border-[#ced4da] h-[40px] w-[26%] rounded-md mt-[10px] ml-[3.2%]"
            onChange={handleFileChange}
          />
        </div>
        <button
          type="submit"
          className="border bg-[#1976d2] text-[white] px-[40px] py-[5px] rounded-lg mt-[10px]"
          disabled={isLoading}
        >
          {isLoading ? "Uploading..." : "Send Request"}
        </button>
      </form>

      {/* {error && (
        <p className="text-red-500">Error: {JSON.stringify(error, null, 2)}</p>
      )} */}
      {data && (
        <p className="text-green-600">
          File uploaded:{" "}
          <a href={data.url} target="_blank" className="underline">
            {data.url}
          </a>
        </p>
      )}

      {fileName && (
        <div>
          <h3>Fetching file content...</h3>
          {isFileLoading && <p>Loading file...</p>}
          {/* {fileError && (
            <p className="text-red-500">
              Error: {JSON.stringify(fileError, null, 2)}
            </p>
          )} */}
          {fileData && (
            <button
              onClick={handleDownload}
              className="bg-green-500 text-white px-4 py-2 rounded-lg mt-2"
            >
              Download File
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Files;
