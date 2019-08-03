import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { View } from "react-native";
import Header from "./Header";
import router from "../router/slice";
import DropboxSettings from "../Dropbox/components/Settings";

function Settings({ goToHome, goToDropboxFilePicker }) {
  return (
    <View style={{ flex: 1 }}>
      <Header title="Settings" onGoBack={() => goToHome()} />
      <DropboxSettings openFilePicker={goToDropboxFilePicker} />
    </View>
  );
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  goToHome: () => dispatch(router.actions.goToHome()),
  goToDropboxFilePicker: () => dispatch(router.actions.goToDropboxFilePicker())
});

Settings.propTypes = {
  // redux props
  goToHome: PropTypes.func.isRequired,
  goToDropboxFilePicker: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);
