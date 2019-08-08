import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { View, Alert } from "react-native";
import { Title, Text, Button } from "react-native-paper";
import slice from "../slice";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";

function LoggedOut() {
  return (
    <View>
      <Text>
        You can connect to Dropbox and sync your transactions to a file.
      </Text>
      <View
        style={{ flexDirection: "row", justifyContent: "center", padding: 10 }}
      >
        <LoginButton />
      </View>
    </View>
  );
}

function ChangeFileButton({ onPress }) {
  const onBtnPress = () =>
    Alert.alert(
      "Data Loss Warning",
      "If you change the sync file, all local data will be discarded, and data from the new file will be loaded.\n\nAre you sure you want to change the sync file?",
      [
        { text: "Change file", onPress, style: "destructive" },
        { text: "Keep Current File", onPress: () => {}, style: "cancel" }
      ]
    );
  return (
    <Button style={{ marginRight: 20 }} onPress={onBtnPress}>
      Change File
    </Button>
  );
}

ChangeFileButton.propTypes = {
  onPress: PropTypes.func.isRequired
};

function FilePickButton({ onPress }) {
  return (
    <Button mode="contained" style={{ marginRight: 20 }} onPress={onPress}>
      Select File
    </Button>
  );
}

FilePickButton.propTypes = {
  onPress: PropTypes.func.isRequired
};

function LoggedIn({ openFilePicker }) {
  return (
    <View>
      <Text>
        You are connected to Dropbox, but you still need to select a file to use
        for sync.
      </Text>
      <View
        style={{ flexDirection: "row", justifyContent: "center", padding: 10 }}
      >
        <FilePickButton onPress={openFilePicker} />
        <LogoutButton />
      </View>
    </View>
  );
}

LoggedIn.propTypes = {
  openFilePicker: PropTypes.func.isRequired
};

function FileSelected({ filepath, openFilePicker }) {
  return (
    <View>
      <Text>You are connected to Dropbox and syncing to file:</Text>
      <Text>{filepath}</Text>
      <View
        style={{ flexDirection: "row", justifyContent: "center", padding: 10 }}
      >
        <ChangeFileButton onPress={openFilePicker} />
        <LogoutButton />
      </View>
    </View>
  );
}

FileSelected.propTypes = {
  filepath: PropTypes.string.isRequired,
  openFilePicker: PropTypes.func.isRequired
};

class DropboxSettings extends React.Component {
  renderContent() {
    const { isLoggedIn, isFileSelected, filepath, openFilePicker } = this.props;
    if (isFileSelected) {
      return (
        <FileSelected filepath={filepath} openFilePicker={openFilePicker} />
      );
    }
    if (isLoggedIn) {
      return <LoggedIn openFilePicker={openFilePicker} />;
    }
    return <LoggedOut />;
  }

  render() {
    return (
      <View>
        <Title>Dropbox</Title>
        {this.renderContent()}
      </View>
    );
  }
}

DropboxSettings.defaultProps = {
  isLoggedIn: false,
  isFileSelected: false,
  filepath: null
};

DropboxSettings.propTypes = {
  // ownProps
  openFilePicker: PropTypes.func.isRequired,

  // redux props
  isLoggedIn: PropTypes.bool,
  isFileSelected: PropTypes.bool,
  filepath: PropTypes.string
};

const mapStateToProps = state => ({
  isLoggedIn: slice.selectors.isLoggedIn(state),
  isFileSelected: slice.selectors.isFileSelected(state),
  filepath: slice.selectors.getFilePath(state)
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DropboxSettings);
