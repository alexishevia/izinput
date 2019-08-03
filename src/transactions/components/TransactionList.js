import React from "react";
import { FlatList } from "react-native";
import { List } from "react-native-paper";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import slice from "../slice";

function Transaction({ charge, description }) {
  return <List.Item title={`$${charge.toFixed(2)} - ${description}`} />;
}

Transaction.propTypes = {
  charge: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired
};

function TransactionList({ transactions: txs }) {
  return (
    <FlatList
      data={txs}
      keyExtractor={tx => tx.id}
      renderItem={({ item }) => <Transaction {...item} />}
    />
  );
}

TransactionList.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      charge: PropTypes.number.isRequired,
      description: PropTypes.string.isRequired
    })
  ).isRequired
};

const mapStateToProps = state => ({
  transactions: slice.selectors.newest(state)
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TransactionList);
