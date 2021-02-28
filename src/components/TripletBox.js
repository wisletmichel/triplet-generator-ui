import React from "react";
import {content} from "../constants/copy";

export default function TripletBox({triplet = {}, onChange = () => '', userLocale}) {
    const copy = content[userLocale];
    return (
        <tr>
            <td>
                {triplet.subject}
                {', '}
                {triplet.verb}
                {', '}
                {triplet.complement}
            </td>
            <td>
                {copy[triplet.operationType]}
            </td>
            <td>
                <input
                    type="checkbox"
                    id={triplet.id}
                    name={triplet.id}
                    value={triplet.id}
                    checked={triplet.include}
                    onChange={() => {
                        onChange(triplet.id)
                    }}
                />
            </td>
        </tr>

    )
}


