import React from "react";
import PropTypes from "prop-types";
import { Appbar, withTheme } from "react-native-paper";

function FilePickerHeader({ subtitle, onGoBack }) {
  return (
    <Appbar.Header>
      <Appbar.BackAction onPress={onGoBack} />
      <Appbar.Content title="Select File" subtitle={subtitle} />
    </Appbar.Header>
  );
}

FilePickerHeader.defaultProps = {
  subtitle: ""
};

FilePickerHeader.propTypes = {
  subtitle: PropTypes.string,
  onGoBack: PropTypes.func.isRequired
};

export default withTheme(FilePickerHeader);
