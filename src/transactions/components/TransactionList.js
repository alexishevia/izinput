import React from "react";
import { FlatList } from "react-native";
import { List } from "react-native-paper";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import { transactions as transactionsSlice } from "izreducer";

const { TYPES: transactionTypes } = transactionsSlice;

const MAX_TRANSACTIONS = 10;

const ICONS = {
  [transactionTypes.CREDIT]: "💳",
  [transactionTypes.CASH]: "💵",
  [transactionTypes.TRANSFER]: "🏦"
};

// selectors
function sortByDateStrDesc(dateStrA, dateStrB) {
  if (dateStrA < dateStrB) return 1;
  if (dateStrA > dateStrB) return -1;
  return 0;
}

function sortTransactions(txA, txB) {
  return sortByDateStrDesc(txA.modifiedAt, txB.modifiedAt);
}

const sortedTransactions = createSelector(
  [transactionsSlice.selectors.active],
  transactions => transactions.sort(sortTransactions)
);

const latestTransactions = createSelector(
  [sortedTransactions],
  transactions => transactions.slice(0, MAX_TRANSACTIONS)
);

function Transaction({
  charge,
  category,
  transactionDate,
  description,
  type,
  onPress
}) {
  const prefix = charge < 0 ? "-" : "";
  const formatted = Math.abs(charge).toFixed(2);
  const icon = ICONS[type] || "  ";
  return (
    <List.Item
      title={`${icon} ${prefix}$${formatted} ${category}`}
      description={`${description}\n${transactionDate}`}
      onPress={onPress}
    />
  );
}

Transaction.propTypes = {
  charge: PropTypes.number.isRequired,
  category: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  transactionDate: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired
};

function TransactionList({ transactions: txs, onSelectTransaction }) {
  return (
    <FlatList
      data={txs}
      keyExtractor={tx => tx.id}
      renderItem={({ item }) => (
        <Transaction {...item} onPress={() => onSelectTransaction(item.id)} />
      )}
    />
  );
}

TransactionList.propTypes = {
  // own props
  onSelectTransaction: PropTypes.func.isRequired,

  // redux props
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      charge: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      transactionDate: PropTypes.string.isRequired
    })
  ).isRequired
};

const mapStateToProps = state => ({
  transactions: latestTransactions(state)
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TransactionList);
