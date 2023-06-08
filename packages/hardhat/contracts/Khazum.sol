// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

enum Option {
    A,
    B
}

// Checkpoint 3: Add an uint256 called minimumVotes as a parameter
// Checkpoint 4: Add:
// - two address optionA and optionB
// - two string names (nameForOptionA and nameForOptionB) for those options
// Checkpoint 5: Add a bool (executed) to check if proposal has been executed
struct Proposal {
    string title;
    uint256 proposalDeadline;
    uint256 votesForOptionA;
    uint256 votesForOptionB;
}

// Checkpoint 5: Create a struct Winner with:
// - an uint256 for proposalId
// - a string winnerName
// - an address for winnerAddress
struct Winner {
    uint256 proposalId;
    string winnerName;
    address winnerAddress;
}

contract Khazum is Ownable {
    // Checkpoint 3: In ProposalCreated, include minimumVotes as a parameter of the same type as in the Proposal struct
    // Checkpoint 4: In ProposalCreated, include newly added Proposal struct values
    event ProposalCreated(
        uint256 proposalId, string title, uint256 proposalDeadline, uint256 votesForOptionA, uint256 votesForOptionB
    );

    event VoteCasted(uint256 proposalId, address voter, Option selectedOption);

    mapping(uint256 => Proposal) public proposals;
    // Checkpoint 5: Create a mapping from uint256 (proposal id) to Winner struct
    mapping(address => mapping(uint256 => bool)) public hasVoted;
    mapping(address => mapping(uint256 => Option)) public voterOption;

    uint256 public proposalCounter;
    IERC20 private khaToken;

    constructor(address _khaTokenAddress) {
        khaToken = IERC20(_khaTokenAddress);
    }

    // Checkpoint 3: Edit createProposal to:
    // - Take _minimumVotes as a parameter
    // - Require _minimumVotes to be greater than 0
    // - Add _minimumVotes as an atribute for the proposal (as newProposal.title does for title)
    // - Add _minimumVotes as an arguments to emit ProposalCreated
    // Checkpoint 4: Edit createProposal to:
    // - Include new values from Proposal to createProposal
    function createProposal(string memory _title, uint256 _proposalDurationInMinutes) public {
        require(_proposalDurationInMinutes > 0, "Proposal duration must be greater than zero");

        Proposal memory newProposal;
        newProposal.title = _title;
        newProposal.proposalDeadline = block.timestamp + (_proposalDurationInMinutes * 1 minutes);

        uint256 proposalId = proposalCounter;
        proposals[proposalCounter] = newProposal;
        proposalCounter++;

        emit ProposalCreated(
            proposalId, _title, newProposal.proposalDeadline, newProposal.votesForOptionA, newProposal.votesForOptionB
        );
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

    // Checkpoint 5: Uncomment this function

    /* 
        function executeProposal(uint256 _proposalId) public {
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp >= proposal.proposalDeadline, "Proposal deadline not yet reached");
        require(!proposal.executed, "Proposal already executed");

        Winner memory winner;
        if (proposal.votesForOptionA > proposal.votesForOptionB) {
            winner.proposalId = _proposalId;
            winner.winnerName = proposal.nameForOptionA;
            winner.winnerAddress = proposal.optionA;
        } else if (proposal.votesForOptionB > proposal.votesForOptionA) {
            winner.proposalId = _proposalId;
            winner.winnerName = proposal.nameForOptionB;
            winner.winnerAddress = proposal.optionB;
        } else {
            // Handle tie case, if desired
            revert("Tie not allowed");
        }

        winners[_proposalId] = winner;
        proposal.executed = true;
    }
    */

    // Checkpoint 3: Edit getProposal to:
    // - return minimumVotes from the proposal
    // Hint: remember to add it to returns in the function header
    // Checkpoint 4: Return all the new values in Proposal struct from getProposal
    // Checkpoint 5: Return the bool executed from getProposal
    function getProposal(uint256 _proposalId)
        public
        view
        returns (string memory title, uint256 proposalDeadline, uint256 votesForOptionA, uint256 votesForOptionB)
    {
        Proposal storage proposal = proposals[_proposalId];

        title = proposal.title;
        proposalDeadline = proposal.proposalDeadline;
        votesForOptionA = proposal.votesForOptionA;
        votesForOptionB = proposal.votesForOptionB;
    }

    // Checkpoint 5: Add a getWinner function similar to getProposal
    // - takes a _proposalID as parameter
    // - reads Winner struct from storage
    // - returns winnerName and winnerAddress

    function viewHasVoted(uint256 _proposalId, address _voter) public view returns (bool) {
        require(_proposalId < proposalCounter, "Invalid proposal ID");
        return hasVoted[_voter][_proposalId];
    }

    function getProposalCount() public view returns (uint256) {
        return proposalCounter;
    }
}
