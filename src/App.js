import PizZip from 'pizzip';
import React, {Fragment, useRef} from 'react';
import axios from 'axios'
import {featureFlags} from "./appConstants";
import Docxtemplater from "docxtemplater";
import './App.css'
import TripletsReport from "./components/TripletsReport";
import {useReactToPrint} from "react-to-print";

function App() {

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });


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
        <div className="App">
            <header className="App-header">
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
                        <div className="container">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group files color">
                                        <label>Upload Your File </label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            name="file"
                                            onChange={({target: {files}}) => {
                                                const file = files && files.length > 0 ? files[0] : null;
                                                setSelectedFile(file);
                                            }}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <input
                                            style={{backgroundColor: 'inherit'}}
                                            type="submit"
                                            value="SUBMIT"
                                            onClick={onSubmit}
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Fragment>
                )}
                <div>
                    <button
                        style={{backgroundColor: 'inherit'}}
                        onClick={handlePrint}
                    >
                        EXPORT AS PDF
                    </button>
                </div>
                <TripletsReport apiResponse={tripletResponse} onPrint={handlePrint} ref={componentRef}/>
            </header>
        </div>
    );
}

export default App;
