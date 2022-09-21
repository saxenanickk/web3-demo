import { ethers } from "ethers";
import { useEffect, useState } from "react";

function App() {
  const [greet, setGreet] = useState("");
  const [balance, setBalance] = useState("");
  const [greetingValue, setGreetingValue] = useState("");
  const [depositValue, setDepositValue] = useState("");

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

  const ABI = [
    "function greet() public view returns (string)",
    "function setGreeting(string _greeting) public",
    "function deposit() public payable",
  ];
  const contract = new ethers.Contract(contractAddress, ABI, signer);

  useEffect(() => {
    const connectWallet = async () => {
      // MetaMask requires requesting permission to connect users accounts
      await provider.send("eth_requestAccounts", []);
    };

    const getBalance = async () => {
      const balance = await provider.getBalance(contractAddress);
      const balanceFormatted = ethers.utils.formatEther(balance);
      setBalance(balanceFormatted);
    };

    const getGreeting = async () => {
      const greeting = await contract.greet();
      setGreet(greeting);
    };

    connectWallet().catch(console.error);

    getBalance().catch(console.error);

    getGreeting().catch(console.error);
  });

  const handleDepositChange = (e) => {
    setDepositValue(e.target.value);
  };

  const handleGreetingChange = (e) => {
    setGreetingValue(e.target.value);
  };

  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    const ethValue = ethers.utils.parseEther(depositValue);
    const depositEth = await contract.deposit({ value: ethValue });
    await depositEth.wait();

    const balance = await provider.getBalance(contractAddress);
    const balanceFormatted = ethers.utils.formatEther(balance);
    setBalance(balanceFormatted);
    setDepositValue("");
  };

  const handleGreetingSubmit = async (e) => {
    e.preventDefault();
    const greetingUpdate = await contract.setGreeting(greetingValue);
    await greetingUpdate.wait();
    setGreet(greetingValue);
    setGreetingValue("");
  };

  return (
    <div className="container">
      <div className="row mt-5">
        <div className="col">
          <h3>{greet}</h3>
          <p>Contract Balance: {balance} ETH</p>
        </div>
        <div className="col">
          <form onSubmit={handleDepositSubmit}>
            <div className="mb-3">
              <input
                type="number"
                className="form-control"
                placeholder="0"
                value={depositValue}
                onChange={handleDepositChange}
              />
            </div>
            <button type="submit" className="btn btn-success">
              Deposit
            </button>
          </form>
          <form className="mt-5" onSubmit={handleGreetingSubmit}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                value={greetingValue}
                onChange={handleGreetingChange}
              />
            </div>
            <button type="submit" className="btn btn-dark">
              Change
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
