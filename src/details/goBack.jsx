import React from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@material-ui/core";

export default function GoBack() {
    return (
    <NavLink to="/histoireDetail" style={{ textDecoration: 'none' }}>
        <Button variant='contained' size="small" color="primary" style={{background:'#92d050',color:'black'}}>
            Go Back
    </Button>
    </NavLink>

    );
}

