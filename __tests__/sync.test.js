import TestApp from "./helpers/TestApp";
import { SYNCED } from "../src/sync/selectors";

function pick(obj, keys) {
  return Object.entries(obj).reduce((memo, [key, val]) => {
    return keys.includes(key) ? { ...memo, [key]: val } : memo;
  }, {});
}

// transaction values used in tests
const compareKeys = ["charge", "category", "description"];

const getTransactionSlug = tx => `${tx.description}-${tx.description}`;

// converts transactions to a "standard" format for comparison
function normalizeTxs(txArr) {
  return txArr
    .map(tx => pick(tx, compareKeys))
    .sort((tx1, tx2) => {
      const [id1, id2] = [tx1, tx2].map(getTransactionSlug);
      if (id1 === id2) return 0;
      return id1 < id2 ? -1 : 1;
    });
}

describe("sync()", () => {
  describe("sync a new app to an empty playbook", () => {
    let app;

    beforeEach(() => {
      app = new TestApp();
      return app.sync();
    });

    it("does not modify transactions", () => {
      expect(app.transactions).toEqual([]);
    });

    it("does not modify localActions", () => {
      expect(app.localActions).toEqual([]);
    });

    it("sets the sync state to SYNCED", () => {
      expect(app.syncState).toEqual(SYNCED);
    });
  });

  describe("sync an existing app with transactions to a new app", () => {
    let oldApp;
    let newApp;

    const txData = [
      { charge: 5.0, category: "CAT1", description: "foo" },
      { charge: 10.0, category: "CAT2", description: "bar" }
    ];

    beforeEach(async () => {
      oldApp = new TestApp();
      await oldApp.addTransactions(txData);
      await oldApp.sync();

      newApp = new TestApp({ remoteStorage: oldApp.remoteStorage });
      await newApp.sync();
    });

    it("keeps the existing app transactions intact", () => {
      const received = oldApp.transactions;
      const expected = txData;
      expect(normalizeTxs(received)).toEqual(normalizeTxs(expected));
    });

    it("correctly copies the existing transactions to the new app", () => {
      const received = newApp.transactions;
      const expected = txData;
      expect(normalizeTxs(received)).toEqual(normalizeTxs(expected));
    });

    it("sets the sync state to SYNCED", () => {
      expect(oldApp.syncState).toEqual(SYNCED);
      expect(newApp.syncState).toEqual(SYNCED);
    });
  });

  describe("sync apps without conflicts", () => {
    let appA;
    let appB;

    const txData = [
      { charge: 5.0, category: "CAT1", description: "foo" },
      { charge: 10.0, category: "CAT2", description: "bar" },
      { charge: 15.0, category: "CAT1", description: "hello" },
      { charge: 20.0, category: "CAT2", description: "world" }
    ];

    beforeEach(async () => {
      appA = new TestApp();
      appB = new TestApp({ remoteStorage: appA.remoteStorage });

      await appA.addTransaction(txData[0]);
      await appB.addTransaction(txData[1]);
      await appA.addTransaction(txData[2]);
      await appB.addTransaction(txData[3]);

      await appA.sync();
      await appB.sync();
      await appA.sync();
      await appB.sync();
    });

    it("syncs transactions correctly to the first app", () => {
      const received = appA.transactions;
      const expected = txData;
      expect(normalizeTxs(received)).toEqual(normalizeTxs(expected));
    });

    it("syncs transactions correctly to the second app", () => {
      const received = appB.transactions;
      const expected = txData;
      expect(normalizeTxs(received)).toEqual(normalizeTxs(expected));
    });

    it("sets the sync state to SYNCED", () => {
      expect(appA.syncState).toEqual(SYNCED);
      expect(appB.syncState).toEqual(SYNCED);
    });
  });

  describe("sync apps with conflicts", () => {
    let appA;
    let appB;

    beforeEach(async () => {
      appA = new TestApp();
      appB = new TestApp({ remoteStorage: appA.remoteStorage });

      await appA.addTransaction({
        charge: 5.0,
        category: "CAT1",
        description: "foo"
      });
      await appA.sync();
      await appB.sync();
      // up to this point, apps are synced

      // introduce conflicting updates in both apps
      const txId = appA.transactions[0].id;
      await appA.modifyTransaction({ id: txId, charge: 10 });
      await appB.deleteTransaction(txId);
    });

    describe("if app A syncs first", () => {
      beforeEach(async () => {
        await appA.sync();
        await appB.sync();
      });

      it("ignores conflicting changes in app B", () => {
        const expected = [{ charge: 10, category: "CAT1", description: "foo" }];
        expect(normalizeTxs(appA.transactions)).toEqual(expected);
        expect(normalizeTxs(appB.transactions)).toEqual(expected);
      });
    });

    describe("if app B syncs first", () => {
      beforeEach(async () => {
        await appB.sync();
        await appA.sync();
      });

      it("ignores conflicting changes in app A", () => {
        expect(appA.transactions).toEqual([]);
        expect(appB.transactions).toEqual([]);
      });
    });
  });
});
