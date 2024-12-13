import axios from 'axios';
import { useState, useEffect } from 'react';
import Button from "@mui/material/Button";

import { RequestedCardListComponent } from '../components/DeckComponent';

export const RequestedCardListPage = ({api, exportApi}) => {
    const [deck, setDeck] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const getRequestedCardList = async (api) => { 
        try {
            const response = await axios.get(api);
            setDeck(response.data);
        } catch(e) {
            setError(e);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getRequestedCardList(api);
    },[api]);

    const exportDeck = async () => {
        let response;
        try {
            response = await axios.head(exportApi);
        } catch(e) {
            alert(e);
        } finally {
            if(response.status === 200)
                alert("Saved Anki Deck");
            else 
                alert("Error Saving Anki Deck: " +  response.status);
        }
    }

    if(error) return (<h1>'Failed to get requested cards'</h1>);
    if(isLoading) return (<h1>"Loading Requested Card List...</h1>);
    return (
        <>
            <h1>Requested Cards to Add:</h1>
            <RequestedCardListComponent deck={deck} onCardAddRemove={updatedDeck => setDeck(updatedDeck)}/>
            <Button onClick={exportDeck} variant='contained'>Save Anki Deck</Button>
        </>
    )
}