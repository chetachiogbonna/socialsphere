import { Dispatch, SetStateAction } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog'
import { SignOutButton } from '@clerk/nextjs'

interface LogOutModalProps {
  wantToLogOut: boolean,
  setWantToLogOut: Dispatch<SetStateAction<boolean>>
}

function LogOutModal({ wantToLogOut, setWantToLogOut }: LogOutModalProps) {
  return (
    <AlertDialog open={wantToLogOut}>
      <AlertDialogContent className="bg-dark-3">
        <AlertDialogHeader>
          <AlertDialogTitle>Please log me out now.</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="bg-dark-2"
            onClick={() => setWantToLogOut(false)}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-blue hover:bg-blue"
            asChild
          >
            <SignOutButton />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default LogOutModal