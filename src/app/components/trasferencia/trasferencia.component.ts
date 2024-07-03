import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import AccountWeb3Model from '../../model/account.web3.model';
import { Router } from '@angular/router';
import { Web3Service } from '../../service/web3/web3.service';

@Component({
  selector: 'app-trasferencia',
  templateUrl: './trasferencia.component.html',
  styleUrls: ['./trasferencia.component.css']
})
export class TrasferenciaComponent implements OnInit {
  transactionForm: FormGroup;
  account: AccountWeb3Model = new AccountWeb3Model();
  address: string = '';
  balance: number = 0;
  isConnecting: boolean = false;
  web3Initialized: boolean = false;
  transactionStatus: string | null = null;
  transactionSuccess: boolean = false;

  constructor(
    private fb: FormBuilder,
    private web3Service: Web3Service,
    private router: Router
  ) {
    this.transactionForm = this.fb.group({
      toAddress: ['', [Validators.required, Validators.pattern(/^0x[a-fA-F0-9]{40}$/)]],
      amount: ['', [Validators.required, Validators.min(0.00000001)]]
    });
  }

  async ngOnInit() {
    await this.web3Service.initWeb3();
    this.updateAccountInfo();
  }

  async updateAccountInfo() {
    try {
      this.address = await this.web3Service.getAddress();
      this.balance = await this.web3Service.getBalance();
      this.web3Initialized = true;
    } catch (error) {
      console.error('Error updating account info:', error);
    }
  }

  async connectWallet() {
    if (!this.isConnecting) {
      this.isConnecting = true;
      try {
        await this.web3Service.initWeb3();
        this.address = await this.web3Service.getAddress();
        this.balance = await this.web3Service.getBalance();
        this.web3Initialized = true;
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
      } finally {
        this.isConnecting = false;
      }
    } else {
      console.warn('Request to connect to MetaMask is already in progress.');
    }
  }

  async sendTransaction() {
    this.transactionStatus = null;
    if (!this.web3Initialized) {
      this.transactionStatus = 'Web3 is not initialized. Please connect to MetaMask first.';
      return;
    }

    const toAddress = this.transactionForm.get('toAddress')?.value;
    const amount = this.transactionForm.get('amount')?.value;

    if (!toAddress || !amount) {
      this.transactionStatus = 'Please complete all fields correctly.';
      setTimeout(() => {
        this.transactionStatus = null;
      }, 3000);
      return;
    }

    try {
      this.transactionForm.disable();
      await this.web3Service.sendTransaction(toAddress, amount);
      this.transactionStatus = `Transaction successful! Sent ${amount} ETH to ${toAddress}`;
      this.transactionSuccess = true;
      this.updateAccountInfo();
      this.transactionForm.reset();
    } catch (error: unknown) {
      console.error('Error sending transaction:', error);
      this.transactionStatus = `Transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.transactionSuccess = false;
    } finally {
      this.transactionForm.enable();
      setTimeout(() => {
        this.transactionStatus = null;
      }, 3000);
    }
  }

  disconnectWallet() {
    this.web3Service.disconnect();
    this.address = '';
    this.balance = 0;
    this.web3Initialized = false;
    this.transactionStatus = 'Wallet disconnected';
    setTimeout(() => {
      this.transactionStatus = null;
    }, 3000);
    location.reload();
  }

  async disconnectMetaMask() {
    await this.web3Service.disconnectMetaMask();
    this.address = '';
    this.balance = 0;
    this.web3Initialized = false;
    this.transactionStatus = 'MetaMask disconnected';
    setTimeout(() => {
      this.transactionStatus = null;
    }, 3000);
  }
}
