import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { CardHeaders, CardRow } from '../components/DeckComponent';


export const CardPage = ({api}) => {
    const [card, setCard] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { id } = useParams(); 

    const getCard = useCallback( async () => {
        try {
            const response = await axios.get(String(api)+String(id));
            setCard(response.data);
        } catch(e) {
            setError(e);
        } finally {
            setIsLoading(false);
        }
    }, [api, id])

    useEffect(() => {
        getCard();
    },[getCard]);

    if(error) return (<h1>Could not find card</h1>);

    return (
        <>
            <h1>Anki Card:</h1>
            { isLoading && <p>Loading Card</p> }
            { !isLoading &&
            <ul className='responsive-table' >
                <CardHeaders card={card} />
                <CardRow card={card} />
            </ul>
            }
        </>
    )
}