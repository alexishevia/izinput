import React from "react";
import { connect } from "react-redux";
import { View } from "react-native";
import Header from "./Header";
import NewTransaction from "./NewTransaction";
import TransactionList from "./TransactionList";

function Home() {
  return (
    <View style={{ flex: 1 }}>
      <Header />
      <NewTransaction />
      <TransactionList />
    </View>
  );
}

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
