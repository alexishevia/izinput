import React from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import { Portal, Text } from "react-native-paper";
import { connect } from "react-redux";
import fileSystem from "../redux/fileSystem";
import Errors from "./Errors";
import Loading from "./Loading";
import SelectFileSystem from "./SelectFileSystem";

function Root({ isFileSystemMounted, isFileSelected }) {
  let content;
  if (isFileSelected) {
    content = <Text>Render Home</Text>;
  } else if (isFileSystemMounted) {
    content = <Text>Render File Picker</Text>;
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
  isFileSelected: fileSystem.selectors.isMounted(state)
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Root);
