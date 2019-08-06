import React from "react";
import PropTypes from "prop-types";
import { View, Text } from "react-native";
import { Portal, Dialog, Button, IconButton } from "react-native-paper";
import { connect } from "react-redux";
import {
  getSyncState,
  getErrorMessage,
  UNKNOWN,
  SYNCED,
  PENDING,
  RUNNING,
  FAILED
} from "../selectors";

const renderers = {
  [SYNCED]: {
    icon: "check",
    title: "Synced Successfully",
    text: "All changes have been synced."
  },
  [PENDING]: {
    icon: "info-outline",
    title: "Sync Pending",
    text: "Some local changes have not been synced yet."
  },
  [RUNNING]: {
    icon: "loop",
    title: "Sync Running",
    text: "Sync is currently running."
  },
  [FAILED]: {
    icon: "error-outline",
    title: "Sync Failed",
    text: "ERROR_MESSAGE"
  },
  [UNKNOWN]: {
    icon: "help-outline",
    title: "Unknown Sync Status",
    text: "Could not figure out sync status."
  }
};

class SyncState extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogVisible: false
    };
  }

  showDialog() {
    this.setState({ dialogVisible: true });
  }

  hideDialog() {
    this.setState({ dialogVisible: false });
  }

  renderDialog() {
    const { dialogVisible } = this.state;
    const { syncState, errorMessage } = this.props;
    const { title, text } = renderers[syncState] || renderers[UNKNOWN];
    return (
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => this.hideDialog()}>
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Content>
            <Text>{text === "ERROR_MESSAGE" ? errorMessage : text}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => this.hideDialog()}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  }

  render() {
    const { syncState } = this.props;
    const { icon } = renderers[syncState] || renderers[UNKNOWN];

    return (
      <View>
        {this.renderDialog()}
        <IconButton
          icon={icon}
          size={20}
          style={{ margin: 0, padding: 0 }}
          onPress={() => this.showDialog()}
        />
      </View>
    );
  }
}

SyncState.defaultProps = {
  errorMessage: ""
};

SyncState.propTypes = {
  syncState: PropTypes.string.isRequired,
  errorMessage: PropTypes.string
};

const mapStateToProps = state => ({
  syncState: getSyncState(state),
  errorMessage: getErrorMessage(state)
});
const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SyncState);
