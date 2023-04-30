// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

enum Option {
    A,
    B
}

enum ProposalStatus {
    PENDING,
    CLOSED,
    FINISHED
}

struct Proposal {
    string title;
    string description;
    uint256 proposalDeadline;
    uint256 minimumVotes;
    uint256 votesForOptionA;
    uint256 votesForOptionB;
    ProposalStatus status;
    bytes data;
}

interface IKhaNft is IERC721 {
    function mint(address recipient) external returns (uint256);
}

contract Khazerium is Ownable, ERC20Votes {
    using Counters for Counters.Counter;

    event ProposalCreated(uint256 proposalId, string title);
    event VoteCasted(uint256 proposalId, address voter, Option selectedOption);
    event ProposalStatusChanged(uint256 proposalId, ProposalStatus status);

    IKhaNft private khaNft;

    uint256 public proposalCounter; // Counter for proposals
    mapping(uint256 => Proposal) public proposals; // Mapping to store proposals by ID
    mapping(address => mapping(uint256 => bool)) public hasVoted; // Mapping to keep track of voters
    mapping(address => mapping(uint256 => Option)) public voterOption; // Mapping to store the selected option for each voter

    constructor(address _khaNftAddress)
        public
        ERC20("KhaToken Vote", "KHAVOTE")
        ERC20Votes()
        ERC20Permit("KhaToken Vote")
    {
        khaNft = IKhaNft(_khaNftAddress);
    }

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

        uint256 votingPower = getVotes(msg.sender);
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

        khaNft.mint(msg.sender);

        proposal.status = ProposalStatus.FINISHED;
        emit ProposalStatusChanged(_proposalId, ProposalStatus.FINISHED);
    }

    function getProposal(uint256 _proposalId)
        public
        view
        returns (
            string memory title,
            string memory description,
            uint256 proposalDeadline,
            uint256 minimumVotes,
            uint256 votesForOptionA,
            uint256 votesForOptionB,
            uint256 status
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
        status = uint256(proposal.status);
    }

    // Function to check if a voter has already voted for a proposal
    function viewHasVoted(uint256 _proposalId, address _voter)
        public
        view
        returns (bool)
    {
        require(_proposalId < proposalCounter, "Invalid proposal ID");
        return hasVoted[_voter][_proposalId];
    }

    // Function to get the total number of proposals
    function getProposalCount() public view returns (uint256) {
        return proposalCounter;
    }

    // Function to get the total number of proposals
    function getProposalStatus(uint256 proposalId)
        public
        view
        returns (ProposalStatus)
    {
        return proposals[proposalId].status;
    }
}
