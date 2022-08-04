import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,} from "@mui/material";
import React, {useState} from "react";
import IconButton from "@mui/material/IconButton";
import {Delete} from "@mui/icons-material";
import {deleteSingleEntryById} from "../services/EditService";

export function DeleteButton({scoreId}: { scoreId: string }) {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <IconButton onClick={handleClickOpen}>
                <Delete/>
            </IconButton>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Delete entry</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this item?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={async () => {
                        handleClose();
                        await deleteSingleEntryById(scoreId)
                    }} variant="contained" color="error"
                            startIcon={<Delete/>}> Delete</Button>
                </DialogActions>
            </Dialog>
        </>

    );
}