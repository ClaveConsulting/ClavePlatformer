import React from 'react';
import {makeStyles} from '@mui/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {ISearchDataElement} from "../Interfaces/RawDataResponse";
import {DeleteButton, EditButton} from "./PopUps";

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

export default function DataTable({dataResponseArray,
            
}: {
    dataResponseArray: ISearchDataElement[];

}) {
    const classes = useStyles();
    
    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Phone number</TableCell>
                        <TableCell align="right">Time</TableCell>
                        <TableCell align="right">Map</TableCell>
                        <TableCell align="right">Tournament</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {dataResponseArray.map((entry) => (
                        <TableRow key={entry.id}>
                            <TableCell component="th" scope="row">
                                {entry.name}
                            </TableCell>
                            <TableCell align="right">{entry.phoneNumber}</TableCell>
                            <TableCell align="right">{entry.time}</TableCell>
                            <TableCell align="right">{entry.map}</TableCell>
                            <TableCell align="right">{entry.tournament}</TableCell>
                            <TableCell align="right">
                                <EditButton data={entry}></EditButton>
                                <DeleteButton scoreId={entry.id} ></DeleteButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
