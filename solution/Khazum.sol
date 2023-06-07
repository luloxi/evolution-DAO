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
    uint256 votesForOptionA;
    uint256 votesForOptionB;
}

contract Khazum is Ownable {
    // Checkpoint 3: In ProposalCreated, include minimumVotes as a parameter of the same type as in the Proposal struct
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

    // Checkpoint 3: Edit createProposal to:
    // - Take _minimumVotes as a parameter
    // - Add _minimumVotes as an atribute for the proposal (as newProposal.title does for title)
    // - Add _minimumVotes as an arguments to emit ProposalCreated
    function createProposal(string memory _title, uint256 _proposalDurationInMinutes, uint256 _minimumVotes) public {
        require(_proposalDurationInMinutes > 0, "Proposal duration must be greater than zero");
        require(_minimumVotes > 0, "Minimum votes must be greater than zero");

        Proposal memory newProposal;
        newProposal.title = _title;
        newProposal.proposalDeadline = block.timestamp + (_proposalDurationInMinutes * 1 minutes);

        uint256 proposalId = proposalCounter;
        proposals[proposalCounter] = newProposal;
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

    // Checkpoint 3: Edit getProposal to:
    // - return minimumVotes from the proposal
    // Hint: remember to add it to returns in the function header
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

    function viewHasVoted(uint256 _proposalId, address _voter) public view returns (bool) {
        require(_proposalId < proposalCounter, "Invalid proposal ID");
        return hasVoted[_voter][_proposalId];
    }

    function getProposalCount() public view returns (uint256) {
        return proposalCounter;
    }
}
