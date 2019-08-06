import React from "react";
import { View } from "react-native";
import Header from "./Header";
import NewTransaction from "../transactions/components/NewTransaction";
import TransactionList from "../transactions/components/TransactionList";
import SyncState from "../sync/components/SyncState";

export default function Home() {
  return (
    <View style={{ flex: 1 }}>
      <Header />
      <NewTransaction />
      <TransactionList />
      <SyncState />
    </View>
  );
}
