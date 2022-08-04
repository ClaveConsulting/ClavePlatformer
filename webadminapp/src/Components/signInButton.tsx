import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import {Button} from "@mui/material";
import {IPublicClientApplication} from "@azure/msal-browser";
import {Person, VerifiedUser} from "@mui/icons-material";

function handleLogin(instance: IPublicClientApplication) {
    instance.loginPopup(loginRequest).catch(e => {
        console.error(e);
    });
}

export const SignInButton = () => {
    const { instance } = useMsal();

    return (
        <Button variant="contained" color="info" onClick={() => handleLogin(instance)} startIcon={<Person/>}>Login</Button>
    );
}