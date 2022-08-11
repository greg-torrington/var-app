import logo from './logo.svg';
import './App.css';
import { ethers } from 'ethers';

function App() {

  const abi = [
    // Some details about the token
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function allowance(address owner, address spender) external view returns (uint256)",
  
    // Get the account balance
    "function balanceOf(address) view returns (uint)",
  ];

  //const provider = new ethers.providers.JsonRpcProvider("https://mainnet.infura.io/v3/1a737ff6f59249a1b280436c5904e123");
  const provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/polygon");

  let contract = null;
  let contractAddress = ""; // create contract, current DAI Stable coin address
  let allowanceSpenderAddress = "0x168a5d1217AEcd258b03018d5bF1A1677A07b733"; //for long short, denham explain

  const users = [];
  let arrayLength = 0;
  
  async function addContract(){

    contractAddress = document.getElementById("contractAddress").value;

    contract = new ethers.Contract(contractAddress, abi, provider);

    let tokenName = await contract.name();
    document.getElementById('contractName').innerHTML = tokenName;

  }

  async function addUser(){
    let userAddress = document.getElementById("userAddress").value;
    document.getElementById("userAddress").value =  "";
    users[arrayLength] = userAddress;

    let num = await contract.balanceOf(userAddress);
    let balance = parseFloat(ethers.utils.formatEther(num));
    balance = balance.toFixed(2);

    let allowance = await contract.allowance(userAddress, "0x168a5d1217AEcd258b03018d5bF1A1677A07b733");
    allowance = allowance / 10**18;
    allowance = allowance.toFixed(2);

    var table = document.getElementById("usersTable");

    var rows = table.getElementsByTagName("tr").length;
    var row = table.insertRow(rows);

    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    cell1.innerHTML = userAddress;
    cell2.innerHTML = "$" + balance;
    cell3.innerHTML = "$" + allowance;

    arrayLength = arrayLength + 1;
  }

  return (
    <div className="App">
      <h1>VaR App</h1>
      <pre>
        Contract Address: <input id="contractAddress"/>
        <button onClick={() => addContract()}>Submit</button>
      </pre>
      <pre>
        User Address: <input type="text" id="userAddress"/>
        <button onClick={() => addUser()}>Add</button>
      </pre>
      <pre>
        <button>Calculate VaR</button>
      </pre>
      <h2>
        <label id="contractName"></label>
      </h2>

      <table id="usersTable" align="center">
        <tbody>
          <tr>
            <th>User Address</th>
            <th>Balance</th>
            <th>Allowance</th>
          </tr>
        </tbody>
      </table>

    </div>
  );
}

export default App;
