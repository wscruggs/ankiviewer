import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { DeckListPage } from './pages/DeckListPage';
import { CardPage } from './pages/CardPage';
import { AddCardPage } from './pages/AddCardPage';
import { RequestedCardListPage } from './pages/RequestedCardListPage'; 
import { LoginPage } from './pages/LoginPage'
import { DownloadDeckPage } from './pages/DownloadDeckPage';
import { NavBar } from './components/NavBar'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <NavBar />
        <div>
          <Routes>
            <Route path="/deck" element={<DeckListPage api="/api/deck"/>}/>
            <Route path="/card/:id" element={<CardPage api="/api/card/" />}/>
            <Route path="/addCard" element={<AddCardPage api="/api/addCard"/>}/>
            <Route path="/requestedCardList" element={<RequestedCardListPage api="/api/requestedCardList" exportApi="/api/exportDeck"/>}/>
            <Route path="*" element={<DeckListPage api="/api/deck" />}/>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/downloads" element={<DownloadDeckPage api="/api/downloadDeck" />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
