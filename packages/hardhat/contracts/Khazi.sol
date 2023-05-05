// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Khazi {
    event ProposalCreated(uint256 proposalId, string title);
    event VoteCasted(uint256 proposalId, address voter, bool selectedOption);

    uint256 public proposalCounter;

    struct Proposal {
        string title;
        uint256 votesForOptionA;
        uint256 votesForOptionB;
    }

    mapping(uint256 => Proposal) public proposals;
    mapping(address => mapping(uint256 => bool)) public hasVoted;

    function createProposal(
        string memory _title
    ) public {
        Proposal memory newProposal;
        newProposal.title = _title;

        uint256 proposalId = proposalCounter;
        proposals[proposalId] = newProposal;
        proposalCounter++;

        emit ProposalCreated(proposalId, _title);
    }

    function castVote(uint256 _proposalId, bool _selectedOption) public {
        require(_proposalId < proposalCounter, "Invalid proposal ID");
        Proposal storage proposal = proposals[_proposalId];
        require(!hasVoted[msg.sender][_proposalId], "Already voted");

        if (_selectedOption) {
            proposal.votesForOptionA++;
        } else {
            proposal.votesForOptionB++;
        }

        hasVoted[msg.sender][_proposalId] = true;
        emit VoteCasted(_proposalId, msg.sender, _selectedOption);
    }

    function getProposal(
        uint256 _proposalId
    )
        public
        view
        returns (
            string memory title,
            uint256 votesForOptionA,
            uint256 votesForOptionB
        )
    {
        require(_proposalId < proposalCounter, "Invalid proposal ID");
        Proposal storage proposal = proposals[_proposalId];

        title = proposal.title;
        votesForOptionA = proposal.votesForOptionA;
        votesForOptionB = proposal.votesForOptionB;
    }

    function getProposalCount() public view returns (uint256) {
        return proposalCounter;
    }
}
