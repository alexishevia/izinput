import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { View } from "react-native";
import fileSystem from "../redux/fileSystem";
import Header from "./Header";
import NewTransaction from "./NewTransaction";
import TransactionList from "./TransactionList";

function Home({ path }) {
  return (
    <View style={{ flex: 1 }}>
      <Header subtitle={path} />
      <NewTransaction />
      <TransactionList />
    </View>
  );
}

Home.propTypes = {
  path: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  path: fileSystem.selectors.getPath(state)
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
