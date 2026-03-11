// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20 ;

contract Election {
    struct Party {
        string name;
        uint256 votes;
    }

    Party[] private parties;

    address public admin;
    uint256 public electionStartsAt;
    uint256 public electionEndsAt;

    // voter address => last voted day number
    mapping(address => uint256) private lastVotedDay;

    // events
    event PartyRegistered(uint256 indexed partyId, string name);
    event VoteCast(address indexed voter, uint256 indexed partyId);

    // modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authorized");
        _;
    }

    modifier beforeElection() {
        require(block.timestamp < electionStartsAt, "Election has started");
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

    constructor(
        string[] memory initialParties,
        uint256 _electionStart,
        uint256 _electionEnd
    ) {
        require(_electionStart > block.timestamp, "Start must be future");
        require(_electionEnd > _electionStart, "End must be after start");
        require(initialParties.length > 0, "No parties provided");

        admin = msg.sender;
        electionStartsAt = _electionStart;
        electionEndsAt = _electionEnd;

        for (uint256 i = 0; i < initialParties.length; i++) {
            parties.push(Party(initialParties[i], 0));
            emit PartyRegistered(i, initialParties[i]);
        }
    }

    // admin-only
    function addParty(string calldata name)
        external
        onlyAdmin
        beforeElection
    {
        require(bytes(name).length > 0, "Empty name");
        parties.push(Party(name, 0));
        emit PartyRegistered(parties.length - 1, name);
    }

    // voting
    function vote(uint256 partyId)
        external
        duringElection
    {
        require(partyId < parties.length, "Invalid party ID");
        require(!hasVotedToday(msg.sender), "Already voted today");

        uint256 today = block.timestamp / 1 days;
        lastVotedDay[msg.sender] = today;
        parties[partyId].votes++;

        emit VoteCast(msg.sender, partyId);
    }

    // read functions
    function getParty(uint256 partyId)
        external
        view
        returns (string memory name, uint256 votes)
    {
        require(partyId < parties.length, "Invalid party ID");
        Party memory party = parties[partyId];
        return (party.name, party.votes);
    }

    function getPartyCount() external view returns (uint256) {
        return parties.length;
    }

    function hasVotedToday(address voter)
        public
        view
        returns (bool)
    {
        uint256 today = block.timestamp / 1 days;
        return lastVotedDay[voter] == today;
    }
}