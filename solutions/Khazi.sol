// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Khazi {
    event ProposalCreated(
        uint256 proposalId,
        string title,
        string optionA,
        string optionB,
        uint256 deadline
    );
    event VoteCasted(uint256 proposalId, address voter, bool selectedOption);

    uint256 public proposalCounter;

    struct Proposal {
        string title;
        string optionA;
        string optionB;
        uint256 deadline;
        uint256 votesForOptionA;
        uint256 votesForOptionB;
    }

    mapping(uint256 => Proposal) public proposals;
    mapping(address => mapping(uint256 => bool)) public _hasVoted;

    function createProposal(
        string memory _title,
        string memory _optionA,
        string memory _optionB,
        uint256 _minutesUntilDeadline
    ) public {
        Proposal memory newProposal;
        newProposal.title = _title;
        newProposal.optionA = _optionA;
        newProposal.optionB = _optionB;
        newProposal.deadline =
            block.timestamp +
            _minutesUntilDeadline *
            1 minutes;

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
        require(!_hasVoted[msg.sender][_proposalId], "Already voted");
        require(block.timestamp < proposal.deadline, "Voting period has ended");

        if (_selectedOption == false) {
            proposal.votesForOptionA++;
        } else {
            proposal.votesForOptionB++;
        }

        _hasVoted[msg.sender][_proposalId] = true;
        emit VoteCasted(_proposalId, msg.sender, _selectedOption);
    }

    function getProposal(
        uint256 _proposalId
    )
        public
        view
        returns (
            string memory title,
            string memory optionA,
            string memory optionB,
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

    function hasVoted(
        uint256 _proposalId,
        address _voter
    ) public view returns (bool) {
        return _hasVoted[_voter][_proposalId];
    }
}
