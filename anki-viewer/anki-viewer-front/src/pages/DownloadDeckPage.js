import download from 'js-file-download';
import axios from 'axios';
import { LoadingButton } from '@mui/lab';
import { Save } from '@mui/icons-material';
import { useState } from 'react';

export const DownloadDeckPage = ({api}) => {
    const [loading, setLoading] = useState(false);
    const downloadDeck = async () => {
        setLoading(true);
        const response = await axios.get(api);
        const ankiDeckFile = "Slalom-TechVocab.apkg";
        await download(response.data, ankiDeckFile);
        setLoading(false);
    }

    return (
        <LoadingButton
        loading={loading}
        loadingPosition="start"
        startIcon={<Save />}
        variant="contained"
        onClick={downloadDeck}>Download</LoadingButton>
    )
}