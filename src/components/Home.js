import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { View } from "react-native";
import Header from "./Header";
import NewTransaction from "./NewTransaction";
import TransactionList from "./TransactionList";
import dropboxSync from "../Dropbox/sync";

class Home extends React.Component {
  componentDidMount() {
    const { sync } = this.props;
    sync();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header />
        <NewTransaction />
        <TransactionList />
      </View>
    );
  }
}

Home.propTypes = {
  // redux props
  sync: PropTypes.func.isRequired
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  sync: () => dispatch(dropboxSync())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
