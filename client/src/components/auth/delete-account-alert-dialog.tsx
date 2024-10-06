import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/shadcn/ui/alert-dialog";
import { Button } from "@/components/shadcn/ui/button";
import deleteAccount from "@/services/auth/delete-account";
import logout from "@/services/auth/logout";
import useAuthCheck from "@/hooks/use-auth-check";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/shadcn/use-toast";
import decodeAccessToken from "@/utils/auth/decode-access-token";

export default function DeleteAccountAlertDialog({
  className,
}: {
  className?: string;
}) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuthCheck();

  async function deleteAccountWrapper() {
    if (!isAuthenticated) {
      toast({
        title: "Error",
        description: "You are not authenticated",
        variant: "destructive",
      });
      return;
    }
    const user = decodeAccessToken();
    try {
      const response = await deleteAccount(user!.id);
      if (response.status === 204) {
        toast({
          title: "Success",
          description: "Your account has been deleted",
          variant: "success",
        });
        logout();
        navigate("/");
      }
    } catch (error) {
      // TODO: Display error message in a toast
      console.error("Error deleting account:", error);
      toast({
        title: "Error",
        description: "Request failed",
        variant: "destructive",
      });
    }
  }

  return (
    <div className={className}>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Delete Account</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteAccountWrapper()}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
