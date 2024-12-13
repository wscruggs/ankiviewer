import axios from 'axios';
import { useReducer, useState } from 'react';
import { Alert } from '@mui/material';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export const AddCardPage = ({api}) => {

    const [error, setError] = useState(false);
    const [japaneseError, setJapaneseError] = useState(false);
    const [readingError, setReadingError] = useState(false);
    const [success, setSuccess] = useState(false);

    let readingErrMsg;

    const initialState = {
        "Japanese": "",
        "Reading": "",
        "Meaning": "",
        "Note": "",
        "Sentence": "",
        "Sentence_Meaning": "",
        "Link": "",
    };

    const formReducer = (state, action) => {
        switch(action.type) {
            case "TEXT":
                return {
                    ...state,
                    [action.field]: action.payload,
                };
            default:
                return state;
        }
    }

    const [formState, dispatch] = useReducer(formReducer, initialState);

    const handleTextChange = (e) => {
        dispatch( {
            type:"TEXT",
            field: e.target.name,
            payload: e.target.value,
        });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const allJapaneseChars = /^[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff67-\uff9f\u4e00-\u9faf\u3400-\u4dbf]+$/;
        const onlyKatakana = /^[\u3040-\u309f]+$/;
        
        const isJapanese = () => {
            if(null == formState.Japanese.match(allJapaneseChars))
                setJapaneseError(true);
            else
                setJapaneseError(false);
        }

        const isOnlyKatakana = (word) => {
            if(null == word.match(onlyKatakana))
                return false;
            else
                return true;
        }

        isJapanese();
        if(japaneseError) return;

        if(!isOnlyKatakana(formState.Japanese) && "" === formState.Reading) {
            readingErrMsg = "A Katakana reading is required";
            setReadingError(true);
            return;
        } else if (isOnlyKatakana(formState.Japanese) && "" !== formState.Reading) {
            readingErrMsg = "Do not enter a reading when the Japanese is only Katakana";
            setReadingError(true);
            return;
        } else {
            setReadingError(false);
            readingErrMsg  = "";
        }

        axios.post(api, formState).then(() => {
            setError(false);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        }).catch(setError(true));
    };

    return (

        <Stack component="form"
            spacing={2}
            onSubmit={onSubmit}
        >
            { error && <Alert severity="error">Problem submitting card.</Alert> }
            { success && <Alert severity="success">Successfully submitted card.</Alert> }
            <TextField
                required
                id="standard-error-helper-text"
                label="Japanese"
                name="Japanese"
                value={formState.Japanese}
                helperText={japaneseError ? "Can only contain Japanese Characters": ""}
                error={japaneseError}
                onChange={(e) => handleTextChange(e)}
            />
            <TextField
                id="standard-error-helper-text"
                label="Reading"
                name="Reading"
                value={ formState.Reading }
                helperText={readingError ? readingErrMsg : ""}
                error={readingError}
                onChange={(e) => handleTextChange(e)}
            />
            <TextField
                required
                id="standard-error-helper-text"
                label="Meaning"
                name="Meaning"
                value={ formState.Meaning }
                onChange={(e) => handleTextChange(e)}
            />
            <TextField
                id="standard-error-helper-text"
                label="Note"
                name="Note"
                value={ formState.Note }
                onChange={(e) => handleTextChange(e)}
            />
            <TextField
                id="standard-error-helper-text"
                label="Sentence"
                name="Sentence"
                value={ formState.Sentence }
                onChange={(e) => handleTextChange(e)}
            />
            <TextField
                id="standard-error-helper-text"
                label="Sentence Meaning"
                name="Sentence_Meaning"
                value={ formState.Sentence_Meaning }
                onChange={(e) => handleTextChange(e)}
            />
            <TextField 
                id="standard-error-helper-text"
                label="Link"
                name="Link"
                value={ formState.Link }
                onChange={(e) => handleTextChange(e)}
            />
            <Button type="submit" variant='contained'>Submit</Button>
        </Stack>
    )
}