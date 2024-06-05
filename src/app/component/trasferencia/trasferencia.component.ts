import { Component, OnInit } from '@angular/core';
import AccountWeb3Model from '../../model/account.web3.model';
import { Web3Service } from '../../core/web3';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trasferencia',
  templateUrl: './trasferencia.component.html',
  styleUrl: './trasferencia.component.css'
})
export class TrasferenciaComponent implements OnInit {
  account: AccountWeb3Model = new AccountWeb3Model();
  private web3js: any;
  recipientAddress: string = '';
  amount: number = 0;

  constructor(
    private web3Service: Web3Service,
    private router: Router
  ) {
    this.web3Service.accountsObservable.subscribe(account => {
      if (account) {
        this.updateAccountInfo();
      }
    });
  }

  ngOnInit(): void {
    this.web3Service.refreshAccounts();
  }

  async updateAccountInfo() {
    if (!this.web3js) {
      this.web3js = this.web3Service.getWeb3();
    }

    if (this.web3js) {
      const accounts = await this.web3js.eth.getAccounts();
      const weiBalance = await this.web3js.eth.getBalance(accounts[0]);
      const ethBalance = Number(this.web3js.utils.fromWei(weiBalance, 'ether'));
      this.account = new AccountWeb3Model().build(accounts[0], ethBalance);
    }
  }

  async connectMetaMask() {
    this.web3js = await this.web3Service.connectAccount();
    if (this.web3js) {
      this.updateAccountInfo();
    }
  }

  async sendTransaction() {
    if (!this.web3js) {
      console.error('Web3 provider is not initialized.');
      return;
    }

    if (!this.recipientAddress) {
      console.error('Recipient address is not specified.');
      return;
    }

    if (this.amount <= 0) {
      console.error('Amount should be greater than zero.');
      return;
    }

    try {
      const accounts = await this.web3js.eth.getAccounts();
      const fromAddress = accounts[0];
      const value = this.web3js.utils.toWei(this.amount.toString(), 'ether');

      await this.web3js.eth.sendTransaction({
        from: fromAddress,
        to: this.recipientAddress,
        value: value
      });

      console.log(`Transaction successful! Sent ${this.amount} ETH to ${this.recipientAddress}`);
      this.updateAccountInfo(); // Refresh account info after transaction
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  }

  goSendRemittance() {
    this.router.navigate(['/send-remittance']).then();
  }

  // New function to handle Salir de la web3 functionality
  logoutWeb3() {
    this.web3js = null; // Disconnect from Web3 provider
    this.account = new AccountWeb3Model(); // Reset account information
  }
}
