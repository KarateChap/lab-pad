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
    address public devFeeFundReceiver; // receiving address of dev

    uint256 public ownerPercent; // percentage of owner in terms of total collected CRO
    uint256 public labPercent; // percentage of lab in terms of total collected CRO
    uint256 public devPercent; // percentage of dev in terms of total collected CRO

    //PRESALE VARIABLES

    uint256 public croHardcap; // hardcap of the presale in terms of CRO
    uint256 public tokenHardcap; // hardcap of the presale in terms of token
    uint256 public soldTokens; // amount of tokens sold in the presale
    uint256 public croRaised; //amount of raised CRO

    uint256 public startTime; // starting time of presale in unix
    uint256 public endTime; // ending time of presale in unix

    bool public hasMaxMinAlloc; // check if the presale has max participation allocation per wallet
    uint256 public maxAlloc; // maximum token participation allocation
    uint256 public minAlloc; // minimum token participation allocation

    bool public isPresaleStop; // presale pause/complete function

    mapping(address => uint256) public presaleParticipation; // participation amount of a wallet address in terms of tokens

    constructor(IERC20 _tokenInstance) {
        tokenHardcap = 100 ether;
        croHardcap = 10 ether;
        soldTokens = 0;
        croRaised = 0;
        hasMaxMinAlloc = true;
        maxAlloc = 1000000000000000000;
        minAlloc = 500000000000000000;
        isPresaleStop = false;
        tokenInstance = _tokenInstance;
        startTime = 1650661200;
        endTime = 1650661500;
        isPresaleStop = true;
        ownerPercent = 95;
        labPercent = 3;
        devPercent = 2;
        ownerFundReceiver = 0x3bA8E70a107491864D783aBc6d3767be3884CE84;
        labFeeFundReceiver = 0x3bA8E70a107491864D783aBc6d3767be3884CE84;
        devFeeFundReceiver = 0x3bA8E70a107491864D783aBc6d3767be3884CE84;
    }

    function checkPresaleDuration() public {
        if (block.timestamp > startTime && block.timestamp < endTime) {
            isPresaleStop = false;
        } else {
            isPresaleStop = true;
        }
    }

    // payable functions
    function presaleBuy() external payable {
        checkPresaleDuration();
        uint256 tokenPrice = tokenHardcap.div(croHardcap);
        require(
            isPresaleStop == false,
            "CrowdSale: Cannot Participate on presale"
        );
        require((croRaised.add(msg.value) <= croHardcap), "CrowdSale: presale already sold out");
        if (hasMaxMinAlloc == true) {
            require(
                msg.value.add(presaleParticipation[msg.sender].div(tokenPrice)) <= maxAlloc,
                "CrowdSale: amount is greater than maximum allocation"
            );
            require(
                msg.value >= minAlloc,
                "CrowdSale: amount is less than minimum allocation"
            );

            presaleParticipation[msg.sender] += (msg.value.mul(tokenPrice));
            soldTokens += (msg.value.mul(tokenPrice));
            croRaised += msg.value;
        } else {
            presaleParticipation[msg.sender] += (msg.value.mul(tokenPrice));
            soldTokens += (msg.value.mul(tokenPrice));
            croRaised += msg.value;
        }
    }

    function sendToContract() external payable {

    }

    function distributeCRO() public payable onlyOwner nonReentrant {
        uint256 ownerCRO = address(this).balance * ownerPercent / 100;
        uint256 labCRO = address(this).balance * labPercent / 100;
        uint256 devCRO = address(this).balance * devPercent / 100;

        payable(ownerFundReceiver).transfer(ownerCRO);
        payable(labFeeFundReceiver).transfer(labCRO);
        payable(devFeeFundReceiver).transfer(devCRO);
    }

    // claim function

    function claimPresale() external onlyOwner nonReentrant {
        checkPresaleDuration();
        require(isPresaleStop == true, "CrowdSale: cannot claim tokens yet");
        require(
            presaleParticipation[msg.sender] > 0,
            "Crowdsale: you have no tokens to claim"
        );
        require(tokenInstance.balanceOf(address(this)) >= tokenHardcap, "CrowdSale: Insufficient Token Balance to distribute");
        uint256 tempBalance = presaleParticipation[msg.sender];
        presaleParticipation[msg.sender] = 0;
        tokenInstance.transfer(msg.sender, tempBalance);
    }

    // change value functions

    function changeTokenInstance(IERC20 _tokenInstance) external onlyOwner {
        tokenInstance = _tokenInstance;
    }

    function changeHasMaxMinAlloc(bool _hasMaxMinAlloc) external onlyOwner {
        hasMaxMinAlloc = _hasMaxMinAlloc;
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

    function changeDevFeeFundReceiver(address _ownerFundReceiver)
        external
        onlyOwner
    {
        devFeeFundReceiver = _ownerFundReceiver;
    }

    function changeOwnerPercent(uint256 _ownerPercent) external onlyOwner {
        ownerPercent = _ownerPercent;
    }

    function changeLabPercent(uint256 _labPercent) external onlyOwner {
        labPercent = _labPercent;
    }

    function changeDevPercent(uint256 _devPercent) external onlyOwner {
        devPercent = _devPercent;
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

    function getIsPresaleStop() external view returns (bool) {
        return isPresaleStop;
    }
}
