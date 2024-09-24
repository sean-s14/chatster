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
import createAxiosInstance from "@/utils/axios-config";
import { deleteAccount } from "@/services/delete-account";
import { useAuth } from "@/context/auth-context";
import useAuthCheck from "@/hooks/use-auth-check";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/shadcn/use-toast";

export default function DeleteAccountAlertDialog({
  className,
}: {
  className?: string;
}) {
  const { accessToken, user, logout } = useAuth();
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
    const axiosInstance = createAxiosInstance(accessToken!);
    try {
      const response = await deleteAccount(axiosInstance, user!.id.toString());
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
