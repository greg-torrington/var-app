import logo from './logo.svg';
import './App.css';
import { Contract, ethers } from 'ethers';

function App() {

  const abi = [
    // Some details about the token
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function allowance(address owner, address spender) external view returns (uint256)",
  
    // Get the account balance
    "function balanceOf(address) view returns (uint)",
  ];

  var usersArray = [];

  var provider = null;
  var erc20 = null;
  var spenderAddress = null;

  var preEndPoint = null;
  var preERC20 = null;
  var preSpender = null;
  var preUsers = null;
  var preVaR =  null;

  async function connectToDefaultEndPoint(){

    var endPoint = document.getElementById("defaultendpoints").value;

    preEndPoint = document.getElementById("pre-endpoint");

    if (endPoint!=="Other"){

      provider = new ethers.providers.JsonRpcProvider(endPoint);

      document.getElementById("endpointlabel").hidden = true;
      document.getElementById("defaultendpoints").hidden = true;

      var i=0;
      provider.on('debug', (data)=> {
      if(data.error && i==0) {
          var errorLabel = document.createElement("label");
          errorLabel.innerHTML = "Error connecting! :(";
          preEndPoint.appendChild(errorLabel);
          i++;
      }
      });

      var connectionSuccess = document.createElement("label");
      connectionSuccess.innerHTML = "Connection to network is successful! :D";
      preEndPoint.appendChild(connectionSuccess);

      createERC20TokenInput();
      
    } else {

      var dropdown = document.getElementById("defaultendpoints");
      dropdown.hidden = true;
      var endPointInput = document.createElement("text");
      endPointInput.innerHTML = "<input type='text' id='endpointtext'/>";
      var endPointButton = document.createElement("button");
      endPointButton.type = "button";
      endPointButton.id = "endpointbutton"
      endPointButton.innerHTML = "Submit";

      preEndPoint.appendChild(endPointInput);
      preEndPoint.appendChild(endPointButton);

      endPointButton.onclick = function() {connectToNewEndPoint()};

    }

  }

  async function connectToNewEndPoint(){

    var endPoint = document.getElementById("endpointtext").value;
    provider = new ethers.providers.JsonRpcProvider(endPoint);

    document.getElementById("endpointlabel").hidden = true;
    document.getElementById("endpointtext").hidden = true;
    document.getElementById("endpointbutton").hidden = true;

    var i=0;
    provider.on('debug', (data)=> {
      if(data.error && i==0) {
          var errorLabel = document.createElement("label");
          errorLabel.innerHTML = "Error connecting! :(";
          preEndPoint.appendChild(errorLabel);
          i++;
      }
    });

    var connectionSuccess = document.createElement("label");
    connectionSuccess.id = "connection-success-endpoint";
    connectionSuccess.innerHTML = "Connection to network is successful! :D";
    preEndPoint.appendChild(connectionSuccess);

    createERC20TokenInput();

  }

  async function createERC20TokenInput(){

    var erc20Label = document.createElement("label");
    erc20Label.id = "erc20label";
    erc20Label.innerHTML = "Enter ERC20 token address: ";
    var erc20Input = document.createElement("text");
    erc20Input.innerHTML = "<input type='text' id='erc20text' size='50'/>";
    var erc20button = document.createElement("button");
    erc20button.type = "button";
    erc20button.id = "erc20button";
    erc20button.innerHTML = "submit";

    preERC20 = document.getElementById("pre-erc20");
    preERC20.appendChild(erc20Label);
    preERC20.appendChild(erc20Input);
    preERC20.appendChild(erc20button);

    erc20button.onclick = function() {createERC20Contract()};

  }

  async function createERC20Contract(){

    var erc20Address = document.getElementById("erc20text").value;
    erc20 = new ethers.Contract(erc20Address, abi, provider);

    document.getElementById("erc20label").hidden = true;
    document.getElementById("erc20text").hidden = true;
    document.getElementById("erc20button").hidden = true;

    var erc20Name = await erc20.name();

    var connectionSuccess = document.createElement("label");
    connectionSuccess.id = "connection-success-erc20"
    connectionSuccess.innerHTML = "ERC20 Contract, " + erc20Name + ", created! :D";
    preERC20.appendChild(connectionSuccess);

    createSpenderInput();

  }

  async function createSpenderInput(){

    var spenderLabel = document.createElement("label");
    spenderLabel.id = "spenderlabel";
    spenderLabel.innerHTML = "Enter Application (Spender) Address: ";
    var spenderText = document.createElement("text");
    spenderText.innerHTML = "<input type='text' id='spendertext' size='50'/>";
    var spenderButton = document.createElement("button");
    spenderButton.type = "button";
    spenderButton.id = "spenderbutton";
    spenderButton.innerHTML = "Submit";

    preSpender = document.getElementById("pre-Spender");
    preSpender.appendChild(spenderLabel);
    preSpender.appendChild(spenderText);
    preSpender.appendChild(spenderButton);

    spenderButton.onclick = function() { recordSpenderAddress() };

  }

  async function recordSpenderAddress(){

    spenderAddress = document.getElementById("spendertext").value;

    document.getElementById("spenderlabel").hidden = true;
    document.getElementById("spendertext").hidden = true;
    document.getElementById("spenderbutton").hidden = true;

    var recordSuccess = document.createElement("label");
    recordSuccess.id = "record-success-spender";
    recordSuccess.innerHTML = "Application (Spender) address, " + spenderAddress + ", recorded!"

    preSpender.appendChild(recordSuccess);

    createUsersInput();

  }

  async function createUsersInput(){

    var usersLabel = document.createElement("label");
    usersLabel.id = "userslabel";
    usersLabel.innerHTML = "Enter list of users: ";
    var usersText = document.createElement("text");
    usersText.innerHTML = "<input type='text' id='userstext' size='50' value='e.g. address1,address2,address3,...'/>";
    var usersButtton = document.createElement("button");
    usersButtton.id = "usersbutton";
    usersButtton.type = "button";
    usersButtton.innerHTML = "Submit";

    preUsers = document.getElementById("pre-Users");
    preUsers.appendChild(usersLabel);
    preUsers.appendChild(usersText);
    preUsers.appendChild(usersButtton);

    usersButtton.onclick = function() { recordUsers() };

  }

  async function recordUsers(){

    var usersListWithCommas = document.getElementById("userstext").value;
    usersArray = usersListWithCommas.split(",");

    document.getElementById("userslabel").hidden = true;
    document.getElementById("userstext").hidden = true;
    document.getElementById("usersbutton").hidden = true;

    var recordSuccess = document.createElement("label");
    recordSuccess.id = "record-success-users";
    recordSuccess.innerHTML = "All token holder addresses recorded!";

    preUsers.appendChild(recordSuccess);

    createVaRButton();

  }

  async function createVaRButton(){

    var varButton = document.createElement("button");
    varButton.id = "varbutton";
    varButton.type = "button";
    varButton.innerHTML = "Calculate VaR";

    preVaR = document.getElementById("pre-VaR");
    preVaR.appendChild(varButton);

    varButton.onclick = function () {calculateVaR()};

  }

  async function calculateVaR(){
    console.log("var shall be done tomorrow!");
  }
  
  // async function addContract(){

  //   contractAddress = document.getElementById("contractAddress").value;

  //   erc20 = new ethers.Contract(contractAddress, abi, provider);

  //   let tokenName = await erc20.name();
  //   document.getElementById('contractName').innerHTML = tokenName;

  // }

  // async function addUser(){
  //   let userAddress = document.getElementById("userAddress").value;
  //   document.getElementById("userAddress").value =  "";
  //   users[arrayLength] = userAddress;

  //   let num = await erc20.balanceOf(userAddress);
  //   let balance = parseFloat(ethers.utils.formatEther(num));
  //   balance = balance.toFixed(2);

  //   let allowance = await erc20.allowance(userAddress, allowanceSpenderAddress);
  //   allowance = allowance / 10**18;
  //   allowance = allowance.toFixed(2);

  //   var table = document.getElementById("usersTable");

  //   var rows = table.getElementsByTagName("tr").length;
  //   var row = table.insertRow(rows);

  //   var cell1 = row.insertCell(0);
  //   var cell2 = row.insertCell(1);
  //   var cell3 = row.insertCell(2);
  //   cell1.innerHTML = userAddress;
  //   cell2.innerHTML = "$" + balance;
  //   cell3.innerHTML = "$" + allowance;

  //   arrayLength = arrayLength + 1;
  // }

  return (
    <div className="App">

      <h1>Allowance adjusted VaR calculated by FLOAT</h1>

      <pre id="pre-endpoint">
        <label id="endpointlabel">Connect to network:</label>

        <select name="endpoints" id="defaultendpoints" onChange={() => connectToDefaultEndPoint()}>
          <option value=""></option>
          <option value="https://rpc.ankr.com/polygon">Polygon</option>
          <option value="https://rpc.ankr.com/avalanche">Avalanche</option>
          <option value="https://rpc.ankr.com/eth">Ethereum</option>
          <option value="Other">Other</option>
        </select>
      </pre>

      <pre id="pre-erc20">
      </pre>

      <pre id="pre-Spender">
      </pre>

      <pre id="pre-Users">
      </pre>

      <pre id="pre-VaR">
      </pre>

    </div>
  );
}

export default App;
