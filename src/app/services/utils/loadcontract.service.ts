import { Injectable } from '@angular/core';
import IERC20 from '../../contracts/IERC20.json';
import TICKET from '../../contracts/Ticket.json';
import CROWDSALE from '../../contracts/CrowdSale.json';

@Injectable({ providedIn: 'root' })
export class LoadContractService {
  contract = require('@truffle/contract');

  async loadIERC20Contract(provider: any) {
    const res = IERC20;
    const Artifact = await res;
    let _contract = this.contract(Artifact);
    _contract.setProvider(provider);
    await _contract
      .at('0x7f7a30209b49c5e78dC503359Ea23C0C596a69f2')
      .then((result: any) => {
        _contract = result;
      });
    return _contract;
  }

  async loadTicketContract(provider: any) {
    const res = TICKET;
    const Artifact = await res;
    let _contract = this.contract(Artifact);
    _contract.setProvider(provider);
    await _contract
      .at('0xf7fCE252C2578081be3D8BD91609bC7Fb0CFeb39')
      .then((result: any) => {
        _contract = result;
      });
    return _contract;
  }


  // Token Sale Contracts


  // 1. ETHER CROWDSALE CONTRACT
  async loadCrowdSaleContract(provider: any, address: string) {
    const res = CROWDSALE;
    const Artifact = await res;
    let _contract = this.contract(Artifact);
    _contract.setProvider(provider);
    await _contract
      .at(address)
      .then((result: any) => {
        _contract = result;
      });
    return _contract;
  }
  // 1. ETH TOKEN CONTRACT
  async loadPresaleTokenContract(provider: any, address: string) {
    const res = IERC20;
    const Artifact = await res;
    let _contract = this.contract(Artifact);
    _contract.setProvider(provider);
    await _contract
      .at(address)
      .then((result: any) => {
        _contract = result;
      });
    return _contract;
  }
}
