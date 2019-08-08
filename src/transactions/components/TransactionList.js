import React from "react";
import { FlatList } from "react-native";
import { List } from "react-native-paper";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import slice from "../slice";

function Transaction({ charge, category, description, onPress }) {
  const prefix = charge < 0 ? "-" : "";
  const formatted = Math.abs(charge).toFixed(2);
  const desc = description ? ` - ${description}` : "";
  return (
    <List.Item
      title={`${prefix}$${formatted} ${category}${desc}`}
      onPress={onPress}
    />
  );
}

Transaction.propTypes = {
  charge: PropTypes.number.isRequired,
  category: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
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
      description: PropTypes.string.isRequired
    })
  ).isRequired
};

const mapStateToProps = state => ({
  transactions: slice.selectors.active(state)
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TransactionList);
