// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

enum Option {
    A,
    B
}

struct Proposal {
    string title;
    string description;
    uint256 proposalDeadline;
    uint256 minimumVotes;
    uint256 votesForOptionA;
    uint256 votesForOptionB;
}

contract Khazum is Ownable {
    event ProposalCreated(uint256 proposalId, string title);
    event VoteCasted(uint256 proposalId, address voter, Option selectedOption);

    uint256 public proposalCounter; // Counter for proposals

    mapping(uint256 => Proposal) public proposals; // Mapping to store proposals by ID
    mapping(address => mapping(uint256 => bool)) public hasVoted; // Mapping to keep track of voters
    mapping(address => mapping(uint256 => Option)) public voterOption; // Mapping to store the selected option for each voter

    // Function to create a new proposal
    function createProposal(
        string memory _title,
        string memory _description,
        uint256 _proposalDeadline,
        uint256 _minimumVotes
    ) public {
        // Create a new proposal
        Proposal memory newProposal;
        newProposal.title = _title;
        newProposal.description = _description;
        newProposal.proposalDeadline = _proposalDeadline;
        newProposal.minimumVotes = _minimumVotes;

        // Add the proposal to the proposals mapping
        uint256 proposalId = proposalCounter;
        proposals[proposalId] = newProposal;

        // Increment the proposal counter
        proposalCounter++;

        emit ProposalCreated(proposalId, _title);
    }

    // Function to cast vote for a proposal
    function castVote(uint256 _proposalId, Option _selectedOption) public {
        require(_proposalId < proposalCounter, "Invalid proposal ID");
        Proposal storage proposal = proposals[_proposalId];

        require(
            block.timestamp < proposal.proposalDeadline,
            "Proposal has expired"
        );

        require(!hasVoted[msg.sender][_proposalId], "Already voted");

        require(
            _selectedOption == Option.A || _selectedOption == Option.B,
            "Invalid option"
        );

        if (_selectedOption == Option.A) {
            proposal.votesForOptionA++;
        } else {
            proposal.votesForOptionB++;
        }

        hasVoted[msg.sender][_proposalId] = true;

        emit VoteCasted(_proposalId, msg.sender, _selectedOption);
    }

    // Function to get proposal details
    function getProposal(
        uint256 _proposalId
    )
        public
        view
        returns (
            string memory title,
            string memory description,
            uint256 proposalDeadline,
            uint256 minimumVotes,
            uint256 votesForOptionA,
            uint256 votesForOptionB
        )
    {
        require(_proposalId < proposalCounter, "Invalid proposal ID");
        Proposal storage proposal = proposals[_proposalId];

        title = proposal.title;
        description = proposal.description;
        proposalDeadline = proposal.proposalDeadline;
        minimumVotes = proposal.minimumVotes;
        votesForOptionA = proposal.votesForOptionA;
        votesForOptionB = proposal.votesForOptionB;
    }

    // Function to check if a voter has already voted for a proposal
    function viewHasVoted(
        uint256 _proposalId,
        address _voter
    ) public view returns (bool) {
        require(_proposalId < proposalCounter, "Invalid proposal ID");
        return hasVoted[_voter][_proposalId];
    }

    // Function to get the total number of proposals
    function getProposalCount() public view returns (uint256) {
        return proposalCounter;
    }

    // Function to update the minimum votes required for a proposal
    function updateMinimumVotes(
        uint256 _proposalId,
        uint256 _minimumVotes
    ) public onlyOwner {
        require(_proposalId < proposalCounter, "Invalid proposal ID");
        proposals[_proposalId].minimumVotes = _minimumVotes;
    }

    // Function to update the proposal deadline
    function updateProposalDeadline(
        uint256 _proposalId,
        uint256 _proposalDeadline
    ) public onlyOwner {
        require(_proposalId < proposalCounter, "Invalid proposal ID");
        proposals[_proposalId].proposalDeadline = _proposalDeadline;
    }

    // Function to update the title and description of a proposal
    function updateProposalDetails(
        uint256 _proposalId,
        string memory _title,
        string memory _description
    ) public onlyOwner {
        require(_proposalId < proposalCounter, "Invalid proposal ID");
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        proposals[_proposalId].title = _title;
        proposals[_proposalId].description = _description;
    }
}
