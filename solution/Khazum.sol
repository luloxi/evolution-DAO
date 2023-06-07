// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

enum Option {
    A,
    B
}

// Checkpoint 3: Add an uint256 called minimumVotes as a parameter
// Checkpoint 4: Add bool executed;
struct Proposal {
    string title;
    uint256 proposalDeadline;
    uint256 minimumVotes;
    uint256 votesForOptionA;
    uint256 votesForOptionB;
}

contract Khazum is Ownable {
    event ProposalCreated(uint256 proposalId, string title);
    event VoteCasted(uint256 proposalId, address voter, Option selectedOption);

    mapping(uint256 => Proposal) public proposals; // Mapping to store proposals by ID
    mapping(address => mapping(uint256 => bool)) public hasVoted; // Mapping to keep track of voters
    mapping(address => mapping(uint256 => Option)) public voterOption; // Mapping to store the selected option for each voter

    uint256 public proposalCounter; // Counter for proposals
    IERC20 private khaToken;

    constructor(address _khaTokenAddress) {
        khaToken = IERC20(_khaTokenAddress);
    }

    function createProposal(string memory _title, uint256 _proposalDurationInMinutes, uint256 _minimumVotes) public {
        require(_proposalDurationInMinutes > 0, "Proposal duration must be greater than zero");
        require(_minimumVotes > 0, "Minimum votes must be greater than zero");

        // Create a new proposal in memory
        Proposal memory newProposal;
        newProposal.title = _title;
        newProposal.proposalDeadline = block.timestamp + (_proposalDurationInMinutes * 1 minutes);
        newProposal.minimumVotes = _minimumVotes;

        // Add the new proposal to the proposals mapping
        uint256 proposalId = proposalCounter;
        proposals[proposalCounter] = newProposal;

        // Increment the proposal counter
        proposalCounter++;

        emit ProposalCreated(proposalId, _title);
    }

    function vote(uint256 _proposalId, Option _selectedOption) public {
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp < proposal.proposalDeadline, "Proposal has expired");
        require(!hasVoted[msg.sender][_proposalId], "Already voted");
        require(_selectedOption == Option.A || _selectedOption == Option.B, "Invalid option");

        uint256 votingPower = khaToken.balanceOf(msg.sender);
        require(votingPower > 0, "Voter has no voting power");

        if (_selectedOption == Option.A) {
            proposal.votesForOptionA += votingPower;
        } else {
            proposal.votesForOptionB += votingPower;
        }

        hasVoted[msg.sender][_proposalId] = true;

        emit VoteCasted(_proposalId, msg.sender, _selectedOption);
    }

    function getProposal(uint256 _proposalId)
        public
        view
        returns (
            string memory title,
            uint256 proposalDeadline,
            uint256 minimumVotes,
            uint256 votesForOptionA,
            uint256 votesForOptionB
        )
    {
        Proposal storage proposal = proposals[_proposalId];

        title = proposal.title;
        proposalDeadline = proposal.proposalDeadline;
        minimumVotes = proposal.minimumVotes;
        votesForOptionA = proposal.votesForOptionA;
        votesForOptionB = proposal.votesForOptionB;
    }

    // Function to check if a voter has already voted for a proposal
    function viewHasVoted(uint256 _proposalId, address _voter) public view returns (bool) {
        require(_proposalId < proposalCounter, "Invalid proposal ID");
        return hasVoted[_voter][_proposalId];
    }

    // Function to get the total number of proposals
    function getProposalCount() public view returns (uint256) {
        return proposalCounter;
    }
}
