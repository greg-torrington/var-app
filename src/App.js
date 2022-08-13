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

  var usersArray = [];

  var provider = null;
  var erc20 = null;
  var spenderAddress = null;

  var preVaR =  null;

  var td2Endpoint = null;
  var td2ERC20 = null;
  var td2Spender = null;
  var td2Users = null;
  var td2VaR = null;

  async function connectToDefaultEndPoint(){

    var endPoint = document.getElementById("defaultendpoints").value;

    td2Endpoint = document.getElementById("td2-endpoint");

    if (endPoint!=="Other"){

      provider = new ethers.providers.JsonRpcProvider(endPoint);

      document.getElementById("endpointlabel").hidden = true;
      document.getElementById("defaultendpoints").hidden = true;

      var i=0;
      provider.on('debug', (data)=> {
      if(data.error && i==0) {
          var errorLabel = document.createElement("label");
          errorLabel.innerHTML = "Error connecting! :(";
          td2Endpoint.appendChild(errorLabel);
          i++;
      }
      });

      var connectionSuccess = document.createElement("label");
      connectionSuccess.innerHTML = "Connection to network is successful! :D";
      td2Endpoint.appendChild(connectionSuccess);

      var td1Endpoint = document.getElementById("td1-endpoint");
      var img = document.createElement("img");
      img.src = "images/one.jpg";
      img.style.height = "20px";
      td1Endpoint.appendChild(img);

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

      td2Endpoint.appendChild(endPointInput);
      td2Endpoint.appendChild(endPointButton);

      endPointButton.onclick = function() {connectToNewEndPoint()};

    }

  }

  async function connectToNewEndPoint(){

    var endPoint = document.getElementById("endpointtext").value;
    console.log(endPoint);
    provider = new ethers.providers.JsonRpcProvider(endPoint);

    document.getElementById("endpointlabel").hidden = true;
    document.getElementById("endpointtext").hidden = true;
    document.getElementById("endpointbutton").hidden = true;

    var i=0;
    provider.on('debug', (data)=> {
      if(data.error && i==0) {
          var errorLabel = document.createElement("label");
          errorLabel.innerHTML = "Error connecting! :(";
          td2Endpoint.appendChild(errorLabel);
          i++;
      }
    });

    var connectionSuccess = document.createElement("label");
    connectionSuccess.id = "connection-success-endpoint";
    connectionSuccess.innerHTML = "Connection to network is successful! :D";
    td2Endpoint.appendChild(connectionSuccess);

    var td1Endpoint = document.getElementById("td1-endpoint");
    var img = document.createElement("img");
    img.src = "images/one.jpg";
    img.style.height = "20px";
    td1Endpoint.appendChild(img);

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

    td2ERC20 = document.getElementById("td2-erc20");
    td2ERC20.appendChild(erc20Label);
    td2ERC20.appendChild(erc20Input);
    td2ERC20.appendChild(erc20button);

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
    td2ERC20.appendChild(connectionSuccess);

    var td1ERC20 = document.getElementById("td1-erc20");
    var img = document.createElement("img");
    img.src = "images/two.jpg";
    img.style.height = "20px";
    td1ERC20.appendChild(img);

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

    td2Spender = document.getElementById("td2-spender");
    td2Spender.appendChild(spenderLabel);
    td2Spender.appendChild(spenderText);
    td2Spender.appendChild(spenderButton);

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

    td2Spender.appendChild(recordSuccess);

    var td1Spender = document.getElementById("td1-spender");
    var img = document.createElement("img");
    img.src = "images/three.png";
    img.style.height = "20px";
    td1Spender.appendChild(img);

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

    td2Users = document.getElementById("td2-users");
    td2Users.appendChild(usersLabel);
    td2Users.appendChild(usersText);
    td2Users.appendChild(usersButtton);

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
    recordSuccess.innerHTML = "All, " + usersArray.length + ", token holder addresses recorded!";

    td2Users.appendChild(recordSuccess);

    var td1Users = document.getElementById("td1-users");
    var img = document.createElement("img");
    img.src = "images/four.jpg";
    img.style.height = "20px";
    td1Users.appendChild(img);

    createVaRButton();

  }

  async function createVaRButton(){

    var varButton = document.createElement("button");
    varButton.id = "varbutton";
    varButton.type = "button";
    varButton.innerHTML = "Calculate VaR";

    td2VaR = document.getElementById("td2-var");
    td2VaR.appendChild(varButton);

    varButton.onclick = function () {calculateVaR()};

  }

  async function calculateVaR(){

    var approvalAdjustedVaR = 0;
    for (var i=0; i<usersArray.length; i++){

      var tokenHolderAddress = usersArray[i];

      var balance = await erc20.balanceOf(tokenHolderAddress);
      balance = parseFloat(ethers.utils.formatEther(balance));
      var allowance = await erc20.allowance(tokenHolderAddress, spenderAddress);
      allowance = allowance / 10**18;

      if (balance>=allowance){
        approvalAdjustedVaR += allowance;
        //console.log(allowance);
      } else {
        approvalAdjustedVaR += balance;
        //console.log(balance);
      }

    }

    var TVL = await erc20.balanceOf(spenderAddress);
    TVL = parseFloat(ethers.utils.formatEther(TVL));
    approvalAdjustedVaR += TVL;

    approvalAdjustedVaR = approvalAdjustedVaR.toFixed(2);

    document.getElementById("varbutton").hidden = true;

    var approvalAdjustedVaRLabel = document.createElement("label");
    approvalAdjustedVaRLabel.id = "approval-adjusted-var-label";
    approvalAdjustedVaRLabel.innerHTML = "Approval adjusted VaR calculated to be: $" + approvalAdjustedVaR;
    
    var td1VaR = document.getElementById("td1-var");
    var img = document.createElement("img");
    img.src = "images/five.png";
    img.style.height = "20px";
    td1VaR.appendChild(img);
    
    td2VaR.appendChild(approvalAdjustedVaRLabel);

  }

  return (
    <div className="App">

      <img src="https://media-float-capital.fra1.cdn.digitaloceanspaces.com/public/img/float-logo-sq-center.svg" width={100} height={100} align='center'/>

      <h1 style={{textAlign : "center"}} className="text-3xl font-bold underline">Allowance adjusted VaR calculated by FLOAT</h1>

      <table id="table" align="center">
        <tbody>

        <tr id="tr-endpoint">

          <td id="td1-endpoint" style={{width: "50px", height: "50px"}}></td>
          <td id="td2-endpoint" style={{width: "500px", height: "50px"}}>
            <label id="endpointlabel">Connect to network:</label>

            <select name="endpoints" id="defaultendpoints" onChange={() => connectToDefaultEndPoint()} style={{width : '200px'}}>
              <option value=""></option>
              <option value="https://rpc.ankr.com/polygon">Polygon</option>
              <option value="https://rpc.ankr.com/avalanche">Avalanche</option>
              <option value="https://rpc.ankr.com/eth">Ethereum</option>
              <option value="Other">Other</option>
            </select>
          </td>
          <td></td>
        </tr>

        <tr id="tr-erc20">
          <td id="td1-erc20" style={{width: "50px", height: "50px"}}></td>
          <td id="td2-erc20" style={{width: "500px", height: "50px"}}></td>
          <td></td>
        </tr>

        <tr id="tr-spender">
          <td id="td1-spender" style={{width: "50px", height: "50px"}}></td>
          <td id="td2-spender" style={{width: "500px", height: "50px"}}></td>
          <td></td>
        </tr>

        <tr id="tr-users">
          <td id="td1-users" style={{width: "50px", height: "50px"}}></td>
          <td id="td2-users" style={{width: "500px", height: "50px"}}></td>
          <td></td>
        </tr>

        <tr id="tr-var">
          <td id="td1-var" style={{width: "50px", height: "50px"}}></td>
          <td id="td2-var" style={{width: "500px", height: "50px"}}></td>
          <td></td>
        </tr>

      </tbody>
      </table>

    </div>
  );
}

export default App;
