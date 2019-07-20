import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { View } from "react-native";
import { Button } from "react-native-paper";
import Header from "./Header";
import fileSystem from "../redux/fileSystem";

function SelectFileSystem({ onDropboxLogin }) {
  return (
    <View style={{ flex: 1 }}>
      <Header />
      <Button onPress={onDropboxLogin} style={{ marginTop: 20 }}>
        Login with Dropbox
      </Button>
    </View>
  );
}

SelectFileSystem.propTypes = {
  onDropboxLogin: PropTypes.func.isRequired
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => {
  return {
    onDropboxLogin: () => dispatch(fileSystem.actions.useDropbox())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectFileSystem);
