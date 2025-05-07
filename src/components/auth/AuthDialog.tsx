import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';
import { UserRound, UserPlus } from 'lucide-react';

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthDialog({ isOpen, onClose }: AuthDialogProps) {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  
  const handleSuccess = () => {
    // Close dialog on successful authentication
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            {activeTab === "login" ? "Doctor Login" : "Doctor Registration"}
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-muted-foreground">
            {activeTab === "login" ? 
              "Sign in to recommend medications based on your expertise" : 
              "Create an account to share your professional medical insights"
            }
          </DialogDescription>
        </DialogHeader>
        
        <Tabs 
          defaultValue="login" 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as "login" | "signup")}
          className="mt-4"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" className="flex items-center gap-2">
              <UserRound className="h-4 w-4" />
              <span>Login</span>
            </TabsTrigger>
            <TabsTrigger value="signup" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              <span>Sign Up</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="mt-4">
            <LoginForm onSuccess={handleSuccess} />
            <div className="mt-4 text-center text-sm text-muted-foreground">
              <p>Login to vote on medications based on your medical expertise</p>
            </div>
          </TabsContent>
          
          <TabsContent value="signup" className="mt-4">
            <SignUpForm onSuccess={() => setActiveTab("login")} />
            <div className="mt-4 text-center text-sm text-muted-foreground">
              <p>Your medical license will be verified before account activation</p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}