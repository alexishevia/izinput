import React from "react";
import { FlatList } from "react-native";
import { List } from "react-native-paper";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { transactions as transactionsSlice } from "izreducer";
import { latestTransactions } from "../selectors";

const { TYPES: transactionTypes } = transactionsSlice;

const ICONS = {
  [transactionTypes.CREDIT]: "💳",
  [transactionTypes.CASH]: "💵",
  [transactionTypes.TRANSFER]: "🏦"
};

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
