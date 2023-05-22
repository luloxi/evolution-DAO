// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Khazi {
    event ProposalCreated(
        uint256 proposalId,
        string title,
        bytes32 optionA,
        bytes32 optionB,
        uint256 deadline
    );
    event VoteCasted(uint256 proposalId, address voter, bool selectedOption);

    uint256 public proposalCounter;

    struct Proposal {
        string title;
        bytes32 optionA;
        bytes32 optionB;
        uint256 deadline;
        uint256 votesForOptionA;
        uint256 votesForOptionB;
    }

    mapping(uint256 => Proposal) public proposals;
    mapping(address => mapping(uint256 => bool)) public hasVoted;

    function createProposal(
        string memory _title,
        bytes32 _optionA,
        bytes32 _optionB,
        uint256 _hoursUntilDeadline
    ) public {
        Proposal memory newProposal;
        newProposal.title = _title;
        newProposal.optionA = _optionA;
        newProposal.optionB = _optionB;
        newProposal.deadline = block.timestamp + _hoursUntilDeadline * 1 hours;

        uint256 proposalId = proposalCounter;
        proposals[proposalId] = newProposal;
        proposalCounter++;

        emit ProposalCreated(
            proposalId,
            _title,
            _optionA,
            _optionB,
            newProposal.deadline
        );
    }

    function vote(uint256 _proposalId, bool _selectedOption) public {
        require(_proposalId < proposalCounter, "Invalid proposal ID");
        Proposal storage proposal = proposals[_proposalId];
        require(!hasVoted[msg.sender][_proposalId], "Already voted");
        require(block.timestamp < proposal.deadline, "Voting period has ended");

        if (_selectedOption == false) {
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
            bytes32 optionA,
            bytes32 optionB,
            uint256 deadline,
            uint256 votesForOptionA,
            uint256 votesForOptionB
        )
    {
        require(_proposalId < proposalCounter, "Invalid proposal ID");
        Proposal storage proposal = proposals[_proposalId];

        title = proposal.title;
        optionA = proposal.optionA;
        optionB = proposal.optionB;
        deadline = proposal.deadline;
        votesForOptionA = proposal.votesForOptionA;
        votesForOptionB = proposal.votesForOptionB;
    }

    function getProposalCount() public view returns (uint256) {
        return proposalCounter;
    }
}
