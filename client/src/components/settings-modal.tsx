import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <a
            href="https://github.com/drasura666/AetherMind/releases/download/v1.0.0/Dr.Asura.apk"
            className="px-4 py-2 bg-green-600 text-white rounded-lg block text-center hover:bg-green-700"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download Android APK
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
