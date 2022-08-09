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
  //const useradrress = "0xa152f8bb749c55e9943a3a0a3111d18ee2b3f94e";

  const provider = new ethers.providers.JsonRpcProvider("https://mainnet.infura.io/v3/1a737ff6f59249a1b280436c5904e123")
  
  async function workoutApprovalAmount(){

    const contractaddress = document.getElementById("contractAddress").value;
    //const accounts = provider.listAccounts();
    const contract = new ethers.Contract(contractaddress, abi, provider);

    let tokenName = await contract.name();
    console.log("Token: " + tokenName);

    let balance = await provider.getBalance("0x3c14eE568B66Cd282EB2b987910b0e4c9650f673");
    console.log("Balance: " + ethers.utils.formatEther(balance));

    //let allowance = await contract.allowance(contractaddress, useradrress);
    //console.log("User allowance: " + allowance);

  }

  return (
    <div className="App">
      <h1>VaR App</h1>
      <input type="text" id="contractAddress"/>
      <button onClick={() => workoutApprovalAmount()}>Submit</button>
    </div>
  );
}

export default App;
