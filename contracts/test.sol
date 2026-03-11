// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Election {
    // -------------------------
    // STRUCT
    // -------------------------
    struct Party {
        string name;
        uint256 votes;
    }

    // -------------------------
    // STATE
    // -------------------------
    address public admin;
    uint256 public electionStartsAt;
    uint256 public electionEndsAt;

    Party[] private parties;

    // voter => last voted day number
    mapping(address => uint256) private lastVotedDay;

    // -------------------------
    // EVENTS
    // -------------------------
    event PartyRegistered(uint256 indexed partyId, string name);
    event VoteCast(address indexed voter, uint256 indexed partyId);

    // -------------------------
    // MODIFIERS
    // -------------------------
    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authorized");
        _;
    }

    modifier beforeElection() {
        require(block.timestamp < electionStartsAt, "Election already started");
        _;
    }

    modifier duringElection() {
        require(
            block.timestamp >= electionStartsAt &&
            block.timestamp <= electionEndsAt,
            "Election not active"
        );
        _;
    }

    // -------------------------
    // CONSTRUCTOR
    // -------------------------
    constructor(
        string[] memory initialParties,
        uint256 _electionStartsAt,
        uint256 _electionEndsAt
    ) {
        require(_electionStartsAt > block.timestamp, "Start must be future");
        require(_electionEndsAt > _electionStartsAt, "End must be after start");
        require(initialParties.length > 0, "No parties provided");

        admin = msg.sender;
        electionStartsAt = _electionStartsAt;
        electionEndsAt = _electionEndsAt;

        for (uint256 i = 0; i < initialParties.length; i++) {
            parties.push(
                Party({
                    name: initialParties[i],
                    votes: 0
                })
            );
        }
    }

    // -------------------------
    // ADMIN FUNCTION
    // -------------------------
    function addParty(string calldata name)
        external
        onlyAdmin
        beforeElection
    {
        require(bytes(name).length > 0, "Empty name");

        parties.push(Party(name, 0));
        emit PartyRegistered(parties.length - 1, name);
    }

    // -------------------------
    // VOTING
    // -------------------------
    function vote(uint256 partyId)
        external
        duringElection
    {
        require(partyId < parties.length, "Invalid party ID");

        uint256 today = block.timestamp / 1 days;
        require(
            lastVotedDay[msg.sender] < today,
            "Already voted today"
        );

        lastVotedDay[msg.sender] = today;
        parties[partyId].votes++;

        emit VoteCast(msg.sender, partyId);
    }

    // -------------------------
    // READ FUNCTIONS
    // -------------------------
    function getParty(uint256 partyId)
        external
        view
        returns (string memory name, uint256 votes)
    {
        require(partyId < parties.length, "Invalid party ID");
        Party memory p = parties[partyId];
        return (p.name, p.votes);
    }

    function getPartyCount() external view returns (uint256) {
        return parties.length;
    }

    function hasVotedToday(address voter) external view returns (bool) {
        uint256 today = block.timestamp / 1 days;
        return lastVotedDay[voter] == today;
    }
}