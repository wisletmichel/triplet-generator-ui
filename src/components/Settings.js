import React from "react";
import {locales} from "../constants/appConstants";
import {content} from "../constants/copy";

const Settings = ({setUserLocale, userLocale, setUseCaseInputMethod, setUseCaseLanguage}) => {
    const copy = content[userLocale];
    return (
        <div className="row">
            <select
                id="languages"
                name="languages"
                onChange={({target: {value}}) => {
                    setUserLocale(value || locales.FR)
                }}
            >
                <option value={locales.FR}>{locales.FR}</option>
                <option value={locales.EN_US}>{locales.EN_US}</option>
            </select>
            <span style={{marginLeft: '10px'}} />
            <select
                id="useCaseInputMethod"
                name="useCaseInputMethod"
                onChange={({target: {value}}) => {
                    setUseCaseInputMethod(value || 'UWD')
                }}
            >
                <option value={'UWD'}>{copy.USE_WORD_DOCUMENT}</option>
                <option value={'UF'}>{copy.USE_FORM}</option>
            </select>

            <span style={{marginLeft: '10px'}} />
            <select
                id="useCaseLanguage"
                name="useCaseLanguage"
                onChange={({target: {value}}) => {
                    setUseCaseLanguage(value || locales.FR)
                }}
            >
                <option value={'FR'}>{copy.USE_CASE_IS_IN_FR}</option>
                <option value={'EN'}>{copy.USE_CASE_IS_IN_EN}</option>
            </select>

        </div>
    )
};

export default Settings;
