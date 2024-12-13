import axios from 'axios';
import { useState, useEffect } from 'react';

import { DeckComponent } from '../components/DeckComponent';
import { SearchBar } from '../components/SearchBar';

export const DeckListPage = ({api}) => {
    const [deck, setDeck] = useState(null);
    const [filteredDeck, setFilteredDeck] = useState(deck);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const getDeck = async (api) => { 
        try {
            const response = await axios.get(api);
            setDeck(response.data);
            setFilteredDeck(response.data);
        } catch(e) {
            setError(e);
        } finally {
            setIsLoading(false);
        }
    }
    const apiPath = api;
    useEffect(() => {
        getDeck(apiPath);
    },[apiPath]);

    if(error) return (<h1>Failed to load deck</h1>);
    if(isLoading) return (<h1>Loading Deck...</h1>);
    return (
        <>
            <h1>Anki Deck Items:</h1>
            <SearchBar deck={deck} setFilteredDeck={setFilteredDeck}/>           
            <DeckComponent deck={filteredDeck}/>
        </>
    )
}