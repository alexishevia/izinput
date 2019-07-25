import React from "react";
import { View } from "react-native";
import { Portal } from "react-native-paper";
import { connect } from "react-redux";
import Errors from "./Errors";
import Loading from "./Loading";
import Home from "./Home";

function Root() {
  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <Portal>
        <Errors />
        <Loading />
      </Portal>
      <Home />
    </View>
  );
}

Root.propTypes = {};

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Root);
