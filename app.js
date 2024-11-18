

// Update with your deployed contract address and ABI
const contractAddress = "0xE391c4e6bF496d0826c50b352Ec78CFFc3aeAd0a";
const contractABI=[
	{
		"inputs": [
			{
				"internalType": "string[]",
				"name": "candidateNames",
				"type": "string[]"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "candidateId",
				"type": "uint256"
			}
		],
		"name": "vote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "candidateCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "candidates",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "voteCount",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "candidateId",
				"type": "uint256"
			}
		],
		"name": "getCandidate",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "voteCount",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "hasVoted",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

let web3;
let contract;

window.addEventListener("load", async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await web3.eth.getAccounts();
    console.log("Connected account:", accounts[0]);
document.getElementById("message").innerText = `Connected Account: ${accounts[0]}`;
    contract = new web3.eth.Contract(contractABI, contractAddress);
    loadCandidates();
  } else {
    alert("Please install MetaMask to use this DApp.");
  }
});

// Load all candidates
async function loadCandidates() {
  try {
    const candidateCount = await contract.methods.candidateCount().call();
    const candidatesList = document.getElementById("candidates-list");

    for (let i = 0; i < candidateCount; i++) {
      const candidate = await contract.methods.getCandidate(i).call();
      const candidateDiv = document.createElement("div");
      candidateDiv.innerHTML = `
        <h3>Candidate ID: ${i}</h3>
        <p>Name: ${candidate.name}</p>
        <p>Votes: ${candidate.voteCount}</p>
      `;
      candidatesList.appendChild(candidateDiv);
    }
  } catch (error) {
    console.error("Error loading candidates:", error);
  }
}

// Submit a vote
document.getElementById("vote-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const candidateId = document.getElementById("candidate-id").value;
  const message = document.getElementById("message");

  try {
    const accounts = await web3.eth.getAccounts();
    await contract.methods.vote(candidateId).send({ from: accounts[0] });
    message.style.color = "green";
    message.textContent = "Vote submitted successfully!";
    loadCandidates(); // Refresh candidates' votes
  } catch (error) {
    message.style.color = "red";
    message.textContent = error.message;
    console.error("Error voting:", error);
  }
});
