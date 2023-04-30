// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Kha.sol";

contract Khazerium is Kha, ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    constructor(address _khaTokenAddress)
        ERC721("KhazeriumNFT", "KHAZ")
        Kha(_khaTokenAddress)
    {}

    function createProposal(
        string memory _title,
        string memory _description,
        uint256 _proposalDurationInMinutes,
        uint256 _minimumVotes,
        bytes memory _data
    ) public {
        require(
            _proposalDurationInMinutes > 0,
            "Proposal duration must be greater than zero"
        );
        require(_minimumVotes > 0, "Minimum votes must be greater than zero");

        // Create a new proposal
        Proposal memory newProposal;
        newProposal.title = _title;
        newProposal.description = _description;
        newProposal.proposalDeadline =
            block.timestamp +
            (_proposalDurationInMinutes * 1 minutes);
        newProposal.minimumVotes = _minimumVotes;
        newProposal.status = ProposalStatus.PENDING;
        newProposal.data = _data;

        // Add the proposal to the proposals mapping
        uint256 proposalId = proposalCounter;
        proposals[proposalId] = newProposal;

        // Increment the proposal counter
        proposalCounter++;

        emit ProposalCreated(proposalId, _title);
    }

    function vote(uint256 _proposalId, Option _selectedOption) public {
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

        uint256 votingPower = khaToken.balanceOf(msg.sender);
        require(votingPower > 0, "Voter has no voting power");

        if (_selectedOption == Option.A) {
            proposal.votesForOptionA += votingPower;
        } else {
            proposal.votesForOptionB += votingPower;
        }
        hasVoted[msg.sender][_proposalId] = true;

        emit VoteCasted(_proposalId, msg.sender, _selectedOption);

        if (
            proposal.status == ProposalStatus.PENDING &&
            proposal.votesForOptionA + proposal.votesForOptionB >=
            proposal.minimumVotes
        ) {
            proposal.status = ProposalStatus.CLOSED;
            emit ProposalStatusChanged(_proposalId, ProposalStatus.CLOSED);
        }
    }

    function execute(uint256 _proposalId) public {
        require(_proposalId < proposalCounter, "Invalid proposal ID");
        Proposal storage proposal = proposals[_proposalId];

        require(
            proposal.status == ProposalStatus.CLOSED,
            "Proposal must be closed"
        );

        // execute the proposal and send transaction data
        (bool success, ) = address(this).call(proposal.data);
        require(success, "Transaction failed");

        uint256 tokenId = _tokenIdCounter.current();
        _mint(msg.sender, tokenId);
        _tokenIdCounter.increment();

        proposal.status = ProposalStatus.FINISHED;
        emit ProposalStatusChanged(_proposalId, ProposalStatus.FINISHED);
    }
}
