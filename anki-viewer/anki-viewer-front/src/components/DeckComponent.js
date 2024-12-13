import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const getId = (card, index = -1) => {
    if( -1 === index) return String(card._id) + String(card.Id);
    else return card[index] + String(card._id) + String(card.Id);
}

export const CardHeaders = ({card, extraHeaders}) => {
    let locCard = card;
    if(extraHeaders != null)
        locCard = {...card, ...extraHeaders};
    return(
        locCard != null && locCard.length !== 0 &&
        <li className='table-header' key="header-row">
            { locCard != null && Object.keys(locCard).map((key) => key !== "Id" && key !== "_id" && 
                <div key={key}>{key}</div>
            )}
        </li>
    )
}

export const CardRow = ({card}) => {
    return(
        card != null && card.length !== 0 &&
        <li className='table-row'>
            { card != null && Object.keys(card).map((key) => key !== "Id" && key !== "_id" &&
                <div key={key}>{card[key]}</div>
            )}
        </li>
    )
}

export const DeckComponent = ({deck, clickable = true}) => {
    const navigate = useNavigate();
    const goToCard = (cardId, clickable) => e => {
        if(clickable)
            navigate(`/card/${cardId}`);
    }
    return (
        <>
        { deck !== null && deck.length !== 0 &&
            <ul className='responsive-table'>
                <CardHeaders card={deck[0]} />
                {deck.map( (card) => (  
                    <li className='table-row' key={getId(card)} onClick={ goToCard(card.Id, clickable) }>
                        { Object.keys(card).map( (key) => ( 
                            key !== "Id" && key !== "_id" &&
                            <div key={ getId(card, key)}>{card[key]}</div> 
                        ))}
                    </li> 
                ))}
            </ul>
        }
        </>
    )
}

export const RequestedCardListComponent = ({deck, onCardAddRemove}) => {

    const addCard = async (card) => {
        card = card.card;
        const response = await axios.post('/api/insertIntoAnki', card);

        if(response.status === 200) {
            const newDeck = response.data;
            onCardAddRemove(newDeck);
        } else {
             console.log("failure");
        }
    }

    const rejectCard = async (card) => {
        card = card.card;
        const response = await axios.post('/api/rejectCard', card);

        if(response.status === 200) {
            const newDeck = response.data;
            onCardAddRemove(newDeck)
        }
    }
    const add = "";
    const reject = "";
    const extraHeaders = { add, reject };
    
    return (
        <>
        { deck && deck.length !== 0 &&
            <ul className='responsive-table'>
                <CardHeaders card={deck[0]} extraHeaders={extraHeaders} />
                {deck.map( (card) => (  
                    <li className='table-row' key={getId(card)}>
                        { Object.keys(card).map( (key) => ( 
                            key !== "_id" &&
                            <div key={ getId(card, key)}>{card[key]}</div> 
                        ))}
                        <div><button className='btn-table' onClick={() => addCard({card})}>Add</button></div>
                        <div><button className='btn-table' onClick={() => rejectCard({card})}>Reject</button></div>
                    </li> 
                ))}
            </ul>
        }
        </>
    )
}