// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract LabToken is ERC20, Ownable, ReentrancyGuard{
    using SafeMath for uint256;

    IERC721 CS;

    uint256 public LAB_PER_CRO_PRESALE = 50;
    uint256 public LAB_HARDCAP_PRESALE = 20000000 ether;
    uint256 public LAB_TOTAL_PRESALE;
    uint256 public CRO_RAISED_PRESALE;

    uint256 public LAB_PER_CRO_PUBLIC = 40;
    uint256 public LAB_HARDCAP_PUBLIC = 10000000;
    uint256 public CRO_RAISED_PUBLIC;
    mapping(address => uint256) public participation;
    mapping(address => uint256) public presaleBalance;

    bool public presalePause = true;
    bool public publicPause = true;
    bool public claimPause = true;

    address public farmOperator;
    address public stakingOperator;
    address public publicSaleOperator;


    constructor() ERC20("LAB", "LAB"){
        // _mint(0x7B9AB8d022133227a3ACD643b4E4C48E2618fBAF, 50000000 ether); //Marketing Wallet
        // _mint(0xB6e641aDf08BD4539593C17471d177e9EFd10351, 50000000 ether); //Team Wallet
        // _mint(0x69CD68C442A6459EF3D863D1bcDA566915e08DD2, 200000000 ether); //Development and Partnership Wallet
        // _mint(0x758D43E362E12B23194C474FD5e70529CE6887E0, 600000000 ether); //Liquidity/Farm Wallet
        _mint(0x92081548f0B1046c458137355F27Fa37F4a7bbB9, 1470000000 ether);
    }

    function setLabHardcap(uint256 _labHardcap) external onlyOwner{
        LAB_HARDCAP_PRESALE = _labHardcap;
    }

    function setRaisedCro(uint256 _raisedCro) external onlyOwner{
        CRO_RAISED_PUBLIC = _raisedCro;
    }

    function setParticipation(uint256 _participation) external onlyOwner{
        participation[msg.sender] = _participation;
    }

    function setStakingOperator(address _stakingOperator) external onlyOwner{
        stakingOperator = _stakingOperator;
    }

    function setFarmOperator(address _farmOperator) external onlyOwner{
        farmOperator = _farmOperator;
    }

    function setPublicSaleOperator(address _publicSaleOperator) external onlyOwner{
        publicSaleOperator = _publicSaleOperator;
    }

    function setPresalePause() external onlyOwner{
        presalePause = !presalePause;
    }

    function setPublicPause() external onlyOwner{
        publicPause = !publicPause;
    }

    function setClaimPause() external onlyOwner{
        claimPause = !claimPause;
    }

    function setCs(IERC721 _cs) external onlyOwner{
        CS = _cs;
    }

    function getPercentage() public view returns(uint256){
        return participation[msg.sender].div(CRO_RAISED_PUBLIC);
    }

    function getTokenSale() public view returns(uint256){
        return getPercentage().mul(LAB_HARDCAP_PRESALE);
    }

    function getTotalPayment() public view returns(uint256){
        return getTokenSale().div(LAB_PER_CRO_PRESALE);
    }

    function getRefund() public view returns(uint256){
        return participation[msg.sender].sub(getTotalPayment());
    }

    function presaleBuy() payable external{
        require(!presalePause, "LAB :: Presale paused");
        require(presaleBalance[msg.sender] + (msg.value * LAB_PER_CRO_PRESALE) <= 57142 ether, "LAB :: Exceeds max wallet");
        require((LAB_TOTAL_PRESALE + (msg.value * LAB_PER_CRO_PRESALE)) <= LAB_HARDCAP_PRESALE, "LAB :: Exceeds hardcap");
        require(CS.balanceOf(msg.sender) > 0, "LAB :: You're not NFT Holder");

        payable(0x94409240dEe7E71Fba10640Ed57Eec3fB8097CA8).transfer(msg.value);
        presaleBalance[msg.sender] += (msg.value * LAB_PER_CRO_PRESALE);
        LAB_TOTAL_PRESALE += (msg.value * LAB_PER_CRO_PRESALE);
        CRO_RAISED_PRESALE += msg.value;
    }

    function presaleClaim() external nonReentrant{
        require(!claimPause, "LAB :: claim not active");
        require(presaleBalance[msg.sender] > 0, "LAB :: don't have balance");

        uint256 tempBalance = presaleBalance[msg.sender];
        presaleBalance[msg.sender] = 0;
        _mint(msg.sender, tempBalance);
    }

    function publicsaleBuy() external payable{
        require(!publicPause, "LAB :: Public sale paused");

        participation[msg.sender] += msg.value;
    }

    function publicClaim() external nonReentrant{
        require(!claimPause, "LAB :: claim not active");
        require(participation[msg.sender] > 0, "LAB :: Don't have participation");

        payable(msg.sender).transfer(getRefund());
        _mint(msg.sender, getTokenSale());

        participation[msg.sender] = 0;
    }

    function fundsClaim() external onlyOwner{
        payable(msg.sender).transfer(address(this).balance);
    }

    function forOperator(uint256 _amount, address _user) external{
        require(msg.sender == farmOperator || msg.sender == stakingOperator || msg.sender == publicSaleOperator, "LAB :: Caller not operator");
        _mint(_user, _amount);
    }

    function emergencyMint(uint256 _amount) external onlyOwner{
        _mint(msg.sender, _amount);
    }
}
