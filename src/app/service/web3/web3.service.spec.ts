import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Subject } from 'rxjs';
import Web3 from 'web3';
import { Web3Service } from './web3.service';
import AccountWeb3Model from '../../model/account.web3.model';

class MockWeb3 {
    eth = {
        getAccounts: async () => ['0x1234567890123456789012345678901234567890'],
        getBalance: async () => '1000000000000000000'
    };
}

const mockWindow = {
    ethereum: {
        enable: async () => {}
    },
    web3: {
        currentProvider: {}
    }
};

describe('Web3Service', () => {
    let service: Web3Service;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                Web3Service,
                { provide: Web3, useClass: MockWeb3 },
                { provide: 'Window', useValue: mockWindow }
            ]
        });
        service = TestBed.inject(Web3Service);
    });

    afterEach(() => {
    });

    it('should refresh accounts and emit updated accountsObservable', fakeAsync(async () => {
        let emittedAccounts: AccountWeb3Model[] | undefined = undefined;
        service.accountsObservable.subscribe(accounts => {
            emittedAccounts = accounts;
        });

        await service.refreshAccounts();
        tick(); 

        expect(service['accountsLoaded'].length).toBeGreaterThan(0);
        expect(service['accountsLoaded'][0].address).toBe('0x1234567890123456789012345678901234567890');

        expect(emittedAccounts).toBeDefined();
        expect(emittedAccounts!.length).toBeGreaterThan(0);
        expect(emittedAccounts![0].address).toBe('0x1234567890123456789012345678901234567890');
    }));

});
