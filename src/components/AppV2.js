import PizZip from 'pizzip';
import React, {Fragment, useRef} from 'react';
import axios from 'axios'
import Docxtemplater from "docxtemplater";
import '../App.css'
import {useReactToPrint} from "react-to-print";
import {featureFlags} from "../constants/appConstants";
import TripletsReport from "./TripletsReport";

function AppV2() {

    const componentRef = useRef();
    const handlePrint = useReactToPrint({content: () => componentRef.current});


    const [useCase, setUseCase] = React.useState('');
    const [tripletResponse, setTripletResponse] = React.useState({tripletList: []});
    const [loading, setLoading] = React.useState(false);
    const [selectedFile, setSelectedFile] = React.useState(null);

    const postRequest = payload => {
        axios.post(
            'http://localhost:9090/api/parser',
            {body: payload}
        ).then(function ({data}) {
            setTripletResponse(data);
            setLoading(false);
        }).catch(function (error) {
            setLoading(false);
            console.log(error);
        })
    };
    const toRichSentence = sentence => ({words: sentence?.trim()?.split(" "), content: sentence, status: 'RAW'});
    const onSubmit = evt => {
        evt.preventDefault();
        setLoading(true);
        setTripletResponse({tripletList: []});
        if (featureFlags.inputFileEnabled) {
            const fileReader = new FileReader();
            fileReader.onloadend = () => {
                const content = fileReader.result;
                const zip = new PizZip(content);
                const doc = new Docxtemplater().loadZip(zip);
                const text = doc.getFullText();
                const sentences = text?.trim()?.split(".");
                const richSentences = sentences?.map(sentence => toRichSentence(sentence));
                postRequest(richSentences);
            };
            fileReader.readAsBinaryString(selectedFile);
        } else {
            const sentences = useCase?.trim()?.split(".");
            const richSentences = sentences?.map(sentence => toRichSentence(sentence));
            postRequest(richSentences);
        }

    };
    const onChange = ({target: {value}}) => {
        setUseCase(value);
    };


    return (
            <div style={{ marginTop: '50px', marginLeft: '50px'}}>
                {loading && (<div>Traitement en cours....</div>)}
                {!featureFlags.inputFileEnabled && (
                    <form id="noter-save-form" method="POST" onSubmit={onSubmit}>
                        <div>
                            <textarea
                                rows="6"
                                cols="50"
                                id="noter-text-area"
                                name="textarea"
                                onChange={onChange}
                                value={useCase}
                            />
                        </div>
                        <div>
                            <input
                                style={{backgroundColor: 'inherit'}}
                                type="submit"
                                value="SUBMIT"
                                onClick={onSubmit}
                                disabled={loading}
                            />
                        </div>
                    </form>
                )}
                {featureFlags.inputFileEnabled && (
                    <Fragment>
                        <div>
                            <div>
                                <div>
                                    <div>
                                        <label>Veuillez choisir un fichier</label>
                                        <input
                                            style={{display: 'inline', width: '50%', marginLeft: '5px'}}
                                            type="file"
                                            className="form-control"
                                            name="file"
                                            onChange={({target: {files}}) => {
                                                const file = files && files.length > 0 ? files[0] : null;
                                                setSelectedFile(file);
                                            }}
                                        />
                                        <input
                                            style={{marginLeft: '10px'}}
                                            type="submit"
                                            value="Soumettre"
                                            onClick={onSubmit}
                                            disabled={loading || !!!selectedFile}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Fragment>
                )}
                {tripletResponse?.tripletList.length > 0 && (
                    <div style={{marginTop: '10px'}}>
                        <button
                            onClick={handlePrint}
                        >
                            Telecharger la version PDF
                        </button>
                    </div>
                )}
                <TripletsReport apiResponse={tripletResponse} onPrint={handlePrint} ref={componentRef}/>
            </div>
    );
}

export default AppV2;
