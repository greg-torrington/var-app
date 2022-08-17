import { Contract, ethers } from 'ethers';
import './App.css';

function App() {

  const abi = [
    // Some details about the token
    "function name() view returns (string)",
    "function symbol() view returns (string)",

    // Get allowance of token holder
    "function allowance(address owner, address spender) external view returns (uint256)",
  
    // Get the account balance
    "function balanceOf(address) view returns (uint)",
  ];

  var provider = null;
  var erc20 = null;
  var spenderAddress = null;

  var csvFile = null;

  var userAddressType = "none";
  var endpointInputDisplayed = false;
  var usersSectionError = ""; // either options, csv, or comma

  var screenDiv = null;

  async function recordScreenDiv(){
    screenDiv = document.getElementById("screen-div").cloneNode( true );
  }

  async function submitButtonPressed(){

    if (await checkDefaultProviderInput()){
      
      if (await checkERC20Input()){

        if (await checkSpenderAddressInput()){

          if (usersSectionError==="options" && userAddressType==="none"){
            document.getElementById("useroptions-p").className = "hidden";
            usersSectionError = "";
          } else if (usersSectionError==="csv" && userAddressType==="CSV"){
            document.getElementById("csv-p").className = "hidden";
            usersSectionError = "";
          } else if (usersSectionError==="comma" && userAddressType==="commaInput"){
            document.getElementById("commainput-p").className = "hidden";
            usersSectionError = "";
          }

          if (userAddressType==="none"){

            var tag = document.getElementById("useroptions-p");
            tag.className = "text-red-500 text-xs italic";
            usersSectionError = "options"

          } else if (userAddressType==="CSV"){

            if (csvFile==null){

              var tag = document.getElementById("csv-p");
              tag.className = "text-red-500 text-xs italic";
              usersSectionError = "csv"
  
            } else {

              calculateVaRAsCSV();

            }

          } else {

            if (document.getElementById("usersaddresses-input").value===""){
              document.getElementById("usersaddresses-input").className = "appearance-none block w-full bg-gray-200 text-gray-700 border border-red-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500";
              var tag = document.getElementById("commainput-p");
              tag.className = "text-red-500 text-xs italic";
              usersSectionError = "comma"
            } else {
              document.getElementById("usersaddresses-input").className = "appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500";
              calculateVaRAsCommaSeperatedList();
            }

          }

        }

      }

    }

  }

  async function checkDefaultProviderInput(){

    if (endpointInputDisplayed){

      var providerUrl = document.getElementById("defaultendpoint-input").value;

      if (providerUrl===""){

        document.getElementById("defaultendpoint-input").className = "appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500";
        var tag = document.getElementById("endpoint-p");
        tag.className = "text-red-500 text-xs italic";

        return false;

      } else {

        document.getElementById("endpoint-p").className = "hidden";
        document.getElementById("defaultendpoint-input").className = "appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500";
  
        provider = new ethers.providers.JsonRpcProvider(providerUrl);
        
        return true;

      }

    } else if (document.getElementById("defaultendpoint-select").value==="Select end point") {

      document.getElementById("defaultendpoint-select").className = "bg-gray-50 border border-red-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";
      var tag = document.getElementById("endpoint-p");
      tag.className = "text-red-500 text-xs italic";

      return false;

    } else {

      var providerUrl = document.getElementById("defaultendpoint-select").value;

      document.getElementById("endpoint-p").className = "hidden";
      document.getElementById("defaultendpoint-select").className = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";
      
      provider = new ethers.providers.JsonRpcProvider(providerUrl);
      return true;

    }

  }

  async function createOtherEndpointInput(){

    var providerUrl = document.getElementById("defaultendpoint-select").value;

    if (providerUrl==="Other"){

      endpointInputDisplayed = true;

      var select = document.getElementById("defaultendpoint-select");

      var endpointInput = document.createElement("input");
      endpointInput.className = "appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500";
      endpointInput.id = "defaultendpoint-input";
      endpointInput.placeholder = "https://endpointurl";

      var endpointLabel = document.getElementById("defaultendpoint-label");
      endpointLabel.htmlFor = "defaultendpoint-input"
      endpointLabel.innerHTML = "Enter enpoint url:"

      select.replaceWith(endpointInput);

    }

  }

  async function checkERC20Input(){

    var erc20Address = document.getElementById("erc20-input").value;

    if (erc20Address===""){

      document.getElementById("erc20-input").className = "appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500";
      var tag = document.getElementById("erc20-p");
      tag.className = "text-red-500 text-xs italic";

      return false;

    } else {

      document.getElementById("erc20-p").className = "hidden";
      document.getElementById("erc20-input").className = "appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500";

      erc20 = new ethers.Contract(erc20Address, abi, provider);
      console.log(await erc20.name());

      return true;

    }

  }

  async function checkSpenderAddressInput(){

    spenderAddress = document.getElementById("spender-input").value;

    if (spenderAddress===""){

      document.getElementById("spender-input").className = "appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500";
      var tag = document.getElementById("application-p");
      tag.className = "text-red-500 text-xs italic";

      return false;

    } else{

      document.getElementById("application-p").className = "hidden";
      document.getElementById("spender-input").className = "appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500";

      return true;
    }

  }

  async function addFile(){

    csvFile = document.getElementById("csvfile");

    if (csvFile.value===""){
      var tag = document.createElement("p");
      tag.innerHTML = "No file added.";
      tag.className = "text-red-500 text-xs italic";
      document.getElementById("csvfile-div").appendChild(tag);
    } else {
      document.getElementById("submitfile-button").className = "visible md:invisible";
    }

  }

  async function calculateVaRAsCSV(){
    var input = csvFile.files[0];
    var reader = new FileReader();

    reader.onload = async function (e) {

      var button = document.getElementById("calculate-button");
      var spinner = document.getElementById("spinner-div");

      spinner.className = "flex justify-center items-center";

      button.replaceWith(spinner);

      var text = e.target.result;
      
      var arrayUsersAddresses = text.split("\n");

      var VaRTotal = 0;
      for (var i=1; i<arrayUsersAddresses.length-1; i++){
        
        var balance = await erc20.balanceOf(arrayUsersAddresses[i].trim());
        balance = parseFloat(ethers.utils.formatEther(balance));
        
        var allowance = erc20.allowance(arrayUsersAddresses[i].trim(), spenderAddress);
        allowance = allowance / 10**18;

        if (allowance<=balance){
          VaRTotal += allowance;
        } else {
          VaRTotal += balance;
        }

      }
      
      document.getElementById("varcalculated-label").innerHTML = "VaR Calculated: $" + VaRTotal.toFixed(2);

      spinner.className = "hidden";

    };

    reader.readAsText(input);
  }

  async function calculateVaRAsCommaSeperatedList(){

    var list = document.getElementById("usersaddresses-input").value;
    var arrayUsersAddresses = list.split(",");

    var button = document.getElementById("calculate-button");
    var spinner = document.getElementById("spinner-div");

    spinner.className = "flex justify-center items-center";

    button.replaceWith(spinner);

    var VaRTotal = 0;
    for (var i=0; i<arrayUsersAddresses.length; i++){

      var balance = await erc20.balanceOf(arrayUsersAddresses[i]);
      balance = parseFloat(ethers.utils.formatEther(balance));

      var allowance = await erc20.allowance(arrayUsersAddresses[i], spenderAddress);
      allowance = allowance / 10**18;

      if (allowance<=balance){
        VaRTotal += allowance;
      } else {
        VaRTotal += balance;
      }

    }

    document.getElementById("varcalculated-label").innerHTML = "VaR Calculated: $" + VaRTotal.toFixed(2);

    spinner.className = "hidden";

  }

  async function openCSVFileDiv(){
    
    var usersOptionDiv = document.getElementById("usersoption-div");
    var CSVFileDiv = document.getElementById("csvfile-div");

    usersOptionDiv.replaceWith(CSVFileDiv);
    CSVFileDiv.className = "w-full px-3 visible";

    userAddressType = "CSV";

  }

  async function openCommaInputDiv(){

    var usersOptionDiv = document.getElementById("usersoption-div");
    var commaListDiv = document.getElementById("commainput-div");

    usersOptionDiv.replaceWith(commaListDiv);
    commaListDiv.className = "w-full px-3 visible";

    userAddressType = "commaInput";

  }

  async function resetForm(){

    document.getElementById("screen-div").replaceWith(screenDiv.cloneNode( true ));

    document.getElementById("defaultendpoint-select").onchange = function(){createOtherEndpointInput()};

    document.getElementById("reset-button").onclick = function(){resetForm()};
    document.getElementById("addcsvfile-label").onclick = function(){openCSVFileDiv()};
    document.getElementById("addinput-label").onclick = function(){openCommaInputDiv()};
    document.getElementById("submitfile-button").onclick = function(){addFile()};
    document.getElementById("calculate-button").onclick = function(){submitButtonPressed()};

    provider = null;
    erc20 = null;
    spenderAddress = null;

    csvFile = null;

    userAddressType = "none";
    endpointInputDisplayed = false;
    usersSectionError = "";

  }


  return (
    <div id="screen-div" className="grid h-screen place-items-center" onLoad={() => recordScreenDiv()}>

    <img src="https://media-float-capital.fra1.cdn.digitaloceanspaces.com/public/img/float-logo-sq-center.svg" width={100} height={100}/>

    <h1 style={{textAlign : "center"}} className="ttext-lg md:text-2xl font-vt323 font-extrabold text-center" id="varcalculated-label">
      VaR Calculated: $0
    </h1>

    <div id="varapp-div" className="w-full max-w-lg bg-white shadow-md rounded px-8 pt-6 pb-8">
      <div className="flex flex-wrap -mx-3 mb-6">
        <div id="endpoint-div" className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="defaultendpoint-select" id="defaultendpoint-label">
            Select an end point: 
          </label>
          <select id="defaultendpoint-select" style={{width : '200px'}} onChange={() => createOtherEndpointInput()} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option>Select end point</option>
            <option value="https://rpc.ankr.com/polygon">Polygon</option>
            <option value="https://rpc.ankr.com/avalanche">Avalanche</option>
            <option value="https://rpc.ankr.com/eth">Ethereum</option>
            <option value="Other">Other</option>
          </select>
          <p id="endpoint-p" className="hidden" >Please select an endpoint.</p>
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div id="erc20-div" className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="erc20-input" id="erc20-label">
            ERC20 Token Address:
          </label>
          <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="erc20-input" type="text" placeholder="0x00000000000000"/>
          <p id="erc20-p" className="hidden" >Please enter an erc20 address.</p>
        </div>
        <div id="spender-div" className="w-full md:w-1/2 px-3">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="spender-input" id="spender-label">
            Application Address:
          </label>
          <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="spender-input" type="text" placeholder="0x00000000000000"/>
          <p id="application-p" className="hidden" >Please enter an application address.</p>
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-2">
        <div id="usersoption-div" className="w-full px-3 visible">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="useroptions-pre" id="users-label">
            Choose user addresses input:
          </label>
          <div id="useroptions-div">
            <label id="addcsvfile-label" onClick={() => openCSVFileDiv()} className="block uppercase cursor-pointer tracking-wide text-blue-700 underline text-xs font-bold mb-2">
              Add user addresses as csv file.
            </label>
            <label id="addinput-label" onClick={() => openCommaInputDiv()} className="block uppercase cursor-pointer tracking-wide text-blue-700 underline text-xs font-bold mb-2">
              Add user addresses as comma seperated list.
            </label>
            <p id="useroptions-p" className="hidden" >Please select an input to insert user addresses.</p>
          </div>
        </div>
        <div id="csvfile-div" className="hidden">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="csvfile" id="users-label">
            Add CSV file:
          </label>
          <input type="file" id="csvfile" accept=".csv" />
          <button  id="submitfile-button" className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow" onClick={() => addFile()}>Submit</button>
          <p id="csv-p" className="hidden" >Please choose a csv file and click 'Submit'.</p>
        </div>
        <div id="commainput-div" className="hidden">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="usersaddresses-input" id="usersaddresses-label">
            Add users addresses as comma seperated list:
          </label>
          <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="usersaddresses-input" type="text" placeholder="e.g. address1,address2,address3"/>
          <p id="commainput-p" className="hidden" >Please enter user addresses.</p>
        </div>
      </div>
      <div className="relative">
        <div className="absolute top-0 right-0">
          <label id="reset-button" onClick={() => resetForm()} className="block uppercase cursor-pointer tracking-wide text-red-700 underline text-xs font-bold mb-2">
            RESET
          </label>
        </div>
      </div>
    </div>

    <button id="calculate-button" className="bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => submitButtonPressed()}>
      Calculate VaR
    </button>

    <div id="spinner-div" className="hidden">
      <div className="animate-spin w-10 h-10" role="status">
        <img src="images/spinner.jpg"></img>
      </div>
    </div>

    </div>
  );
}

export default App;
