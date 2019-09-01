import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { View, ScrollView } from "react-native";
import { Portal, Title } from "react-native-paper";
import { selectors, actions } from "redux-file-sync/lib/dropbox";
import DropboxFilePicker from "rn-dropbox-filepicker";
import Header from "./Header";
import router from "../router/slice";
import errors from "../errors/slice";
import CategorySettings from "../categories/components/Settings";

const { getAccessToken, getFilePath } = selectors;
const { login, logout, selectFile } = actions;

const APP_KEY = "ve8nbz4kchtj8xa";

function Settings({
  goToHome,
  accessToken,
  filepath,
  onLogin,
  onLogout,
  onFilePick,
  onError
}) {
  return (
    <Portal.Host>
      <View style={{ flex: 1 }}>
        <Header title="Settings" onGoBack={() => goToHome()} />
        <ScrollView style={{ flex: 1, margin: 8 }}>
          <Title>Dropbox</Title>
          <DropboxFilePicker
            appKey={APP_KEY}
            accessToken={accessToken}
            filepath={filepath}
            onLogin={onLogin}
            onLogout={onLogout}
            onFilePick={onFilePick}
            onError={onError}
          />
          <CategorySettings />
        </ScrollView>
      </View>
    </Portal.Host>
  );
}

const mapStateToProps = state => ({
  accessToken: getAccessToken(state),
  filepath: getFilePath(state)
});

const mapDispatchToProps = dispatch => ({
  goToHome: () => dispatch(router.actions.goToHome()),
  onLogin: accessToken => dispatch(login(accessToken)),
  onLogout: () => dispatch(logout()),
  onFilePick: filepath => dispatch(selectFile(filepath)),
  onError: err =>
    dispatch(
      errors.actions.push({ error: err, description: "connecting to Dropbox" })
    )
});

Settings.defaultProps = {
  accessToken: null,
  filepath: null
};

Settings.propTypes = {
  // redux props
  goToHome: PropTypes.func.isRequired,
  accessToken: PropTypes.string,
  filepath: PropTypes.string,
  onLogin: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  onFilePick: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);
