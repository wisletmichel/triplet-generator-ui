import * as React from "react";
import {content} from "../../../constants/copy";

export const UseCaseForm = ({onSubmit, onChange, useCase, loading, userLocale}) => {

    const copy = content[userLocale];

    return (
        <form id="noter-save-form" method="POST" onSubmit={onSubmit}>
            <div>
                <textarea
                    rows="6"
                    cols="50"
                    id="noter-text-area"
                    name="textarea"
                    onChange={onChange}
                    value={useCase}
                    disabled={loading}
                />
            </div>
            <div>
                <input
                    style={{backgroundColor: 'inherit'}}
                    type="submit"
                    value={copy.SUBMIT}
                    onClick={onSubmit}
                    disabled={loading || !useCase}
                />
            </div>
        </form>
    )
};
