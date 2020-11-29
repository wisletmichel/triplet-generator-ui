import React from "react";

export default function TripletBox({triplet = {}}) {
    return (
        <p> {triplet.subject},{triplet.verb}, {triplet.complement}</p>
    )
}
