import './App.css';
import { Routes, Route } from "react-router-dom"
import LeaderBoard from './Pages/LeaderBoard';
import ChosenProtocol from './Pages/ChosenProtocol';
import TotalVAR from './Pages/TotalVAR';

function App(){

  return (
    <div className="App">
      <div className="flex lg:justify-center min-h-screen">
        <div className="w-full text-gray-900 font-base">
          <div className="flex flex-col h-screen">
            <div className="absolute bg-primary p-1 mb-2 h-10 flex items-center w-full font-default">
            </div>
            <div className="absolute w-full py-1 top-10">
              <nav className="mx-auto w-full max-w-5xl p-2 h-12 flex justify-between items-center text-sm">
                <a className="flex items-center">
                  <span className="text-xl text-emerald-800 ml-2 align-middle font-semibold">
                    <div className="general-styles_logo-container__1H9O2">
                      <img className="h-8 md:h-7 w-full md:w-auto" src="https://media-float-capital.fra1.cdn.digitaloceanspaces.com/public/img/float-logo-sq-center.svg">
                      </img>
                    </div>
                  </span>
                </a>
              </nav>
            </div>
            <div className="m-auto pt-20 w-full">
                <Routes>
                  <Route path="/" element={ <LeaderBoard/> } />
                  <Route path="/protocol" element={ <ChosenProtocol/> } />
                  <Route path="/totalVAR" element={ <TotalVAR/> } />
                </Routes>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
