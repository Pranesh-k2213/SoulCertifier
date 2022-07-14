// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/IERC1155MetadataURI.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";

error NotCreaterOfToken();
error ContractDoesNotAllowApprovals();
error ContractDoesNotAllowTransfer();
error NoTokenAvilable();

contract SoulCertifier is Context, ERC165, IERC1155, IERC1155MetadataURI {
    // Mapping from token ID to account balances
    mapping(uint256 => mapping(address => bool)) private _balances;

    // Mapping to token Id to creaters (certificate providers)
    mapping(uint256 => address) private _createdBy;

    // To store latest token Id
    uint256 private tokenId;

    // To store uri
    string private _uri;

    event BunchCreated(address[] indexed to, address indexed by, uint256 indexed id);
    event TokenBurned(address indexed account, address indexed by, uint256 indexed id);

    modifier callerIsCreater(address creater, uint256 id) {
        if (creater != _createdBy[id]) {
            revert NotCreaterOfToken();
        }
        _;
    }

    constructor(string memory newUri) {
        _uri = newUri;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC165, IERC165)
        returns (bool)
    {
        return
            interfaceId == type(IERC1155).interfaceId ||
            interfaceId == type(IERC1155MetadataURI).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    // function supportedInterfaceReturn() public pure returns (bytes4) {
    //     return type(IERC1155).interfaceId;
    // }

    function balanceOf(address account, uint256 id) public view override returns (uint256) {
        require(account != address(0), "ERC1155: address zero is not a valid owner");
        return _balances[id][account] ? 1 : 0;
    }

    function balanceOfBatch(address[] memory accounts, uint256[] memory ids)
        public
        view
        override
        returns (uint256[] memory)
    {
        require(accounts.length == ids.length, "ERC1155: accounts and ids length mismatch");

        uint256[] memory batchBalances = new uint256[](accounts.length);

        for (uint256 i = 0; i < accounts.length; ++i) {
            batchBalances[i] = balanceOf(accounts[i], ids[i]);
        }

        return batchBalances;
    }

    function setApprovalForAll(address, bool) public pure override {
        revert ContractDoesNotAllowApprovals();
    }

    function isApprovedForAll(address, address) public pure override returns (bool) {
        return false;
    }

    function safeTransferFrom(
        address,
        address,
        uint256,
        uint256,
        bytes memory
    ) public pure override {
        revert ContractDoesNotAllowTransfer();
    }

    function safeBatchTransferFrom(
        address,
        address,
        uint256[] memory,
        uint256[] memory,
        bytes memory
    ) public pure override {
        revert ContractDoesNotAllowTransfer();
    }

    // Function to provide certificates without specifying the tokenID
    // It creates new tokenId
    function createBunch(address[] memory accounts) public returns (uint256) {
        address creater = msg.sender;
        for (uint256 i = 0; i < accounts.length; i++) {
            if (accounts[i] != address(0)) {
                _balances[tokenId][accounts[i]] = true;
                //emit TransferSingle(creater, address(0), accounts[i], tokenId, 1);
            }
        }
        _createdBy[tokenId] = creater;
        emit BunchCreated(accounts, creater, tokenId);
        tokenId += 1;
        return tokenId - 1;
    }

    // Function call with token ID to add new accounts to already exsisting certificate token
    function createBunchWithId(address[] memory accounts, uint256 id)
        public
        callerIsCreater(msg.sender, id)
    {
        for (uint256 i = 0; i < accounts.length; i++) {
            if (accounts[i] != address(0)) {
                _balances[id][accounts[i]] = true;
                //emit TransferSingle(msg.sender, address(0), accounts[i], id, 1);
            }
        }
        emit BunchCreated(accounts, msg.sender, id);
        return;
    }

    function burnToken(address account, uint256 id) public callerIsCreater(msg.sender, id) {
        if (!_balances[id][account]) {
            revert NoTokenAvilable();
        }
        _balances[id][account] = false;
        emit TokenBurned(account, msg.sender, id);
        //emit TransferSingle(msg.sender, account, address(0), id, 1);
    }

    // Getters
    function getNextTokenId() public view returns (uint256) {
        return tokenId;
    }

    function getCreatedBy(uint256 id) public view returns (address) {
        return _createdBy[id];
    }

    function uri(uint256) public view override returns (string memory) {
        return _uri;
    }
}
