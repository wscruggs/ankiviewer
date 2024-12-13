import deck from './data/AnkiDeck.json';

import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ReactDOM } from 'react-dom';
import { DeckListPage } from '../pages/DeckListPage';

import { act, render, fireEvent, cleanup, waitFor } from '@testing-library/react';
import axiosMock from 'axios';

afterEach(cleanup);

it('List the deck of cards', async () => {
    axiosMock.get.mockResolvedValue({data : deck});

    const url = "/api/deck";
    const { getByText } = render(
        <Router>
            <DeckListPage api={url} />
        </Router>
    );

    expect(getByText(/Loading Deck.../i).textContent).toBe("Loading Deck...");

    await waitFor(() => {expect( getByText("Anki Deck Items:")).toBeInTheDocument()});

    expect(axiosMock.get).toHaveBeenCalledTimes(1);
    expect(axiosMock.get).toHaveBeenCalledWith(url);
});

it('Failed to load deck', async () => {
    axiosMock.get.mockResolvedValue(null);

    const url = "/api/deck";
    const { getByText } = render(
        <Router>
            <DeckListPage api={url} />
        </Router>
    );

    expect(getByText(/Loading Deck.../i).textContent).toBe("Loading Deck...");

    await waitFor(() => {expect( getByText("Failed to load deck")).toBeInTheDocument()});
    
    expect(axiosMock.get).toHaveBeenCalledTimes(1);
    expect(axiosMock.get).toHaveBeenCalledWith(url)
})
