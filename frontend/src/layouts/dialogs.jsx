import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LuX } from "react-icons/lu";

const btnBase = "rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-60";

const CloseIconButton = () => (
  <DialogClose asChild>
    <button
      type="button"
      className="absolute top-2 right-2 rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
      aria-label="Close"
    >
      <LuX size={18} />
    </button>
  </DialogClose>
);

// ----- Delete Confirm -----
export function DeleteConfirmDialog({
  open,
  onOpenChange,
  title = "Delete?",
  description = "This action cannot be undone.",
  onConfirm,
  isLoading = false,
  confirmLabel = "Delete",
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <CloseIconButton />
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton={false}>
          <button
            type="button"
            onClick={() => onOpenChange?.(false)}
            className={`${btnBase} border border-slate-200 bg-white text-slate-700 hover:bg-slate-50`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`${btnBase} bg-red-600 text-white hover:bg-red-700`}
          >
            {isLoading ? "Deleting..." : confirmLabel}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ----- Info -----
export function InfoDialog({
  open,
  onOpenChange,
  title = "Info",
  message,
  buttonLabel = "OK",
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <CloseIconButton />
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {message && <DialogDescription>{message}</DialogDescription>}
        </DialogHeader>
        <DialogFooter showCloseButton={false}>
          <button
            type="button"
            onClick={() => onOpenChange?.(false)}
            className={`${btnBase} bg-blue-600 text-white hover:bg-blue-700`}
          >
            {buttonLabel}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ----- Error -----
export function ErrorDialog({
  open,
  onOpenChange,
  title = "Error",
  message = "Something went wrong.",
  buttonLabel = "Close",
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <CloseIconButton />
        <DialogHeader>
          <DialogTitle className="text-red-600">{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton={false}>
          <button
            type="button"
            onClick={() => onOpenChange?.(false)}
            className={`${btnBase} border border-slate-200 bg-white text-slate-700 hover:bg-slate-50`}
          >
            {buttonLabel}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ----- Edit (generic form / content) -----
export function EditDialog({
  open,
  onOpenChange,
  title = "Edit",
  description,
  children,
  onSave,
  onCancel,
  saveLabel = "Save",
  isLoading = false,
  contentClassName,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className={contentClassName}>
        <CloseIconButton />
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
        <DialogFooter showCloseButton={false}>
          <button
            type="button"
            onClick={() => { onCancel?.(); onOpenChange?.(false); }}
            className={`${btnBase} border border-slate-200 bg-white text-slate-700 hover:bg-slate-50`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={isLoading}
            className={`${btnBase} bg-blue-600 text-white hover:bg-blue-700`}
          >
            {isLoading ? "Saving..." : saveLabel}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
