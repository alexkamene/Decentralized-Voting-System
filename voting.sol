
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;
contract Voting {
    struct Candidate {
        string name;
        uint256 voteCount;
    }
    mapping(uint256 => Candidate) public candidates;
    mapping(address => bool) public hasVoted;
    uint256 public candidateCount;
    constructor(string[] memory candidateNames) {
        for (uint256 i = 0; i < candidateNames.length; i++) {
            candidates[i] = Candidate(candidateNames[i], 0);
        }
        candidateCount = candidateNames.length;
    }
    function vote(uint256 candidateId) public {
        require(!hasVoted[msg.sender], "You have already voted.");
        require(candidateId < candidateCount, "Invalid candidate.");
        candidates[candidateId].voteCount++;
        hasVoted[msg.sender] = true;
    }
    function getCandidate(uint256 candidateId)
        public
        view
        returns (string memory name, uint256 voteCount)
    {
        require(candidateId < candidateCount, "Invalid candidate.");
        Candidate memory candidate = candidates[candidateId];
        return (candidate.name, candidate.voteCount);
    }
}