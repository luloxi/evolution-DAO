import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./KhaStruct.sol";

abstract contract Kha is Ownable, KhaStruct {
    uint256 public proposalCounter;

    IERC20 public khaToken;

    mapping(uint256 => Proposal) public proposals;
    mapping(address => mapping(uint256 => bool)) public hasVoted;
    mapping(address => mapping(uint256 => Option)) public voterOption; // Mapping to store the selected option for each voter

    event ProposalCreated(uint256 proposalId, string title);
    event VoteCasted(uint256 proposalId, address voter, Option selectedOption);
    event ProposalStatusChanged(uint256 proposalId, ProposalStatus status);

    constructor(address _khaTokenAddress) {
        khaToken = IERC20(_khaTokenAddress);
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

    function viewHasVoted(uint256 _proposalId, address _voter)
        public
        view
        returns (bool)
    {
        require(_proposalId < proposalCounter, "Invalid proposal ID");
        return hasVoted[_voter][_proposalId];
    }

    // Function to get the total number of proposals
    function getProposalStatus(uint256 proposalId)
        public
        view
        returns (ProposalStatus)
    {
        return proposals[proposalId].status;
    }

    function getProposalCount() public view returns (uint256) {
        return proposalCounter;
    }

    function getProposalResults(uint256 _proposalId)
        public
        view
        returns (Option)
    {
        require(_proposalId < proposalCounter, "Invalid proposal ID");
        if (
            proposals[_proposalId].votesForOptionA >
            proposals[_proposalId].votesForOptionB
        ) {
            return Option(0);
        } else if (
            proposals[_proposalId].votesForOptionA <
            proposals[_proposalId].votesForOptionB
        ) {
            return Option(1);
        } else if (
            proposals[_proposalId].votesForOptionA ==
            proposals[_proposalId].votesForOptionB
        ) {
            return Option(2);
        }
    }
}
