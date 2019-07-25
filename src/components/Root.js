import React from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import { Portal } from "react-native-paper";
import { connect } from "react-redux";
import router from "../redux/router";
import Errors from "./Errors";
import Home from "./Home";
import Settings from "./Settings";

function Root({ renderSettings }) {
  const screen = renderSettings ? <Settings /> : <Home />;
  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <Portal>
        <Errors />
      </Portal>
      {screen}
    </View>
  );
}

Root.defaultProps = {
  renderSettings: false,
};

Root.propTypes = {
  // redux props
  renderSettings: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  renderSettings: router.selectors.atSettings(state),
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Root);
