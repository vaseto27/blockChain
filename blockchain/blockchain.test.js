const Blockchain = require("./blockchain");
const Block = require("./block");
const Wallet = require("../wallet/wallet");
const cryptoHash = require("../util/crypto-hash");
const Transaction = require("../wallet/transaction");

describe("BlockChain", () => {
  let blockchain, newChain, originalChain, errorMock;

  beforeEach(() => {
    blockchain = new Blockchain();
    newChain = new Blockchain();
    errorMock = jest.fn();
    global.console.error = errorMock;



    originalChain = blockchain.chain;
  });

  it("should contain `chain` Array instance", () => {
    expect(blockchain.chain instanceof Array).toBe(true);
  });
  it("starts with the genesis block", () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis());
  });
  it("adds a new block to the chain", () => {
    const newData = "foo bar";
    blockchain.addBlock({ data: newData });
    expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
  });

  describe("isValidChain()", () => {
    describe("when chain does not start with genesis block", () => {
      it("returns false", () => {
        blockchain.chain[0] = { data: "fake-genesis" };
        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
      });
    });
    describe("when the chain start with genesis block and has multiple blocks", () => {
      beforeEach(() => {
        blockchain.addBlock({ data: "Bears" });
        blockchain.addBlock({ data: "Beer" });
        blockchain.addBlock({ data: "Monkey" });
      });
      describe("and a lasthash reference has change", () => {
        it("returns false", () => {
          blockchain.chain[2].lastHash = "broken-lastHash";

          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe("and the chain containes a block with an invalid field", () => {
        it("returns false", () => {
          blockchain.chain[2].data = "some-bad-data";

          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe("and the chain contains a block with a jumped difficulty", () => {
        it("return false", () => {
          const lastBlock = blockchain.chain[blockchain.chain.length - 1];

          const lastHash = lastBlock.hash;

          const timestamp = Date.now();

          const nonce = 0;
          const data = [];
          const difficulty = lastBlock.difficulty - 3;

          const hash = cryptoHash(timestamp, lastHash, difficulty, nonce, data);

          const badBlock = new Block({
            timestamp,
            lastHash,
            hash,
            nonce,
            difficulty,
            data,
          });

          blockchain.chain.push(badBlock);

          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe("and the chain does not contain any invalid block", () => {
        it("returns true", () => {
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
        });
      });
    });
  });

  describe("replaceChain()", () => {
    let logMock;

    beforeEach(() => {
      logMock = jest.fn();

      global.console.log = logMock;
    });

    describe("when new chain is not longer", () => {
      beforeEach(() => {
        newChain.chain[0] = { new: "chain" };
        blockchain.replaceChain(newChain.chain);
      });

      it("does not replace the chain", () => {
        expect(blockchain.chain).toEqual(originalChain);
      });
      it("logs an error", () => {
        expect(errorMock).toHaveBeenCalled();
      });
    });

    describe('and the `validateTransactions` flag is true', () => {
      it('calls validTransactionData()', () => {
        const validTransactionDataMock = jest.fn();

        blockchain.validTransactionData = validTransactionDataMock;
        newChain.addBlock({data: "foo"})
        blockchain.replaceChain(newChain.chain, true)

        expect(validTransactionDataMock).toHaveBeenCalled();
      })
    })

    describe("when the chain is longer", () => {
      beforeEach(() => {
        newChain.addBlock({ data: "Bears" });
        newChain.addBlock({ data: "Beer" });
        newChain.addBlock({ data: "Monkey" });
      });
      describe("when the chain is invalid", () => {
        beforeEach(() => {
          newChain.chain[2].hash = "some-fake-hash";
          blockchain.replaceChain(newChain.chain);
        });
        it("does not replace the chain", () => {
          expect(blockchain.chain).toEqual(originalChain);
        });
        it("logs an error", () => {
          expect(errorMock).toHaveBeenCalled();
        });
      });

      describe("when the chain is valid", () => {
        beforeEach(() => {
          blockchain.replaceChain(newChain.chain);
        });
        it("replaces the chain", () => {
          expect(blockchain.chain).toEqual(newChain.chain);
        });
        it("logs about the chain replacement", () => {
          expect(logMock).toHaveBeenCalled();
        });
      });
    });
  });

  describe("validTransactionData()", () => {
    let transaction, rewardTransaction, wallet;

    beforeEach(() => {
      wallet = new Wallet();
      transaction = wallet.createTransaction({
        recipient: "foo-address",
        amount: 65,
      });
      rewardTransaction = Transaction.rewardTransactions({
        minerWallet: wallet,
      });
    });

    describe("and the transaction data is valid", () => {
      it("returns true", () => {
        newChain.addBlock({
          data: [transaction, rewardTransaction],
        });
        blockchain.validTransactionData({ chain: newChain.chain });
        expect(blockchain.validTransactionData({chain: newChain.chain})).toBe(true)
        expect(errorMock).not.toHaveBeenCalled();
      });
    });

    describe("and the transaction data has multiple rewards", () => {
      it("return false", () => {
        newChain.addBlock({data: [transaction, rewardTransaction, rewardTransaction]})
        expect(blockchain.validTransactionData({chain: newChain.chain})).toBe(false)
      });
    });

    describe("and the transaction data has at lesast on malformed outputMap", () => {
      describe("and the transaction is not a reward transaction", () => {
        it("return false and logs an error", () => {
          transaction.outputMap[wallet.publicKey] = 999999;
          newChain.addBlock({data: [transaction, rewardTransaction]})
          expect(blockchain.validTransactionData({chain: newChain.chain})).toBe(false)
          expect(errorMock).toHaveBeenCalled();
        });
      });
      describe("and the transaction is a reward transaction", () => {
        it("return false and logs an error", () => {
          rewardTransaction.outputMap[wallet.publicKey] = 999999;

          newChain.addBlock({data: [transaction,rewardTransaction]})
          expect(blockchain.validTransactionData({chain: newChain.chain})).toBe(false)
          expect(errorMock).toHaveBeenCalled();
        });
      });
    });
    describe("and the transaction data has at least one malformed input", () => {
      it("return false and logs an error", () => {
        wallet.balance = 9000;

        const evilOutputMap = {
          [wallet.publicKey]: 8900,
          fooRecipient: 100,
        }

        const evilTransaction = {
          input: {
            timestamp: Date.now(),
            amount: wallet.balance,
            address: wallet.publicKey,
            signature: wallet.sign(evilOutputMap)
          },
          outputMap: evilOutputMap
        }

        newChain.addBlock({
          data: [evilTransaction, rewardTransaction]
        })
        expect(blockchain.validTransactionData({chain: newChain.chain})).toBe(false)
        expect(errorMock).toHaveBeenCalled();
      });
    });
    describe("and a block contains multiple identical transactions", () => {
      it("return false  and logs an error", () => {
        newChain.addBlock({
          data: [transaction,transaction,transaction, rewardTransaction]
        })

        expect(blockchain.validTransactionData({chain: newChain.chain})).toBe(false);
        expect(errorMock).toHaveBeenCalled();
      });
    });
  });
});
