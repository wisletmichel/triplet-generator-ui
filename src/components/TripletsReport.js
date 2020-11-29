import React from "react";
import TripletBox from "./TripletBox";

class TripletsReport extends React.PureComponent {


    render() {

        const {
            onPrint = () => {},
            apiResponse: {tripletList, functionalSize, inputOperationCount, outputOperationCount, readOperationCount, writeOperationCount} = {}
        } = this.props;

        return (
            <div className="row">
                {tripletList?.length > 0 && (
                    <div  style={{marginLeft: '50px'}}>
                        <h1> List des triplets generés et autres stats</h1>
                        <div>
                            <p> Taille fonctionnelle : {functionalSize}</p>
                            <p> Nombre d'operation d'entree : {inputOperationCount} </p>
                            <p> Nombre d'operation de sortie : {outputOperationCount} </p>
                            <p> Nombre d'operation de lecture : {readOperationCount} </p>
                            <p> Nombre d'operation d'ecriture : {writeOperationCount} </p>
                            <hr/>
                            <h2>Liste des Triplets</h2>
                            <div>{tripletList.map(triplet => <TripletBox triplet={triplet}/>)}</div>
                        </div>
                    </div>
                )}
            </div>
        )
    }

}

export default TripletsReport;
