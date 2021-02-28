import PizZip from 'pizzip';
import React, {useRef} from 'react';
import axios from 'axios'
import Docxtemplater from "docxtemplater";
import '../App.css'
import {useReactToPrint} from "react-to-print";
import {configs, locales} from "../constants/appConstants";
import TripletsReport from "./TripletsReport";
import {UseCaseForm} from "./shared/v3/Form";
import UseCasePicker from "./shared/v3/Picker";
import {content} from "../constants/copy";
import Settings from "./Settings";
import {toRequest} from "../utils/RequestHelpers";

function AppV3() {

    const [userLocale, setUserLocale] = React.useState(locales.FR);
    const [useCase, setUseCase] = React.useState('');
    const [useCaseInputMethod, setUseCaseInputMethod] = React.useState('UWD');
    const [useCaseLanguage, setUseCaseLanguage] = React.useState('FR');
    const [tripletResponse, setTripletResponse] = React.useState({tripletList: []});
    const [loading, setLoading] = React.useState(false);
    const [selectedFile, setSelectedFile] = React.useState(null);
    const [showError, setShowError] = React.useState(false);

    const componentRef = useRef();
    const handlePrint = useReactToPrint({content: () => componentRef.current});
    const copy = content[userLocale];


    const postRequest = payload => {
        axios.post(
            configs.TRIPLET_SERVICE,
            toRequest(useCaseLanguage, payload)
        ).then(function ({data}) {
            const response = {
                ...data,
                tripletList: data.tripletList.map(triplet => ({...triplet, include: true}))
            };
            setTripletResponse(response);
            setLoading(false);
        }).catch(function (error) {
            setLoading(false);
            setShowError(true);
            console.log(error);
        })
    };
    const toRichSentence = sentence => ({words: sentence?.trim()?.split(" "), content: sentence, status: 'RAW'});
    const onSubmit = evt => {
        evt.preventDefault();
        setLoading(true);
        setShowError(false);
        setTripletResponse({tripletList: []});
        if (useCaseInputMethod === 'UWD') {
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

    const toggleTriplet = tripletId => {
        const triplet = tripletResponse?.tripletList?.find(triplet => triplet.id === tripletId);
        const {
            functionalSize,
            inputOperationCount,
            outputOperationCount,
            readOperationCount,
            writeOperationCount,
        } = tripletResponse;

        const fs = triplet?.include ? functionalSize - 1 : functionalSize + 1;
        const inCount = triplet?.operationType === 'IN' ? triplet?.include ?  inputOperationCount - 1 : inputOperationCount + 1 : inputOperationCount;
        const outCount = triplet?.operationType === 'OUT' ? triplet?.include ?  outputOperationCount - 1 : outputOperationCount + 1 : outputOperationCount;
        const readCount = triplet?.operationType === 'READ' ? triplet?.include ?  readOperationCount - 1 : readOperationCount + 1 : readOperationCount;
        const writeCount = triplet?.operationType === 'WRITE' ? triplet?.include ?  writeOperationCount - 1 : writeOperationCount + 1 : writeOperationCount;
        const response = {
            ...tripletResponse,
            functionalSize: fs,
            inputOperationCount: inCount,
            outputOperationCount: outCount,
            readOperationCount: readCount,
            writeOperationCount: writeCount,
            tripletList: tripletResponse.tripletList.map(triplet => {
                if (triplet.id === tripletId) {
                    return {...triplet, include: !triplet.include}
                } else {
                    return triplet;
                }
            })
        };

        setTripletResponse(response);
    };

    return (
        <div style={{marginTop: '50px', marginLeft: '50px'}}>
            <Settings
                setUserLocale={setUserLocale}
                userLocale={userLocale}
                setUseCaseInputMethod={setUseCaseInputMethod}
                setUseCaseLanguage={setUseCaseLanguage}
            />
            {loading && (
                <h3 style={{textAlign: 'center',}}>{copy.PROCESSING}</h3>
            )}
            {showError && (
                <div style={{textAlign: 'center', color: 'red'}}>{copy.SOMETHING_WENT_WRONG}</div>
            )}
            <div style={{marginTop: '10px'}}>
                {useCaseInputMethod === 'UF' && (
                    <UseCaseForm
                        onSubmit={onSubmit}
                        onChange={onChange}
                        useCase={useCase}
                        loading={loading}
                        userLocale={userLocale}
                    />
                )}
                {useCaseInputMethod !== 'UF' && (
                    <UseCasePicker
                        onSubmit={onSubmit}
                        setSelectedFile={setSelectedFile}
                        loading={loading}
                        userLocale={userLocale}
                        selectedFile={selectedFile}
                    />
                )}
                {tripletResponse?.tripletList.length > 0 && (
                    <div style={{marginTop: '10px'}}>
                        <button
                            onClick={handlePrint}
                        >
                            {copy.DOWNLOAD}
                        </button>
                    </div>
                )}
                <TripletsReport
                    apiResponse={tripletResponse}
                    ref={componentRef}
                    userLocale={userLocale}
                    toggleTriplet={toggleTriplet}
                />
            </div>
        </div>
    );
}

export default AppV3;
