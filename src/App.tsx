import React from 'react';
import {UserProvider} from "./UserContext";
//импорты картинок


//импорты css
import './App.css';
import './vendor/normalize.css';
import './vendor/fonts/fonts.css';

import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";

function App()  {
  return (
      <UserProvider>
      <div className="App">
          <Header />
          <Main />
          <Footer />
      </div>
      </UserProvider>
  );
}

export default App;
