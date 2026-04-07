"use client";

import { useCallback, useId, useRef, useState, type ChangeEvent, type DragEvent } from "react";

const ACCEPT_ATTR =
  ".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png";

function isAllowedLeaseFile(file: File): boolean {
  const n = file.name.toLowerCase();
  if (n.endsWith(".pdf") || n.endsWith(".docx")) return true;
  if (n.endsWith(".jpg") || n.endsWith(".jpeg") || n.endsWith(".png")) return true;
  const t = file.type;
  if (
    t === "application/pdf" ||
    t === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    t === "image/jpeg" ||
    t === "image/png"
  ) {
    return true;
  }
  return false;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export interface LeaseFileUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  /** When false, drop zone and browse are inert (e.g. tenant record incomplete). */
  disabled?: boolean;
  /** While the landlord’s submit action runs (abstract / upload pipeline). */
  processing?: boolean;
}

/**
 * Flow 1 — lease files only. Does not submit; parent handles “Upload and abstract”.
 */
export function LeaseFileUpload({ files, onFilesChange, disabled = false, processing = false }: LeaseFileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [skipHint, setSkipHint] = useState<string | null>(null);
  const fileInputId = useId();
  const copyId = `${fileInputId}-copy`;

  const inert = disabled || processing;

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      const list = Array.from(incoming);
      const allowed = list.filter(isAllowedLeaseFile);
      const skipped = list.length - allowed.length;
      if (skipped > 0) {
        setSkipHint(`${skipped} file(s) skipped — use PDF, DOCX, JPG, or PNG.`);
        window.setTimeout(() => setSkipHint(null), 5000);
      } else {
        setSkipHint(null);
      }
      if (allowed.length === 0) return;
      onFilesChange([...files, ...allowed]);
    },
    [files, onFilesChange],
  );

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const list = e.target.files;
    if (list?.length) addFiles(list);
    e.target.value = "";
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    if (inert) return;
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    if (!inert) setIsDragging(true);
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
  }

  function removeAt(index: number) {
    onFilesChange(files.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-ls-16" aria-busy={processing ? "true" : undefined}>
      <input
        ref={inputRef}
        id={fileInputId}
        type="file"
        className="sr-only"
        accept={ACCEPT_ATTR}
        multiple
        disabled={inert}
        onChange={handleInputChange}
      />

      <div
        role="button"
        tabIndex={inert ? -1 : 0}
        aria-label="Lease files: drop here or activate choose files for PDF, DOCX, JPG, or PNG"
        onClick={() => !inert && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (inert) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`flex min-h-[200px] cursor-pointer flex-col items-center justify-center gap-ls-16 rounded-card border-2 border-dashed px-ls-24 py-ls-32 text-center transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[var(--colour-highlight-blue-100)] focus-visible:ring-offset-2 ${
          inert
            ? "cursor-not-allowed border-[var(--colour-neutral-80)] bg-[color:var(--colour-neutral-5)] opacity-60"
            : isDragging
              ? "border-[var(--colour-highlight-blue-100)] bg-[color:var(--colour-highlight-blue-50)]/40"
              : "border-[var(--colour-neutral-80)] bg-[color:var(--colour-neutral-5)] hover:bg-[color:var(--colour-neutral-80)]/10"
        }`}
        aria-describedby={copyId}
      >
        <div className="rounded-full bg-[color:var(--colour-highlight-purple-50)] p-ls-16 text-[color:var(--colour-highlight-purple-100)]" aria-hidden>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 4v12m0 0l4-4m-4 4l-4-4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div id={copyId}>
          <p className="text-fs-16 font-semibold leading-lh-24 text-[var(--colour-neutral-15)]">
            {isDragging ? "Drop to add files" : "Drop files here or click to browse"}
          </p>
          <p className="mt-ls-8 max-w-md text-fs-14 font-regular leading-lh-24 text-[var(--colour-neutral-60)]">
            PDF, DOCX, JPG, or PNG. Add multiple files (e.g. lease + addendum). Selecting files does not start upload — use{" "}
            <span className="font-semibold text-[var(--colour-neutral-30)]">Upload and abstract</span> when ready.
          </p>
        </div>
        <span className="kad-btn-secondary pointer-events-none inline-flex">Choose files</span>
      </div>

      {skipHint ? (
        <p className="text-fs-14 leading-lh-24 text-[var(--colour-semantic-danger-100)]" role="status">
          {skipHint}
        </p>
      ) : null}

      {files.length > 0 ? (
        <div className="rounded-card border border-[var(--colour-neutral-80)] bg-[var(--colour-neutral-100)] p-ls-16">
          <p className="text-fs-12 font-semibold uppercase tracking-wide text-[var(--colour-neutral-60)]">
            Selected files ({files.length})
          </p>
          <ul className="mt-ls-12 space-y-ls-8" aria-label="Selected lease files">
            {files.map((file, index) => (
              <li
                key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
                className="flex flex-wrap items-center justify-between gap-ls-8 border-b border-[var(--colour-neutral-80)] pb-ls-8 last:border-b-0 last:pb-0"
              >
                <span className="min-w-0 flex-1 truncate text-fs-14 font-regular text-[var(--colour-neutral-15)]" title={file.name}>
                  {file.name}
                </span>
                <span className="shrink-0 tabular-nums text-fs-14 text-[var(--colour-neutral-60)]">{formatFileSize(file.size)}</span>
                <button
                  type="button"
                  disabled={inert}
                  className="shrink-0 text-fs-14 font-semibold text-[var(--colour-highlight-blue-100)] underline-offset-2 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeAt(index);
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
