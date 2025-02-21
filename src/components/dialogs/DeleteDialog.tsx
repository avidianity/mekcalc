'use client';

import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { deleteDoc, doc } from 'firebase/firestore';
import { database } from '@/lib/firebase';
import { toast } from 'sonner';

interface DeleteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  itemId: string | null;
  collectionPath: string;
  onDelete: () => void;
  buttonText?: string;
}

export default function DeleteDialog({
  isOpen,
  onOpenChange,
  itemId,
  collectionPath,
  onDelete,
  buttonText = "Delete"
}: DeleteDialogProps) {
  const [deleting, setDeleting] = useState(false);

  const remove = async () => {
    if (!itemId) {
      return;
    }

    setDeleting(true);

    try {
      const docRef = doc(database, collectionPath, itemId);
      await deleteDoc(docRef);

      onDelete();
      toast('Data deleted.');
    } catch (error) {
      console.error(error);
      toast('Unable to delete data.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        <Button type='button' variant='destructive'>
          {buttonText}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              remove();
            }}
            disabled={deleting}
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
