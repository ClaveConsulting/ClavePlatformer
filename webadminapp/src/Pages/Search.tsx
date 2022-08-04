import {Box, Button, Grid, TextField} from "@mui/material";
import React, {useState} from "react";
import SearchIcon from "@mui/icons-material/Search";
import {Clear} from "@mui/icons-material";
import BasicTable from "../Components/Table";
import {searchDatabase} from "../services/SearchService";
import {ISearchDataElement} from "../Interfaces/RawDataResponse";

export function Search() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [tournament, setTournament] = useState("");
    const [map, setMap] = useState("");
    const [dataResponse, setDataResponse] = useState<ISearchDataElement[]>([])

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
    const handleSubmit = async () => {
        const data = await searchDatabase(name, phone, map, tournament)
        if (!!data) {
            setDataResponse(data);
        }
    };


    return (
        <Box>
            <form
                noValidate
                autoComplete="off"
                onReset={async () => {
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
                    <Grid item xs={12} md={6} lg={3}>
                        <TextField id="tournament" label="Tournament" type="search" fullWidth
                                   onChange={handleTournamentChange}/>

                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<SearchIcon/>}
                            sx={{padding: 2, margin: 1}}
                            fullWidth
                            onClick={handleSubmit}
                        >
                            Search
                        </Button>

                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            variant="contained"
                            color="error"
                            startIcon={<Clear/>}
                            type="reset"
                            sx={{padding: 2, margin: 1}}
                            fullWidth
                        >
                            Clear
                        </Button>
                    </Grid>
                </Grid>
            </form>


            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <BasicTable dataResponseArray={dataResponse}></BasicTable>
                </Grid>
            </Grid>

        </Box>

    );
}
