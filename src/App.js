import './App.css';


function filterTable(){

  var filterInput = document.getElementById("filter-input");
  //console.log(filterInput.value);

}

function App() {
  return (
    <div className="App">
      <div className="flex lg:justify-center min-h-screen">
        <div className="w-full text-gray-900 font-base">
          <div className="flex flex-col h-screen">
            <div className="m-auto pt-20 w-full">
              <div>
                <div className="flex flex-col items-center justify-center w-full">
                  <div className="w-9/10 md:w-auto flex flex-col md:max-w-mint-width">
                    <div className="border border:black mt-5 md:mt-0 md:min-w-mint-width md:max-w-mint-width p-6 mb-5 rounded-lg custom-animations_shine__1YTqy  md:order-2 order-1">
                      <h1 className="font-bold text-center text-lg font-alphbeta pb-2">
                          Approval Adjusted Value at Risk Leader Board
                      </h1>
                      <div className="px-1">
                        <div className="general-styles_screen-centered-container__3fxeE h-full ">
                          <form className="h-full">
                            <div className="relative">
                              <div className="flex flex-row my-3 shadow-md">
                                <input id="filter-input" onChange={() => filterTable()} placeholder="Enter protocol name, token or contract address" type="text" className="py-2 font-normal text-grey-darkest w-full py-1 px-2 outline-none text-md text-gray-600 flex-1" />
                              </div>
                              <div className="inline-block mx-auto py-2 w-full">
                                <div className="rounded-lg border-primary border-2 w-full max-h-60 overflow-y-auto no-scrollbar">
                                  <table className="w-full text-center divide-y divide-gray-200">
                                    <thead className="divide-y divide-gray-200 bg-white border-b sticky top-0">
                                      <tr className="text-xs md:text-xxs lg:text-xs">
                                       <td className="px-1 underline font-bold py-3">Rank</td>
                                       <td className="px-1 underline font-bold py-3">Protocol</td>
                                       <td className="px-1 underline font-bold py-3">Approval Adjusted VaR</td>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                      <tr className="text-xs md:text-xxs lg:text-xs">
                                       <td className="px-1 py-3 underline">1</td>
                                       <td className="px-1 py-3 cursor-pointer ">Curve</td>
                                       <td className="px-1 py-3">$227711</td>
                                      </tr>
                                      <tr className="text-xs md:text-xxs lg:text-xs">
                                       <td className="px-1 py-3 underline">2</td>
                                       <td className="px-1 py-3 cursor-pointer ">Aave</td>
                                       <td className="px-1 py-3">$225451</td>
                                      </tr>
                                      <tr className="text-xs md:text-xxs lg:text-xs">
                                       <td className="px-1 py-3 underline">3</td>
                                       <td className="px-1 py-3 cursor-pointer ">Eth</td>
                                       <td className="px-1 py-3">$221</td>
                                      </tr>
                                      <tr className="text-xs md:text-xxs lg:text-xs">
                                       <td className="px-1 py-3 underline">4</td>
                                       <td className="px-1 py-3 cursor-pointer ">Uniswap</td>
                                       <td className="px-1 py-3">$29090</td>
                                      </tr>
                                      <tr className="text-xs md:text-xxs lg:text-xs">
                                       <td className="px-1 py-3 underline">5</td>
                                       <td className="px-1 py-3 cursor-pointer ">yolo</td>
                                       <td className="px-1 py-3">$295590</td>
                                      </tr>
                                      <tr className="text-xs md:text-xxs lg:text-xs">
                                       <td className="px-1 py-3 underline">6</td>
                                       <td className="px-1 py-3 cursor-pointer ">pfkfk</td>
                                       <td className="px-1 py-3">$295590</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
