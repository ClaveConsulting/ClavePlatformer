import React from "react";
import {Grid, Paper} from "@mui/material";
import {styled} from "@mui/material/styles";
import BasicTable from "../Components/Table";

export function Home() {
    return <Grid container spacing={2}>
        <Grid item xs={8}>
            <Item>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
                scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap
                into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the
                release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing
                software like Aldus PageMaker including versions of Lorem Ipsum.
            </Item>
        </Grid>
        <Grid item xs={4}>
            <Item>xs=4</Item>
        </Grid>
   
        <Grid item xs={12}>
            <Item>
            </Item>
        </Grid>
    </Grid>;
}

const Item = styled(Paper)(({theme}) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));
