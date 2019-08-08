import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { View, ScrollView } from "react-native";
import Header from "./Header";
import router from "../router/slice";
import DropboxSettings from "../Dropbox/components/Settings";
import CategorySettings from "../categories/components/Settings";

function Settings({ goToHome, goToDropboxFilePicker }) {
  return (
    <View style={{ flex: 1 }}>
      <Header title="Settings" onGoBack={() => goToHome()} />
      <ScrollView style={{ flex: 1, margin: 8 }}>
        <DropboxSettings openFilePicker={goToDropboxFilePicker} />
        <CategorySettings />
      </ScrollView>
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
