import { Component, OnInit } from '@angular/core';
import AccountWeb3Model from '../../model/account.web3.model';
import { Web3Service } from '../../core/web3';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trasferencia',
  templateUrl: './trasferencia.component.html',
  styleUrls: ['./trasferencia.component.css']
})
export class TrasferenciaComponent implements OnInit {
  account: AccountWeb3Model = new AccountWeb3Model();
  private web3js: any;
  recipientAddress: string = '';
  amount: number = 0;
  transactionMessage: string | null = null;
  transactionSuccess: boolean = false;

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
    this.transactionMessage = null;
    if (!this.web3js) {
      this.transactionMessage = 'Web3 provider is not initialized.';
      this.transactionSuccess = false;
      return;
    }

    if (!this.recipientAddress) {
      this.transactionMessage = 'Recipient address is not specified.';
      this.transactionSuccess = false;
      return;
    }

    if (this.amount <= 0) {
      this.transactionMessage = 'Amount should be greater than zero.';
      this.transactionSuccess = false;
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

      this.transactionMessage = `Transaction successful! Sent ${this.amount} ETH to ${this.recipientAddress}`;
      this.transactionSuccess = true;
      this.updateAccountInfo(); 
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.transactionMessage = 'Transaction failed: ' + error.message;
      } else {
        this.transactionMessage = 'Transaction failed: Unknown error';
      }
      this.transactionSuccess = false;
    }
  }

  goSendRemittance() {
    this.router.navigate(['/send-remittance']).then();
  }

  logoutWeb3() {
    this.web3js = null; 
    this.account = new AccountWeb3Model();
  }
}
