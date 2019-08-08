import React from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import { connect } from "react-redux";
import Header from "./Header";
import NewTransaction from "../transactions/components/NewTransaction";
import EditTransaction from "../transactions/components/EditTransaction";
import TransactionList from "../transactions/components/TransactionList";
import SyncState from "../sync/components/SyncState";
import transactionsSlice from "../transactions/slice";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { active: null };
  }

  selectTransaction(id) {
    const { transactions } = this.props;
    const active = transactions.find(tx => tx.id === id);
    if (active) {
      this.setState({ active });
    }
  }

  render() {
    const { active } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <Header />
        {active ? (
          <EditTransaction
            transaction={active}
            onDone={() => this.setState({ active: null })}
          />
        ) : (
          <NewTransaction />
        )}
        <TransactionList
          onSelectTransaction={id => this.selectTransaction(id)}
        />
        <SyncState />
      </View>
    );
  }
}

Home.propTypes = {
  // redux props
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  ).isRequired
};

const mapStateToProps = state => ({
  transactions: transactionsSlice.selectors.active(state)
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
