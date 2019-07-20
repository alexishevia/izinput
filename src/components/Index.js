import React from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import { Portal } from "react-native-paper";
import { connect } from "react-redux";
import fileSystem from "../redux/fileSystem";
import Errors from "./Errors";
import Loading from "./Loading";
import SelectFileSystem from "./SelectFileSystem";
import FilePicker from "./FilePicker";
import Home from "./Home";

function Root({ isFileSystemMounted, isFileSelected }) {
  let content;
  if (isFileSelected) {
    content = <Home />;
  } else if (isFileSystemMounted) {
    content = <FilePicker />;
  } else {
    content = <SelectFileSystem />;
  }

  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <Portal>
        <Errors />
        <Loading />
      </Portal>
      {content}
    </View>
  );
}

Root.propTypes = {
  isFileSystemMounted: PropTypes.bool.isRequired,
  isFileSelected: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  isFileSystemMounted: fileSystem.selectors.isMounted(state),
  isFileSelected: fileSystem.selectors.isFileSelected(state)
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Root);
