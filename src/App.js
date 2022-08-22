import { Contract, ethers } from 'ethers';
import { unstable_renderSubtreeIntoContainer } from 'react-dom';
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

  // For the first three inputs recorded.
  var provider = null;
  var erc20 = null;
  var spenderAddress = null;

  // Determines if input text field is displayed, this text field is displayed when "other" 
  // selected from select box.
  var endpointInputTextFieldDisplayed = false;

  // Used to determine if csv file has been created.
  var csvFile = null;

  // Holds the value of the original html screen for the reset button.
  var screenDiv = null;

  // Determines if the table has been created from the "SEE USER LOGS" button, 
  // if so the value will be false.
  var tableNotCreated = true;

  // Arrays for recording user addresses relevant data.
  var userAddresses = [];
  var userBalances = [];
  var userAllowances = [];

  // Determines if VaR has been calculated
  var VaRCalculated = false;

  // Gets original html content for replacement later with "RESET" button.
  async function recordScreenDiv(){ 

    screenDiv = document.getElementById("screen-div").cloneNode( true );

  }

  // Each if statment determines if the correct data has been entered for each input field
  // if not a error message will be displayed under the input field which has the incorrect
  // data.
  async function submitButtonPressed(){

    if (await checkDefaultProviderInput()){
      
      if (await checkERC20Input()){

        if (await checkSpenderAddressInput()){

          if (document.getElementById("usersoption-div").offsetParent!=null){

            var tag = document.getElementById("useroptions-p");
            tag.className = "text-red-500 text-xs italic";

          } else if (document.getElementById("csvfile-div").offsetParent!=null){

            if (csvFile==null){

              var tag = document.getElementById("csv-p");
              tag.className = "text-red-500 text-xs italic";
  
            } else {

              document.getElementById("csv-p").className = "hidden";
              calculateVaRAsCSV();

            }

          } else {

            if (document.getElementById("usersaddresses-input").value===""){

              document.getElementById("usersaddresses-input").className = "appearance-none block w-full bg-gray-200 text-gray-700 border border-red-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500";
              var tag = document.getElementById("commainput-p");
              tag.className = "text-red-500 text-xs italic";

            } else {

              document.getElementById("usersaddresses-input").className = "appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500";
              document.getElementById("commainput-p").className = "hidden";
              calculateVaRAsCommaSeperatedList();

            }

          }

        }

      }

    }

  }

  // Determines what data has been entered for the provider url, if correct it will create
  // provider and return true. If input entered is wrong it will return false with an error
  // message.
  async function checkDefaultProviderInput(){

    if (endpointInputTextFieldDisplayed){

      var providerUrl = document.getElementById("defaultendpoint-input").value;

      if (providerUrl===""){

        document.getElementById("defaultendpoint-input").className = "appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500";
        var tag = document.getElementById("inputendpoint-p");
        tag.className = "text-red-500 text-xs italic";

        return false;

      } else {

        document.getElementById("inputendpoint-p").className = "hidden";
        document.getElementById("defaultendpoint-input").className = "appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500";
  
        provider = new ethers.providers.JsonRpcProvider(providerUrl);

        return true;

      }

    } else if (document.getElementById("defaultendpoint-select").value==="Select end point") {

      document.getElementById("defaultendpoint-select").className = "bg-gray-50 border border-red-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";
      var tag = document.getElementById("selectendpoint-p");
      tag.className = "text-red-500 text-xs italic";

      return false;

    } else {

      var providerUrl = document.getElementById("defaultendpoint-select").value;

      document.getElementById("selectendpoint-p").className = "hidden";
      document.getElementById("defaultendpoint-select").className = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";
      
      provider = new ethers.providers.JsonRpcProvider(providerUrl);

      return true;

    }

  }

  // Determines if user has selected the "other" option, if so the select input field
  // will be replaced with an input text field for the chosen url
  async function createOtherEndpointInput(){

    var providerUrl = document.getElementById("defaultendpoint-select").value;

    if (providerUrl==="Other"){

      endpointInputTextFieldDisplayed = true;

      document.getElementById("selectendpoint-div").className = "hidden";

      document.getElementById("inputendpoint-div").className = "w-full px-3 mb-6 md:mb-0";
      document.getElementById("selectback-label").innerHTML = "<--";

      if (document.getElementById("inputendpoint-p").offsetParent!=null){

        document.getElementById("inputendpoint-p").className = "hidden";
        document.getElementById("defaultendpoint-input").className = "appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500";
  
      }

    }

  }

  // Changes back to select input
  async function switchBackToSelect(){
    
    endpointInputTextFieldDisplayed = false;

    document.getElementById("inputendpoint-div").className = "hidden";
    document.getElementById("selectendpoint-div").className = "w-full px-3 mb-6 md:mb-0";

    if (document.getElementById("selectendpoint-p").offsetParent!=null){

      document.getElementById("selectendpoint-p").className = "hidden";
      document.getElementById("defaultendpoint-select").className = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";

    }

    document.getElementById("defaultendpoint-select").value = "Select end point";

  }

  // Determines if a correct ERC20 address has been entered, return true if so else
  // return false with error message.
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

      return true;

    }

  }

  // Determines if a correct spender address has been entered, return true if so else
  // return false with error message.
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

  // Allows user to add csv file to the project.
  async function addFile(){

    if (document.getElementById("csv-p").offsetParent!=null){

      document.getElementById("csv-p").className = "hidden";

    }

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
  
  // Replaces the two options to input user addresses with an input for the CSV file
  async function openCSVFileDiv(){
    
    var usersOptionDiv = document.getElementById("usersoption-div");
    var CSVFileDiv = document.getElementById("csvfile-div");

    usersOptionDiv.className = "hidden";

    document.getElementById("csv-p").className = "hidden";

    if (csvFile!=null){

      document.getElementById("submitfile-button").className = "bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow";
      document.getElementById("csvfile").value = "";
      csvFile = null;

    }

    document.getElementById("csvback-label").innerHTML = "<--";
    CSVFileDiv.className = "w-full px-3";

  }

  // Replaces the two options to input user addresses with a input text field
  async function openCommaInputDiv(){

    var usersOptionDiv = document.getElementById("usersoption-div");
    var commaListDiv = document.getElementById("commainput-div");

    usersOptionDiv.className = "hidden";

    document.getElementById("commainput-p").className = "hidden";
    document.getElementById("usersaddresses-input").className = "appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500";

    document.getElementById("commaback-label").innerHTML = "<--";
    commaListDiv.className = "w-full px-3";

  }

  // Directs back to the two blue label options, from the input  choice
  // the user selected.
  async function switchBackToUserAddressOptions(){

    if (document.getElementById("commainput-div").offsetParent!=null){

      document.getElementById("commainput-div").className = "hidden";
      document.getElementById("usersaddresses-input").value = "";

    } else {

      document.getElementById("csvfile-div").className = "hidden";

    }

    document.getElementById("useroptions-p").className = "hidden";
    document.getElementById("usersoption-div").className = "w-full px-3";

  }

  // Reads the entered CSV file and calculated VaR and records user info
  async function calculateVaRAsCSV(){

    var input = csvFile.files[0];
    var reader = new FileReader();

    reader.onload = async function (e) {

      var button = document.getElementById("calculate-button");
      var spinner = document.getElementById("spinner-div");

      spinner.className = "flex justify-center items-center";
      button.className = "hidden";

      var text = e.target.result;
      
      var arrayUsersAddresses = text.split("\n");

      var VaRTotal = 0;
      for (var i=1; i<arrayUsersAddresses.length-1; i++){
        
        var balance = await erc20.balanceOf(arrayUsersAddresses[i].trim());
        balance = parseFloat(ethers.utils.formatEther(balance));
        
        var allowance = await erc20.allowance(arrayUsersAddresses[i].trim(), spenderAddress);
        allowance = allowance / 10**18;

        userAddresses[i-1] = arrayUsersAddresses[i].trim();
        userBalances[i-1] = balance.toFixed(2);
        userAllowances[i-1] = allowance.toFixed(2);

        if (allowance<=balance){

          VaRTotal += allowance;

        } else {

          VaRTotal += balance;

        }

      }
      
      document.getElementById("varcalculated-label").innerHTML = "VaR Calculated: $" + VaRTotal.toFixed(2);
      spinner.className = "hidden";
      button.className = "invisible";

      VaRCalculated = true;

      document.getElementById("showlogs-button").className = "block uppercase cursor-pointer tracking-wide text-green-700 underline text-xs font-bold mb-2";

    };

    reader.readAsText(input);
  }

  // Separates user input into an array and calculates VaR and records user input
  async function calculateVaRAsCommaSeperatedList(){

    var list = document.getElementById("usersaddresses-input").value;
    var arrayUsersAddresses = list.split(",");

    var button = document.getElementById("calculate-button");
    var spinner = document.getElementById("spinner-div");

    spinner.className = "flex justify-center items-center";
    button.className = "hidden";

    var VaRTotal = 0;
    for (var i=0; i<arrayUsersAddresses.length; i++){

      var balance = await erc20.balanceOf(arrayUsersAddresses[i]);
      balance = parseFloat(ethers.utils.formatEther(balance));

      var allowance = await erc20.allowance(arrayUsersAddresses[i], spenderAddress);
      allowance = allowance / 10**18;

      userAddresses[i] = arrayUsersAddresses[i];
      userBalances[i] = balance.toFixed(2);
      userAllowances[i] = allowance.toFixed(2);

      if (allowance<=balance){

        VaRTotal += allowance;

      } else {

        VaRTotal += balance;

      }

    }

    document.getElementById("varcalculated-label").innerHTML = "VaR Calculated: $" + VaRTotal.toFixed(2);
    spinner.className = "hidden";
    button.className = "invisible";

    VaRCalculated = true;

    document.getElementById("showlogs-button").className = "block uppercase cursor-pointer tracking-wide text-green-700 underline text-xs font-bold mb-2";

  }

  // Hides input webpage and displays users address info as a table
  async function displayLogs(){

    var style = window.getComputedStyle(document.getElementById("varapp-div"));
    var width = style.getPropertyValue("width");
    var height = style.getPropertyValue("height");
  
    document.getElementById("varapp-div").className = "hidden";

    document.getElementById("table-div").className = "overflow-y-auto overflow-x-auto bg-white shadow-md rounded p-4";
    document.getElementById("table-div").style.width = width;
    document.getElementById("table-div").style.height = height;
  
    if (tableNotCreated){
  
      var tableRef = document.getElementById('users-table').getElementsByTagName('tbody')[0];
  
      for (var i=0; i<userAddresses.length; i++){
  
      var row = tableRef.insertRow(tableRef.rows.length);
  
      row.innerHTML = '<tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">'+ 
                      '<td className="py-4 px-6 border border-slate-300">' + userAddresses[i] + '</td>'+
                      '<td className="py-4 px-6 border border-slate-300">' + '$' + userBalances[i] + '</td>'+
                      '<td className="py-4 px-6 border border-slate-300">' + '$' + userAllowances[i] + '</td></tr>';
  
      }
  
      tableNotCreated = false;
  
    }
  
  }

  // Displays explainer tool and hides previous webpage
  async function displayExplainerDiv(){

    var style = window.getComputedStyle(document.getElementById("varapp-div"));
    var width = style.getPropertyValue("width");
    var height = style.getPropertyValue("height");

    document.getElementById("varapp-div").className = "hidden";

    if (document.getElementById("calculate-button")!=null){

      document.getElementById("calculate-button").className = "invisible";

    }

    document.getElementById("explainer-div").className = "overflow-y-auto bg-white shadow-md rounded px-8 pt-6 pb-8 h-96";
    document.getElementById("explainer-div").style.width = width;
    document.getElementById("explainer-div").style.height = height;

  }
  
  // Hides the user address info table and displays the input page with already inputted info
  async function displayVaRApp(){

    if (document.getElementById("table-div").offsetParent!=null){

      document.getElementById("table-div").className = "hidden";

    } else {

      document.getElementById("explainer-div").className = "hidden";

      if (!VaRCalculated){

        document.getElementById("calculate-button").className = "bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded";

      }

    }

    document.getElementById("varapp-div").className = "max-w-lg bg-white shadow-md rounded px-8 pt-6 pb-8";
  
  }

  // Sets the input page back to its original content when webpage opened
  async function resetForm(){

    document.getElementById("screen-div").replaceWith(screenDiv.cloneNode( true ));

    document.getElementById("defaultendpoint-select").onchange = function(){createOtherEndpointInput()};

    document.getElementById("reset-button").onclick = function(){resetForm()};
    document.getElementById("showlogs-button").onclick = function(){displayLogs()};
    document.getElementById("oneback-button").onclick = function(){displayVaRApp()};
    document.getElementById("twoback-button").onclick = function(){displayVaRApp()};
    document.getElementById("addcsvfile-label").onclick = function(){openCSVFileDiv()};
    document.getElementById("addinput-label").onclick = function(){openCommaInputDiv()};
    document.getElementById("submitfile-button").onclick = function(){addFile()};
    document.getElementById("help-button").onclick = function(){displayExplainerDiv()};
    document.getElementById("calculate-button").onclick = function(){submitButtonPressed()};
    document.getElementById("selectback-label").onclick = function(){switchBackToSelect()};
    document.getElementById("csvback-label").onclick = function(){switchBackToUserAddressOptions()};
    document.getElementById("commaback-label").onclick = function(){switchBackToUserAddressOptions()};

    provider = null;
    erc20 = null;
    spenderAddress = null;

    endpointInputTextFieldDisplayed = false;

    csvFile = null;

    tableNotCreated = true;

    userAddresses = [];
    userBalances = [];
    userAllowances = [];

    VaRCalculated = false;

  }

  return (
  <div id="screen-div" className="grid h-screen place-items-center" onLoad={() => recordScreenDiv()}>

    <img src="https://media-float-capital.fra1.cdn.digitaloceanspaces.com/public/img/float-logo-sq-center.svg" width={100} height={100}/>

    <h1 style={{textAlign : "center"}} className="ttext-lg md:text-2xl font-vt323 font-extrabold text-center" id="varcalculated-label">
      VaR Calculated: $0
    </h1>

    <div id="varapp-div" className="max-w-lg bg-white shadow-md rounded px-8 pt-6 pb-8">
      <div className="relative h-5">
        <button onClick={() => displayExplainerDiv()} id="help-button" className="absolute top-0 right-0 font-bold text-gray-900 bg-white border border-gray-900 focus:outline-none hover:bg-gray-300 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-2 py-1 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
          ?
        </button>
      </div>
      <div id="varcalcone-div" className="flex flex-wrap -mx-3 mb-6 pt-4">
        <div id="selectendpoint-div" className="w-full px-3 mb-6 md:mb-0">
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
          <p id="selectendpoint-p" className="hidden" >Please select an endpoint.</p>
        </div>
        <div id ="inputendpoint-div" className="hidden">
          <div className="flex" id="selectback-div" htmlFor="inputendpoint-label">
            <label id="selectback-label" onClick={() => switchBackToSelect()} className="block uppercase cursor-pointer tracking-wide text-red-500 text-xs font-bold mb-2">
            </label>
          </div>
          <label id="inputendpoint-label" htmlFor="defaultendpoint-input" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Enter enpoint url:
          </label>
          <input id="defaultendpoint-input" placeholder="https://endpointurl" className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"></input>
          <p id="inputendpoint-p" className="hidden" >Please enter an endpoint.</p>
        </div>
      </div>
      <div id="varcalctwo-div" className="flex flex-wrap -mx-3 mb-6 pt-4">
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
      <div id="varcalcthree-div" className="flex flex-wrap -mx-3 mb-2 pt-4">
        <div id="usersoption-div" className="w-full px-3">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="useroptions-pre" id="users-label">
            Choose user addresses input:
          </label>
          <div>
            <div className="flex">
              <label id="addcsvfile-label" onClick={() => openCSVFileDiv()} className="block uppercase cursor-pointer tracking-wide text-blue-700 underline text-xs font-bold mb-2">
                Add user addresses as csv file.
              </label>
            </div>
            <div className="flex">
              <label id="addinput-label" onClick={() => openCommaInputDiv()} className="block uppercase cursor-pointer tracking-wide text-blue-700 underline text-xs font-bold mb-2">
                Add user addresses as comma seperated list.
              </label>
            </div>
            <p id="useroptions-p" className="hidden" >Please select an input to insert user addresses.</p>
          </div>
        </div>
        <div id="csvfile-div" className="hidden">
          <div className="flex" htmlFor="csvusers-label">
            <label id="csvback-label" onClick={() => switchBackToUserAddressOptions()} className="block uppercase cursor-pointer tracking-wide text-red-500 text-xs font-bold mb-2">
            </label>
          </div>
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="csvfile" id="csvusers-label">
            Add CSV file:
          </label>
          <input type="file" id="csvfile" accept=".csv" />
          <button  id="submitfile-button" className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow" onClick={() => addFile()}>Submit</button>
          <p id="csv-p" className="hidden" >Please choose a csv file and click 'Submit'.</p>
        </div>
        <div id="commainput-div" className="hidden">
          <div className="flex" htmlFor="usersaddresses-label">
            <label id="commaback-label" onClick={() => switchBackToUserAddressOptions()} className="block uppercase cursor-pointer tracking-wide text-red-500 text-xs font-bold mb-2">
            </label>
          </div>
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="usersaddresses-input" id="usersaddresses-label">
            Add users addresses as comma seperated list:
          </label>
          <input id="usersaddresses-input" className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" placeholder="e.g. address1,address2,address3"/>
          <p id="commainput-p" className="hidden" >Please enter user addresses.</p>
        </div>
      </div>
      <div id="extras-div" className="relative pt-4">
        <div className="flex absolute left-0">
          <label id="showlogs-button" onClick={() => displayLogs()} className="hidden">
            SEE USERS LOGS
          </label>
        </div>
        <div className="flex absolute right-0">
          <label id="reset-button" onClick={() => resetForm()} className="block uppercase cursor-pointer tracking-wide text-red-700 underline text-xs font-bold mb-2">
            RESET
          </label>
        </div>
      </div>
    </div>

    <div id="table-div" className="hidden">
      <div className="relative h-10 w-10">
        <div className="absolute left-0 top-0">
          <label id="oneback-button" onClick={() => displayVaRApp()} className="block uppercase cursor-pointer tracking-wide text-red-700 underline text-xs font-bold mb-2">
            BACK
          </label>
        </div>
      </div>
      <table style={{textAlign: "center"}} id="users-table" className="w-full text-sm text-left text-gray-500 dark:text-gray-400 border-collapse border border-slate-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
				    <th className="py-3 px-6 border border-slate-300" scope="col">User Address</th>
				    <th scope="col" className="py-3 px-6 border border-slate-300">Balance</th>
				    <th scope="col" className="py-3 px-6 border border-slate-300">Allowances</th>
			    </tr>
        </thead>
        <tbody className="overflow-y-scroll">
        </tbody>
      </table>
    </div>

    <div id="explainer-div" className="hidden">
      <div className="relative h-6">
        <div className="absolute left-0 top-0">
          <label id="twoback-button" onClick={() => displayVaRApp()} className="block uppercase cursor-pointer tracking-wide text-red-700 underline text-xs font-bold mb-2">
            BACK
          </label>
        </div>
      </div>
      <div>
        <h1 className="text-center font-bold text-2xl pt-4 pb-4">
          Using the VaR App
        </h1>
      </div>
      <div>
        <div id="step1-div">
          <h1 className="text-center font-bold text-lg">
            Step 1: The three fields 
          </h1>
          <label className="text-sm">
            1.  Select a network to connect to. If desired network is not present
                select 'Other' and a textfield will appear to enter a url for 
                the network node that you need. To go back to the select options if
                'Other' was chosen, select the "RESET" label.
            <div className="grid place-items-center border">
              <label className="font-bold pt-4 text-xs">Netowork nodes to select:</label>
              <img src="images/select.png" className="w-25 h-20"></img>
              <label className="font-bold pt-6 text-xs">Field displayed when 'other' selected:</label>
              <img src="images/other.png" className="w-25 h-20"></img>
            </div>
            2.  Enter erc20 token address into the bottom left texfield.
            <div className="grid place-items-center border">
              <img src="images/bottomleft.png" className="w-25 h-20"></img>
            </div>
            3.  Enter contract address into the bottom right textfield. 
            <div className="grid place-items-center border">
              <img src="images/bottomright.png" className="w-25 h-20"></img>
            </div>
            <br/>
          </label>
        </div>
        <div id="step2-div">
          <h1 className="text-center font-bold text-lg pt-4">
            Step 2: The choice 
          </h1>
          <label className="text-sm">
            In this section you must enter the user addresses to calculate the VaR.
            If the addresses are held in a CSV file select the first link and pull
            the csv file from your library by using the 'Select file' button and clicking 'Submit'. Otherwise 
            you will need to enter the addresses as a comma seperated list by 
            clicking the second link, no button is required to submit addresses with the second option.
            To go back to the two address input options, click the 'RESET' label in the bottom right corner.
            <div className="grid place-items-center border">
              <label className="font-bold pt-4 text-xs">Choosing how to input user addresses:</label>
              <img src="images/choice.png" className="w-25 h-20"></img>
              <label className="font-bold pt-4 text-xs">Entering data as CSV file:</label>
              <img src="images/csv.png" className="w-25 h-20"></img>
            </div>
          </label>
        </div>
        <div id="step3-div">
          <h1 className="text-center font-bold text-lg pt-6">
            Step 3: The Calculation 
          </h1>
          <label className="text-sm">
            Once you have filled the four chosen inputs with data, select the 
            'Calculate VaR' button and a spinner will run until calculations 
            have completed, the VaR amount will be displayed below the FLOAT logo.
            <div className="grid place-items-center border">
              <img src="images/calculate.png" className="w-25 h-50"></img>
            </div>
          </label>
        </div>
        <div id="step3-div">
          <h1 className="text-center font-bold text-lg pt-6">
            Step 4: The Extras 
          </h1>
          <label className="text-sm">
            1.  The red 'RESET' label, in the bottom right corner, will set the webpage 
                back to its original content when loaded. 
            <br/>
            2.  The green 'SHOW USERS LOGS' label switches to a page which displays all the 
                users addresses that were entered as well as their respected balance 
                and allowance.
            <br/>
            3.  The '?' button in the top right corner is where you are now! We are explaining
                how to use this app in the most efficient way.
            <br/>
            4.  The red 'BACK' label is displayed when the 'SHOW USERS LOGS' label or the '?' button 
                is selected. This will direct you back to the original page where the VaR was
                calculated.
            <div className="grid place-items-center border">
              <label className="font-bold pt-4 text-xs">'SELECT USERS LOGS', 'RESET' and '?' buttons:</label>
              <img src="images/extras.png" className="w-25 h-40"></img>
              <label className="font-bold pt-4 text-xs">User addresses table and 'BACK' button:</label>
              <img src="images/table.png" className="w-25 h-40"></img>
            </div>
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
