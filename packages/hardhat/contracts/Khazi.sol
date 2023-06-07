// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Khazi {
    // Checkpoint 3: Include to ProposalCreated the optionA and optionB parameters of the same type as in Proposal struct
    // Checkpoint 4: Include deadline as a parameter to ProposalCreated
    event ProposalCreated(uint256 proposalId, string title);
    event VoteCasted(uint256 proposalId, address voter, bool selectedOption);

    uint256 public proposalCounter;

    // Checkpoint 3: Edit Proposal struct to:
    // - include strings for optionA and optionB
    // (or bytes32 for gas saving)
    struct Proposal {
        string title;
        uint256 votesForOptionA;
        uint256 votesForOptionB;
    }

    mapping(uint256 => Proposal) public proposals;
    mapping(address => mapping(uint256 => bool)) public _hasVoted;

    // Checkpoint 3: Edit createProposal to:
    // - Take _optionA and _optionB as parameters
    // - Add them as atributes for the proposal (as newProposal.title does for title)
    // - Add them as arguments to emit ProposalCreated
    // Checkpoint 4: Edit createProposal to:
    // - Take a uint256 parameter called _minutesUntilDeadline
    // - Add it as an atribute for the proposal (block.timestamp + _minutesUntilDeadline * 1 minutes)
    // - Add newProposal.deadline as an argument to emit ProposalCreated

    function createProposal(string memory _title) public {
        Proposal memory newProposal;
        // Here you can add more atributes for the proposal
        newProposal.title = _title;

        uint256 proposalId = proposalCounter;
        proposals[proposalId] = newProposal;
        proposalCounter++;

        emit ProposalCreated(proposalId, _title);
    }

    // Checkpoint 4: Require that block.timestamp be smaller than proposal.deadline to restrict voting beyond deadline
    function vote(uint256 _proposalId, bool _selectedOption) public {
        Proposal storage proposal = proposals[_proposalId];
        require(!_hasVoted[msg.sender][_proposalId], "Already voted");

        if (_selectedOption == false) {
            proposal.votesForOptionA++;
        } else {
            proposal.votesForOptionB++;
        }

        _hasVoted[msg.sender][_proposalId] = true;
        emit VoteCasted(_proposalId, msg.sender, _selectedOption);
    }

    // Checkpoint 3: Edit getProposal to:
    // - return optionA and optionB from the proposal
    // Hint: remember to add it to returns in the function header
    // Checkpoint 4: Edit getProposal to:
    // - return deadline from the proposal

    function getProposal(uint256 _proposalId)
        public
        view
        returns (string memory title, uint256 votesForOptionA, uint256 votesForOptionB)
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

    function hasVoted(uint256 _proposalId, address _voter) public view returns (bool) {
        return _hasVoted[_voter][_proposalId];
    }
}
