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
import { useNavigate } from "react-router-dom";

export default function DeleteAccountAlertDialog({
  className,
}: {
  className?: string;
}) {
  const { accessToken, user, logout } = useAuth();
  const navigate = useNavigate();

  async function deleteAccountWrapper() {
    if (!user) {
      // TODO: Display error in a toast
      console.error("User is null");
      return;
    }
    if (!accessToken) {
      // TODO: Display error in a toast
      console.error("Access token is null");
      return;
    }
    const axiosInstance = createAxiosInstance(accessToken);
    try {
      const response = await deleteAccount(axiosInstance, user.id.toString());
      if (response.status === 204) {
        // TODO: Display success message in a toast
        console.log("Account deleted successfully");
        logout();
        navigate("/");
      } else {
        // TODO: Display error message in a toast
      }
    } catch (error) {
      // TODO: Display error message in a toast
      console.error("Error deleting account:", error);
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
