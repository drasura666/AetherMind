import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Brain, Key, Shield, Infinity } from 'lucide-react';

interface WelcomeModalProps {
  open: boolean;
  onClose: () => void;
  onGetStarted: () => void;
}

export function WelcomeModal({ open, onClose, onGetStarted }: WelcomeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-4 p-8" data-testid="welcome-modal">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="text-white h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Ultimate AI</h2>
          <p className="text-gray-600">Your all-in-one AI platform for STEM, coding, research, and creativity</p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Key className="text-white h-3 w-3" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Bring Your Own API Key</h3>
              <p className="text-sm text-gray-600">Connect your own AI provider keys for unlimited access</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Shield className="text-white h-3 w-3" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Privacy First</h3>
              <p className="text-sm text-gray-600">Keys stored encrypted locally, never on our servers</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Infinity className="text-white h-3 w-3" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Completely Free</h3>
              <p className="text-sm text-gray-600">No subscriptions, no limits, no hidden costs</p>
            </div>
          </div>
        </div>

        <Button 
          onClick={onGetStarted}
          className="w-full"
          data-testid="button-get-started"
        >
          Get Started
        </Button>
      </DialogContent>
    </Dialog>
  );
}
