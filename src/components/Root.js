import React from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import { Portal } from "react-native-paper";
import { connect } from "react-redux";
import router from "../redux/router";
import errors from "../redux/errors";
import Errors from "./Errors";
import Home from "./Home";
import Settings from "./Settings";
import DropboxFilePicker from "../Dropbox/components/FilePicker";

const { ROUTES } = router;

class Root extends React.Component {
  renderScreen() {
    const { route, goToSettings, onError } = this.props;
    const screen = {
      [ROUTES.HOME]: () => <Home />,
      [ROUTES.SETTINGS]: () => <Settings />,
      [ROUTES.DROPBOX_FILE_PICKER]: () => (
        <DropboxFilePicker
          onSuccess={goToSettings}
          onCancel={goToSettings}
          onError={onError}
        />
      )
    }[route];
    return screen();
  }

  render() {
    return (
      <View style={{ backgroundColor: "white", flex: 1 }}>
        <Portal>
          <Errors />
        </Portal>
        {this.renderScreen()}
      </View>
    );
  }
}

Root.defaultProps = {
  route: ROUTES.HOME
};

Root.propTypes = {
  // redux props
  route: PropTypes.string,
  goToSettings: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  route: router.selectors.currentRoute(state)
});

const mapDispatchToProps = dispatch => ({
  goToSettings: () => dispatch(router.actions.goToSettings()),
  onError: err => dispatch(errors.actions.push(err))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Root);
