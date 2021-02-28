import React, {Fragment} from "react";
import {content} from "../../../constants/copy";

const UseCasePicker = ({setSelectedFile, onSubmit, loading, userLocale, selectedFile}) => {

    const copy = content[userLocale];

    return (
        <Fragment>
            <label>{copy.SELECT_FILE}</label>
            <input
                style={{display: 'inline', width: '50%', marginLeft: '5px'}}
                disabled={loading}
                type="file"
                className="form-control"
                name="file"
                onChange={({target: {files}}) => {
                    const file = files && files.length > 0 ? files[0] : null;
                    setSelectedFile(file);
                }}
            />
            <input
                style={{marginLeft: '10px', height: '32px'}}
                type="submit"
                value={copy.SUBMIT}
                onClick={onSubmit}
                disabled={loading || !selectedFile}
            />
        </Fragment>
    )
};

export default UseCasePicker;
