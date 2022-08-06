import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    TextField,
} from "@mui/material";
import React, {useState} from "react";
import IconButton from "@mui/material/IconButton";
import {Cancel, Clear, Delete, Edit, Save} from "@mui/icons-material";
import {deleteSingleEntryById, editScoreById} from "../services/EditService";
import {ISearchDataElement} from "../Interfaces/RawDataResponse";
import {Box} from "@mui/system";

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

export function EditButton({data}: { data: ISearchDataElement }) {
    const [open, setOpen] = useState(false);

    const [name, setName] = useState(data.name);
    const [phone, setPhone] = useState(data.phoneNumber);
    const [map, setMap] = useState(data.map);
    const [tournament, setTournament] = useState(data.tournament);
    const [time, setTime] = useState(data.time);

    const handleNameChange = (e: any) => {
        setName(e.target.value);
    };
    const handlePhoneChange = (e: any) => {
        setPhone(e.target.value);
    };
    const handleMapChange = (e: any) => {
        setMap(e.target.value);
    };
    const handleTournamentChange = (e: any) => {
        setTournament(e.target.value);
    };
    const handleTimeChange = (e: any) => {
        setTime(e.target.value);
    };

    const resetValues = () => {
        setTime(data.time);
        setName(data.name);
        setPhone(data.phoneNumber);
        setMap(data.map);
        setTournament(data.tournament);
    };


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    return (
        <>
            <IconButton onClick={handleClickOpen}>
                <Edit/>
            </IconButton>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit</DialogTitle>
                <DialogContent>
                    <Box>
                        <form
                            noValidate
                            autoComplete="off"
                            onReset={async () => {
                            }}
                        >
                            <Grid container spacing={1} marginTop={1}>
                                <Grid item xs={12}>
                                    <TextField
                                        id="name"
                                        label="Name/Gamertag"
                                        value={name}
                                        type="search"
                                        fullWidth
                                        onChange={handleNameChange}

                                    />

                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        id="time"
                                        label="Time"
                                        value={time}
                                        type="search"
                                        fullWidth
                                        onChange={handleTimeChange}
                                    />

                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        id="phone"
                                        label="Phone number"
                                        value={phone}
                                        type="number"
                                        fullWidth
                                        onChange={handlePhoneChange}

                                    />

                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        id="map"
                                        label="Map"
                                        value={map}
                                        type="search"
                                        fullWidth
                                        onChange={handleMapChange}

                                    />

                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        id="tournament"
                                        label="Tournament"
                                        value={tournament}
                                        type="search"
                                        fullWidth
                                        onChange={handleTournamentChange}
                                    />

                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                </DialogContent>
                <DialogActions>

                    <Grid container spacing={1}>

                        <Grid item xs={6}>
                            <Button
                                variant="outlined"
                                startIcon={<Cancel/>}
                                sx={{padding: 2}}
                                fullWidth
                                onClick={() => {
                                    handleClose()
                                    resetValues()
                                }}
                            >
                                Cancel
                            </Button>

                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                variant="contained"
                                color="success"
                                startIcon={<Save/>}
                                sx={{padding: 2}}
                                fullWidth
                                onClick={() => {
                                    handleClose()
                                    editScoreById(data.id,name,phone,time,map,tournament)
                                }}
                            >
                                Save
                            </Button>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
        </>

    );
}