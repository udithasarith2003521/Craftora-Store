'use client';

import { useState, useRef, useEffect } from 'react';
import { upload } from '@vercel/blob/client';
import {
  FileArchive,
  UploadCloud,
  X,
  CheckCircle2,
  RotateCw,
  AlertCircle,
  Link as LinkIcon,
  HardDrive,
  ExternalLink,
} from 'lucide-react';
import { formatBytes, getGoogleDriveFileId, formatDownloadUrl } from '@/lib/utils';
import { toast } from 'sonner';

interface FileUploaderProps {
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  onFileUploaded: (fileData: {
    fileUrl: string;
    fileName: string;
    fileSize: number;
    fileType: string;
  }) => void;
  onFileCleared: () => void;
}

export function FileUploader({
  fileUrl,
  fileName,
  fileSize,
  fileType,
  onFileUploaded,
  onFileCleared,
}: FileUploaderProps) {
  // Tabs: 'gdrive' (Google Drive) or 'upload' (Direct Vercel Blob)
  const isExistingGdrive = Boolean(getGoogleDriveFileId(fileUrl));
  const [tab, setTab] = useState<'gdrive' | 'upload'>(isExistingGdrive ? 'gdrive' : 'gdrive');

  // Google Drive custom fields
  const [gdriveUrl, setGdriveUrl] = useState(isExistingGdrive ? fileUrl : '');
  const [gdriveName, setGdriveName] = useState(fileName || '');
  const [gdriveSizeNum, setGdriveSizeNum] = useState<number>(
    fileSize ? Math.round(fileSize / (1024 * 1024)) || 100 : 100
  );
  const [gdriveUnit, setGdriveUnit] = useState<'MB' | 'GB'>('MB');
  const [gdriveFormat, setGdriveFormat] = useState(fileType || 'application/zip');

  // File upload state
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const detectedFileId = getGoogleDriveFileId(gdriveUrl);

  const handleApplyGdrive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gdriveUrl.trim()) {
      toast.error('Please paste your Google Drive link');
      return;
    }

    const fileId = getGoogleDriveFileId(gdriveUrl.trim());
    if (!fileId && !gdriveUrl.startsWith('http')) {
      toast.error('Invalid URL. Please paste a valid Google Drive link or web URL.');
      return;
    }

    const multiplier = gdriveUnit === 'GB' ? 1024 * 1024 * 1024 : 1024 * 1024;
    const computedBytes = Math.round(gdriveSizeNum * multiplier);

    const name = gdriveName.trim() || `digital_package_${fileId ? fileId.slice(0, 8) : 'file'}.zip`;

    onFileUploaded({
      fileUrl: gdriveUrl.trim(),
      fileName: name,
      fileSize: computedBytes,
      fileType: gdriveFormat,
    });

    toast.success('Google Drive package linked successfully!');
  };

  const startUpload = async (file: File) => {
    // 500MB maximum
    const maxSizeBytes = 500 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast.error('File size exceeds 500MB limit');
      setError('File size exceeds 500MB limit');
      return;
    }

    setCurrentFile(file);
    setUploading(true);
    setProgress(0);
    setError(null);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/admin/upload',
        clientPayload: JSON.stringify({ uploadType: 'file' }),
        onUploadProgress: ({ percentage }) => {
          setProgress(Math.round(percentage));
        },
      });

      onFileUploaded({
        fileUrl: blob.url,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type || 'application/octet-stream',
      });

      toast.success(`Successfully uploaded ${file.name}`);
      setProgress(100);
      setUploading(false);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        toast.info('Upload cancelled');
        setError('Upload cancelled by user');
      } else {
        console.error('File upload error:', err);
        // Fallback for local mock/demo testing if Blob token is placeholder
        if (err?.message?.includes('mock') || !process.env.BLOB_READ_WRITE_TOKEN) {
          const mockUrl = URL.createObjectURL(file);
          onFileUploaded({
            fileUrl: mockUrl,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type || 'application/octet-stream',
          });
          setProgress(100);
          toast.success(`Simulated local upload for ${file.name}`);
        } else {
          setError(err.message || 'File upload failed');
          toast.error(`Upload failed: ${err.message || 'Unknown error'}`);
        }
      }
      setUploading(false);
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setUploading(false);
    setProgress(0);
  };

  const handleRetry = () => {
    if (currentFile) {
      startUpload(currentFile);
    }
  };

  return (
    <div className="space-y-4">
      {/* If file is already configured / attached */}
      {fileUrl && !uploading ? (
        <div className="p-4 rounded-xl glass-panel border border-cyan-accent/40 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-lg bg-cyan-accent/10 border border-cyan-accent/30 flex items-center justify-center text-cyan-accent shrink-0">
              <FileArchive className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <div className="font-heading text-sm font-semibold text-text-primary truncate flex items-center gap-2">
                <span>{fileName || 'Digital Package'}</span>
                {getGoogleDriveFileId(fileUrl) && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Google Drive
                  </span>
                )}
              </div>
              <div className="text-xs font-mono text-text-muted flex items-center gap-2 mt-0.5">
                <span>{formatBytes(fileSize)}</span>
                <span>•</span>
                <span className="uppercase text-cyan-accent">
                  {fileType.split('/')[1] || fileType}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" /> Ready for direct download
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onFileCleared}
            className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-white border border-rose-500/20 transition-all ml-3 shrink-0"
            title="Replace or Remove Package"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Selector Box */
        <div className="rounded-2xl glass-panel border border-border-subtle p-5 space-y-4">
          {/* Storage method tab selector */}
          <div className="flex items-center gap-2 pb-3 border-b border-border-subtle text-xs font-mono">
            <button
              type="button"
              onClick={() => setTab('gdrive')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
                tab === 'gdrive'
                  ? 'bg-cyan-blue-gradient text-white font-bold shadow-neon-blue'
                  : 'bg-background-surface text-text-secondary hover:text-text-primary'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>Google Drive Link (Free Storage)</span>
            </button>

            <button
              type="button"
              onClick={() => setTab('upload')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
                tab === 'upload'
                  ? 'bg-cyan-blue-gradient text-white font-bold shadow-neon-blue'
                  : 'bg-background-surface text-text-secondary hover:text-text-primary'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Direct File Upload (Vercel Blob)</span>
            </button>
          </div>

          {/* TAB 1: Google Drive Link */}
          {tab === 'gdrive' && (
            <div className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-mono text-text-secondary uppercase mb-1.5 flex items-center justify-between">
                  <span>Google Drive Share Link *</span>
                  {detectedFileId && (
                    <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Valid File ID: {detectedFileId.slice(0, 10)}...
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={gdriveUrl}
                    onChange={(e) => setGdriveUrl(e.target.value)}
                    placeholder="https://drive.google.com/file/d/1A2B3C4D5E.../view?usp=sharing"
                    className="w-full px-4 py-2.5 pl-9 rounded-xl bg-background-surface border border-border-subtle focus:border-cyan-accent focus:outline-none text-text-primary text-xs font-mono"
                  />
                  <LinkIcon className="w-3.5 h-3.5 text-cyan-accent absolute left-3 top-3" />
                </div>
                <p className="text-[11px] text-text-muted font-sans mt-1">
                  Upload your file to Google Drive, right-click &gt; <strong>Share &gt; Anyone with the link can view</strong>, and paste the URL here. Craftora automatically converts it into a high-speed direct download link.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* File Name */}
                <div className="sm:col-span-1">
                  <label className="block text-xs font-mono text-text-secondary uppercase mb-1.5">
                    File Display Name
                  </label>
                  <input
                    type="text"
                    value={gdriveName}
                    onChange={(e) => setGdriveName(e.target.value)}
                    placeholder="e.g. AssetPackage_v1.zip"
                    className="w-full px-3 py-2 rounded-xl bg-background-surface border border-border-subtle focus:border-cyan-accent focus:outline-none text-text-primary text-xs font-mono"
                  />
                </div>

                {/* File Size */}
                <div className="sm:col-span-1">
                  <label className="block text-xs font-mono text-text-secondary uppercase mb-1.5">
                    Estimated File Size
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={1}
                      value={gdriveSizeNum}
                      onChange={(e) => setGdriveSizeNum(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-background-surface border border-border-subtle focus:border-cyan-accent focus:outline-none text-text-primary text-xs font-mono"
                    />
                    <select
                      value={gdriveUnit}
                      onChange={(e) => setGdriveUnit(e.target.value as any)}
                      className="px-2 py-2 rounded-xl bg-background-surface border border-border-subtle text-xs font-mono text-cyan-accent"
                    >
                      <option value="MB">MB</option>
                      <option value="GB">GB</option>
                    </select>
                  </div>
                </div>

                {/* File Type */}
                <div className="sm:col-span-1">
                  <label className="block text-xs font-mono text-text-secondary uppercase mb-1.5">
                    Format / Type
                  </label>
                  <select
                    value={gdriveFormat}
                    onChange={(e) => setGdriveFormat(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-background-surface border border-border-subtle focus:border-cyan-accent focus:outline-none text-text-primary text-xs font-mono"
                  >
                    <option value="application/zip">ZIP Archive (.zip)</option>
                    <option value="application/x-rar-compressed">RAR Archive (.rar)</option>
                    <option value="application/x-7z-compressed">7Z Archive (.7z)</option>
                    <option value="application/pdf">PDF Document (.pdf)</option>
                    <option value="image/vnd.adobe.photoshop">PSD / Photoshop (.psd)</option>
                    <option value="application/octet-stream">Software / Executable (.exe/.dmg)</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={handleApplyGdrive}
                disabled={!gdriveUrl.trim()}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Link Google Drive Package</span>
              </button>
            </div>
          )}

          {/* TAB 2: Direct Upload */}
          {tab === 'upload' && (
            <div
              onClick={() => !uploading && fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!uploading && e.dataTransfer.files?.[0]) {
                  startUpload(e.dataTransfer.files[0]);
                }
              }}
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 ${
                uploading
                  ? 'border-cyan-accent/80 bg-background-elevated/80 cursor-default'
                  : 'border-border-subtle hover:border-cyan-accent/60 bg-background-surface/50 hover:bg-background-elevated/80 cursor-pointer'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    startUpload(e.target.files[0]);
                  }
                }}
                className="hidden"
              />

              {!uploading ? (
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="w-12 h-12 rounded-xl bg-cyan-accent/10 border border-cyan-accent/20 flex items-center justify-center text-cyan-accent group-hover:scale-110 transition-all">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div className="font-heading text-sm font-semibold text-text-primary">
                    Click or Drag Digital Package File
                  </div>
                  <p className="text-xs text-text-muted font-mono">
                    ZIP, RAR, 7Z, PDF, PSD, FIGMA, BLEND, etc. • Max 500MB
                  </p>
                </div>
              ) : (
                /* Uploading state with real progress bar */
                <div className="space-y-4 max-w-md mx-auto">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-cyan-accent truncate max-w-[220px]">
                      {currentFile?.name}
                    </span>
                    <span className="text-text-primary font-bold">{progress}%</span>
                  </div>

                  {/* Progress bar track */}
                  <div className="w-full h-2.5 rounded-full bg-background-deep border border-border-subtle overflow-hidden relative">
                    <div
                      className="h-full bg-cyan-blue-gradient transition-all duration-150 shadow-neon-cyan"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono text-text-muted">
                    <span>{currentFile ? formatBytes(currentFile.size) : ''}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancel();
                      }}
                      className="text-rose-400 hover:text-rose-300 underline font-semibold"
                    >
                      Cancel Upload
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {error && !uploading && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-mono text-rose-400">
              <span className="truncate">{error}</span>
              {currentFile && (
                <button
                  type="button"
                  onClick={handleRetry}
                  className="flex items-center gap-1 text-cyan-accent hover:underline shrink-0 ml-2"
                >
                  <RotateCw className="w-3 h-3" /> Retry
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
