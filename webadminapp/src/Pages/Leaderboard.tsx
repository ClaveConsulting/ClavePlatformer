import {Box} from "@mui/system";
import React, {useState} from "react";
import SingleLeaderBoard from "../Components/SingleLeaderBoard";
import {Button, Grid, TextField} from "@mui/material";
import {DropdownButton} from "react-bootstrap";
import DropdownItem from "react-bootstrap/DropdownItem";
import {ArrowForwardIosRounded, Public} from "@mui/icons-material";
import {searchDatabase} from "../services/SearchService";


export function Leaderboard() {

    const [tournament, setTournament] = useState("");
    const [leaderboard, setLeaderboard] = useState(<></>);


    const handleTournamentChange = (e: any) => {
        setTournament(e.target.value);
    };

    const handleSubmit = async () => {
        const data = await searchDatabase("", "", "", tournament);
        if (data) {
            setLeaderboard(<SingleLeaderBoard title={tournament} dataResponseArray={data}/>);
        }
    };

    const handleGlobalButton = async () => {
        const ntnuData = await searchDatabase("", "", "ntnu", "");
        const uioData = await searchDatabase("", "", "uio", "");
        
        if(ntnuData && uioData){
            setLeaderboard(<>
                <SingleLeaderBoard title={"NTNU"} dataResponseArray={ntnuData} />
                <SingleLeaderBoard title={"UIO"} dataResponseArray={uioData} />
            </>)
        }
    }


    return <Box>
        <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
                <Button fullWidth sx={{padding: 2}} variant={"contained"} onClick={handleGlobalButton} endIcon={<Public></Public>}>Global
                    Leaderboards</Button>
            </Grid>
            <Grid item xs={12} md={6}>
                <form
                    noValidate
                    autoComplete="off"
                    onReset={() => {
                        setTournament("");
                    }}
                >
                    <Grid container spacing={2}>

                        <Grid item xs={8}>

                            <TextField id="tournament"
                                       label="Tournament"
                                       type="search"
                                       fullWidth
                                       onChange={handleTournamentChange}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Button fullWidth variant={"contained"} sx={{padding: 2}} color={"success"}
                                    onClick={handleSubmit}
                                    endIcon={<ArrowForwardIosRounded/>}>Go</Button>
                        </Grid>
                    </Grid>
                </form>
            </Grid>
        </Grid>
        {leaderboard}
    </Box>
        ;
}
