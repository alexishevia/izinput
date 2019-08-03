import React from "react";
import { connect } from "react-redux";
import { View } from "react-native";
import Header from "./Header";
import NewTransaction from "../transactions/components/NewTransaction";
import TransactionList from "../transactions/components/TransactionList";

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
