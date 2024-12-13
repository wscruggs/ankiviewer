import TextField from "@mui/material/TextField";

export const SearchBar = ({deck, setFilteredDeck}) => {

    const filterInput = (e) => {
        let lowerCase = e.target.value.toLowerCase();

        const filteredData = deck.filter((card) => {
            if(lowerCase === '')
                return card;
            let reading = card.Reading.replace("ꜛ", "");
            reading = reading.replace("ꜜ", "");
            let japanese = card.Japanese;
            return (card.Meaning.toLowerCase().includes(lowerCase) || 
                japanese.includes(lowerCase) ||
                reading.includes(lowerCase));
        })

        setFilteredDeck(filteredData);
    }

    return (
        <>
            <TextField id="outlined-classic"
            variant="outlined"
            fullWidth
            label="Search"
            onChange={filterInput} />
        </>
    )
}