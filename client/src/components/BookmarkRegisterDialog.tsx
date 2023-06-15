import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";

type BookmarkRegisterDialogProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setBookmarkTitle: React.Dispatch<React.SetStateAction<string>>;
  projectId: string;
};

const BookmarkRegisterDialog: React.FC<BookmarkRegisterDialogProps> = ({
  isOpen,
  setIsOpen,
  setBookmarkTitle,
  projectId,
}) => {
  /* STATES */
  const [bookmarkTitle] = useState<string>("");

  /* HANDLER */
  const handleCancle = () => {
    setIsOpen(false);
  };

  const handleSend = () => {
    setIsOpen(false);
    setBookmarkTitle(bookmarkTitle);
  };

  return (
    <Dialog open={isOpen}>
      <DialogTitle>Register a bookmark</DialogTitle>
      <DialogContent>
        <DialogContentText>Do you want to register bookmark in the project bookmark?</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Title"
          type="text"
          value={bookmarkTitle}
          fullWidth
          variant="standard"
          color="secondary"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancle} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSend} color="secondary">
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookmarkRegisterDialog;
