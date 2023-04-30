// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract KhaStruct {
    enum Option {
        A,
        B,
        NONE
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
}
