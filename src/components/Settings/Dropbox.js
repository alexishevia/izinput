import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { View } from "react-native";
import { Title, Text, Button } from "react-native-paper";
import dropbox from "../../redux/dropbox";
import LoginButton from "../Dropbox/LoginButton";

function FilePickButton() {
  return (
    <Button mode="contained" style={{ marginRight: 20 }} onPress={() => {}}>
      Select File
    </Button>
  );
}

function LogoutButton() {
  return <Button onPress={() => {}}>Disconnect</Button>;
}

function LoggedOut() {
  return (
    <View style={{ flex: 1 }}>
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

function LoggedIn() {
  return (
    <View>
      <Text>
        You are connected to Dropbox, but you still need to select a file to use
        for sync.
      </Text>
      <View
        style={{ flexDirection: "row", justifyContent: "center", padding: 10 }}
      >
        <FilePickButton />
        <LogoutButton />
      </View>
    </View>
  );
}

function FileSelected() {
  return (
    <View>
      <Text>You are logged into Dropbox and syncing to file: ???.</Text>
    </View>
  );
}

function DropboxSettings({ isLoggedIn, isFileSelected }) {
  let content;
  if (isFileSelected) {
    content = <FileSelected />;
  } else if (isLoggedIn) {
    content = <LoggedIn />;
  } else {
    content = <LoggedOut />;
  }

  return (
    <View style={{ flex: 1, margin: 5 }}>
      <Title>Dropbox</Title>
      {content}
    </View>
  );
}

DropboxSettings.defaultProps = {
  isLoggedIn: false,
  isFileSelected: false
};

DropboxSettings.propTypes = {
  isLoggedIn: PropTypes.bool,
  isFileSelected: PropTypes.bool
};

const mapStateToProps = state => ({
  isLoggedIn: dropbox.selectors.isLoggedIn(state),
  isFileSelected: dropbox.selectors.isFileSelected(state)
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DropboxSettings);
