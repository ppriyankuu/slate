"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
      setError(null);
    }
  };

  const classifyImage = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/classify", {
        method: "GET",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to classify image");
      }

      setResult(data.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-indigo-500/30">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>

      <div className="z-10 w-full max-w-2xl flex flex-col items-center">
        <h1 className="text-5xl font-extrabold mb-2 tracking-tight bg-gradient-to-br from-indigo-300 via-white to-neutral-400 bg-clip-text text-transparent text-center drop-shadow-lg">
          HOTDOG🌭 or NOT?
        </h1>
        <p className="text-neutral-400 text-lg mb-10 font-light tracking-wide">
          check whether it's a hotdog or not.
        </p>

        <div className="w-full bg-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl transition-all hover:shadow-indigo-500/10 hover:border-white/20">

          {/* Upload Area */}
          <div className="relative group">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div
              className={`w-full h-80 rounded-2xl border-2 border-dashed transition-all duration-300 flex items-center justify-center overflow-hidden relative
                ${preview
                  ? 'border-indigo-500/50 bg-neutral-900'
                  : 'border-white/10 hover:border-indigo-400/50 hover:bg-white/5'
                }`}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-500/20 group-hover:text-indigo-300 transition-all text-neutral-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                  </div>
                  <p className="text-neutral-300 font-medium">Click or drag image to upload</p>
                  <p className="text-neutral-500 text-sm mt-2">Supports JPG, PNG, WEBP</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={classifyImage}
            disabled={!file || loading}
            className={`w-full mt-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2
              ${!file
                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98]'
              }
              ${loading ? 'brightness-75 cursor-wait' : ''}
            `}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Analyzing...
              </>
            ) : (
              'Classify Image'
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-200 rounded-xl text-center text-sm animate-pulse">
              {error}
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
                Results
              </h2>
              <div className="grid gap-3">
                {result.map((item, index) => (
                  <div
                    key={index}
                    className="group bg-white/5 hover:bg-white/10 rounded-xl p-3 flex items-center justify-between border border-white/5 hover:border-indigo-500/30 transition-all"
                  >
                    <span className="text-neutral-200 font-medium capitalize truncate pl-2">{item.label}</span>
                    <div className="flex items-center gap-3 w-1/3">
                      <div className="flex-1 h-2 bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                          style={{ width: `${(item.score * 100).toFixed(1)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-mono text-indigo-300 w-12 text-right">
                        {(item.score * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
