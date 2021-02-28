import React from "react";
import TripletBox from "./TripletBox";
import {content} from "../constants/copy";

class TripletsReport extends React.PureComponent {


    render() {

        const {apiResponse, userLocale, toggleTriplet} = this.props;
        const copy = content[userLocale];

        const {
            tripletList,
            functionalSize,
            inputOperationCount,
            outputOperationCount,
            readOperationCount,
            writeOperationCount
        } = apiResponse;

        return (
            <div className="row">
                {tripletList?.length > 0 && (
                    <div style={{marginLeft: '50px'}}>
                        <h1> {copy.TRIPLET_LIST_AND_STATS} </h1>
                        <div>
                            <p> {copy.FUNCTIONAL_SIZE}{' '}{functionalSize}</p>
                            <p> {copy.NUMBER_OF_INPUT_OPS}{' '}{inputOperationCount}</p>
                            <p> {copy.NUMBER_OF_OUTPUT_OPS}{' '}{outputOperationCount} </p>
                            <p> {copy.NUMBER_OF_READ_OPS}{' '}{readOperationCount} </p>
                            <p> {copy.NUMBER_OF_WRITE_OPS}{' '}{writeOperationCount} </p>
                            <hr/>
                            <h2>{copy.TRIPLET_LIST}</h2>
                            <table style={{marginRight: '0px', width: '80%'}}>
                                <tr>
                                    <th>{copy.TRIPLET}</th>
                                    <th>{copy.OPERATION_TYPE}</th>
                                    <th>{copy.INCLUDE}</th>
                                </tr>
                                {tripletList
                                    .map(triplet => (
                                        <TripletBox
                                            triplet={triplet}
                                            onChange={toggleTriplet}
                                            userLocale={userLocale}
                                        />)
                                    )}
                            </table>
                        </div>
                    </div>
                )}
            </div>
        )
    }

}

export default TripletsReport;
