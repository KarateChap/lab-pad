//SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract CrowdSale is Ownable, ReentrancyGuard {
    using SafeMath for uint256;
    IERC20 public tokenInstance;

    //WITHDRAW VARIABLES

    address public ownerFundReceiver; // receiving address of owner
    address public labFeeFundReceiver; // receiving address of lab
    // address public devFeeFundReceiver; // receiving address of dev

    uint256 public ownerPercent; // percentage of owner in terms of total collected CRO
    uint256 public labPercent; // percentage of lab in terms of total collected CRO
    // uint256 public devPercent; // percentage of dev in terms of total collected CRO

    //PRESALE VARIABLES

    uint256 public croHardcap; // hardcap of the presale in terms of CRO
    uint256 public tokenHardcap; // hardcap of the presale in terms of token
    uint256 public soldTokens; // amount of tokens sold in the presale
    uint256 public croRaised; //amount of raised CRO

    uint256 public startTime; // starting time of presale in unix
    uint256 public endTime; // ending time of presale in unix

    // bool public hasMaxMinAlloc; // check if the presale has max participation allocation per wallet
    uint256 public maxAlloc; // maximum token participation allocation
    uint256 public minAlloc; // minimum token participation allocation

    bool public hasWhitelistSetting;

    //STRUCT FOR WHITELIST

    struct Buyer{
        uint256 participation;
        uint256 isWhitelisted;
    }

    mapping(address => Buyer) public buyers;

    // mapping(address => uint256) public presaleParticipation; // participation amount of a wallet address in terms of tokens

    constructor(IERC20 _tokenInstance,
                uint256 _maxAlloc,
                uint256 _minAlloc,
                uint256 _tokenHardcap,
                uint256 _croHardcap,
                bool _hasWhitelistSettings,
                uint256 _startTime,
                uint256 _endTime,
                uint256 _ownerPercent,
                uint256 _labPercent,
                address _ownerFundReceiver,
                address _labFeeFundReceiver,
                address _devFeeFundReceiver) {
        tokenHardcap = _tokenHardcap;
        croHardcap = _croHardcap;
        hasWhitelistSetting = _hasWhitelistSettings;
        maxAlloc = _maxAlloc;
        minAlloc = _minAlloc;
        tokenInstance = _tokenInstance;
        startTime = _startTime;
        endTime = _endTime;
        ownerPercent = _ownerPercent;
        labPercent = _labPercent;
        ownerFundReceiver = _ownerFundReceiver;
        labFeeFundReceiver = _labFeeFundReceiver;
    }

    function addToWhitelist(address[] memory _whitelistedAddress) external onlyOwner{
        for(uint256 index=0; index < _whitelistedAddress.length; index++){
            buyers[_whitelistedAddress[index]].isWhitelisted = 1;
        }
    }

    // payable functions
    function presaleBuy() external payable {
        require(
            block.timestamp > startTime && block.timestamp < endTime,
            "Crowdsale: hasn't started or has ended"
        );
        uint256 tokenPrice = tokenHardcap.div(croHardcap);
        require((croRaised.add(msg.value) <= croHardcap), "CrowdSale: presale already sold out");
        if(hasWhitelistSetting){
            require(
                buyers[msg.sender].isWhitelisted == 1,
                "CrowdSale: You're not whitelisted"
            );
            if (maxAlloc > 0) {
                require(
                    msg.value.add(buyers[msg.sender].participation.div(tokenPrice)) <= maxAlloc,
                    "CrowdSale: amount is greater than maximum allocation"
                );
                require(
                    msg.value >= minAlloc,
                    "CrowdSale: amount is less than minimum allocation"
                );

                buyers[msg.sender].participation += (msg.value.mul(tokenPrice));
                soldTokens += (msg.value.mul(tokenPrice));
                croRaised += msg.value;
            } else {
                buyers[msg.sender].participation += (msg.value.mul(tokenPrice));
                soldTokens += (msg.value.mul(tokenPrice));
                croRaised += msg.value;
            }
        } else {
            if (maxAlloc > 0) {
                require(
                    msg.value.add(buyers[msg.sender].participation.div(tokenPrice)) <= maxAlloc,
                    "CrowdSale: amount is greater than maximum allocation"
                );
                require(
                    msg.value >= minAlloc,
                    "CrowdSale: amount is less than minimum allocation"
                );

                buyers[msg.sender].participation += (msg.value.mul(tokenPrice));
                soldTokens += (msg.value.mul(tokenPrice));
                croRaised += msg.value;
            } else {
                buyers[msg.sender].participation += (msg.value.mul(tokenPrice));
                soldTokens += (msg.value.mul(tokenPrice));
                croRaised += msg.value;
            }
        }
    }

    function sendToContract() external payable {

    }

    function distributeCRO() public payable onlyOwner nonReentrant {
        uint256 ownerCRO = address(this).balance * ownerPercent / 100000;
        uint256 labCRO = address(this).balance * labPercent / 100000;

        payable(ownerFundReceiver).transfer(ownerCRO);
        payable(labFeeFundReceiver).transfer(labCRO);
    }

    // claim function

    function claimPresale() external nonReentrant {
        require(
            block.timestamp > startTime && block.timestamp < endTime,
            "Crowdsale: hasn't started or has ended"
        );
        require(
            buyers[msg.sender].participation > 0,
            "Crowdsale: you have no tokens to claim"
        );
        require(tokenInstance.balanceOf(address(this)) >= 0, "CrowdSale: Insufficient Token Balance to distribute");
        uint256 tempBalance = buyers[msg.sender].participation;
        buyers[msg.sender].participation = 0;
        tokenInstance.transfer(msg.sender, tempBalance);
    }

    // change value functions

    function changeTokenInstance(IERC20 _tokenInstance) external onlyOwner {
        tokenInstance = _tokenInstance;
    }

    function changeMaxAlloc(uint256 _maxAlloc) external onlyOwner {
        maxAlloc = _maxAlloc;
    }

    function changeMinAlloc(uint256 _minAlloc) external onlyOwner {
        minAlloc = _minAlloc;
    }

    function changeStartTime(uint256 _startTime) external onlyOwner {
        startTime = _startTime;
    }

    function changeEndTime(uint256 _endTime) external onlyOwner {
        endTime = _endTime;
    }

    function changeOwnerFeeFundReceiver(address _ownerFundReceiver)
        external
        onlyOwner
    {
        ownerFundReceiver = _ownerFundReceiver;
    }

    function changeLabFeeFundReceiver(address _labFeeFundReceiver)
        external
        onlyOwner
    {
        labFeeFundReceiver = _labFeeFundReceiver;
    }

    function changeOwnerPercent(uint256 _ownerPercent) external onlyOwner {
        ownerPercent = _ownerPercent;
    }

    function changeLabPercent(uint256 _labPercent) external onlyOwner {
        labPercent = _labPercent;
    }

    function changeTokenHardcap(uint256 _tokenHardcap) external onlyOwner {
        tokenHardcap = _tokenHardcap;
    }

    function changeCroHardcap(uint256 _croHardcap) external onlyOwner {
        croHardcap = _croHardcap;
    }

    // View functions
    function getTokenInstanceBalance() external view returns (uint256) {
        return tokenInstance.balanceOf(address(this));
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
