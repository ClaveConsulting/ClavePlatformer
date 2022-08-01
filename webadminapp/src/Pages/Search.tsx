import { Box, Button, Divider, TextField } from "@mui/material";
import React from "react";
import SearchIcon from "@mui/icons-material/Search";

export function Search() {
    return (
        <Box
            component="form"
            sx={{
                "& .MuiTextField-root": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
        >
            <TextField
                id="outlined-search"
                label="Name/Gamertag"
                type="search"
            />
            <TextField
                id="outlined-search"
                label="Search field"
                type="number"
            />
            <TextField id="outlined-search" label="Tournament" type="search" />

            <Button
                variant="contained"
                color="success"
                startIcon={<SearchIcon />}
                sx={{ padding: 2, margin: 1 }}
            >
                Search
            </Button>

            <Divider />
        </Box>
    );
}
