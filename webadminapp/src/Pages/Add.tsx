import React, {useState} from "react";
import {ISearchDataElement} from "../Interfaces/RawDataResponse";
import {searchDatabase} from "../services/SearchService";
import {Button, Grid, TextField} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {Clear} from "@mui/icons-material";
import {Box} from "@mui/system";
import AddIcon from "@mui/icons-material/Add";
import {addToDatabase} from "../services/EditService";

export function Add() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [tournament, setTournament] = useState("");
    const [map, setMap] = useState("");
    const [time, setTime] = useState("");

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

    const handleSubmit = async () => {
        const data = await addToDatabase(name, phone, time, map, tournament)
    };


    return <Box>
        <form
            noValidate
            autoComplete="off"
            onReset={() => {
                setMap("");
                setName("");
                setPhone("");
                setTournament("");
            }}
        >
            <Grid container spacing={1}>
                <Grid item xs={12} md={6} lg={3}>
                    <TextField
                        id="name"
                        label="Name/Gamertag"
                        type="search"
                        fullWidth
                        onChange={handleNameChange}
                        onEmptied={handleNameChange}
                    />

                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <TextField
                        id="phone"
                        label="Phone number"
                        type="number"
                        fullWidth
                        onChange={handlePhoneChange}
                        onEmptied={handlePhoneChange}
                    />

                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <TextField
                        id="map"
                        label="Map"
                        type="search"
                        fullWidth
                        onChange={handleMapChange}
                        onEmptied={handleMapChange}
                    />

                </Grid>
                <Grid item xs={6}>
                    <TextField id="time" label="Time" type="number" fullWidth
                               onChange={handleTimeChange}/>

                </Grid>
                <Grid item xs={12}>
                    <TextField id="tournament" label="Tournament" type="search" fullWidth
                               onChange={handleTournamentChange}/>

                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<AddIcon/>}
                        type="reset"
                        sx={{padding: 2}}
                        fullWidth
                        onClick={handleSubmit}
                    >
                        Add
                    </Button>
                </Grid>
            </Grid>
        </form>
    </Box>;
}
