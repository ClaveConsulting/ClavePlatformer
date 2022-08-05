import React from "react";
import {ISearchDataElement} from "../Interfaces/RawDataResponse";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import {DeleteButton, EditButton} from "./PopUps";
import {makeStyles} from "@mui/styles";
import Typography from "@mui/material/Typography";

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

export default function SingleLeaderBoard({title, dataResponseArray}: {
    title: string;
    dataResponseArray: ISearchDataElement[];
}) {


    const classes = useStyles();

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <Typography variant={"h5"} fontStyle={{color: "primary"}}>
                                {title}
                            </Typography>
                        </TableCell>
                        <TableCell/>
                        <TableCell/>
                        <TableCell/>
                        <TableCell/>
                        <TableCell/>
                    </TableRow>
                    <TableRow>
                        <TableCell style={{fontWeight: "bold"}}>#</TableCell>
                        <TableCell style={{fontWeight: "bold"}} align="right">Name</TableCell>
                        <TableCell style={{fontWeight: "bold"}} align="right">Phone number</TableCell>
                        <TableCell style={{fontWeight: "bold"}} align="right">Time</TableCell>
                        <TableCell style={{fontWeight: "bold"}} align="right">Map</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {dataResponseArray.map((entry, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                {index + 1 + "."}
                            </TableCell>
                            <TableCell component="th" scope="row" align="right">
                                {entry.name}
                            </TableCell>
                            <TableCell align="right">{entry.phoneNumber}</TableCell>
                            <TableCell align="right">{entry.time}</TableCell>
                            <TableCell align="right" sx={{visible: "true"}}>{entry.map}</TableCell>
                            <TableCell align="right">
                                <EditButton data={entry}></EditButton>
                                <DeleteButton scoreId={entry.id}></DeleteButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
