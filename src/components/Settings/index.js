import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { View } from "react-native";
import Header from "../Header";
import router from "../../redux/router";
import DropboxSettings from "./Dropbox";

function Settings({ goToHome }) {
  return (
    <View style={{ flex: 1 }}>
      <Header title="Settings" onGoBack={() => goToHome()} />
      <DropboxSettings />
    </View>
  );
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  goToHome: () => dispatch(router.actions.goToHome())
});

Settings.propTypes = {
  // redux props
  goToHome: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);