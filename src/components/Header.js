import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Linking } from "react-native";
import { Appbar, IconButton, Menu, withTheme } from "react-native-paper";
import router from "../router/slice";
import syncThunk from "../syncThunk";

const { ROUTES } = router;

const PRIVACY_POLICY = {
  title: "Privacy Policy",
  onPress: () =>
    Linking.openURL(
      "https://github.com/alexishevia/izinput/blob/master/legal/privacy_policy.md"
    )
};

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuVisible: false
    };
  }

  openMenu() {
    this.setState({ menuVisible: true });
  }

  closeMenu() {
    this.setState({ menuVisible: false });
  }

  runAndCloseMenu(func) {
    this.setState({ menuVisible: false });
    func();
  }

  renderMenu() {
    const {
      theme,
      displaySettingsButton,
      displaySyncButton,
      goToSettings,
      sync
    } = this.props;
    const { menuVisible } = this.state;

    const allItems = [];
    if (displaySettingsButton) {
      allItems.push({ title: "Settings", onPress: goToSettings });
    }
    if (displaySyncButton) {
      allItems.push({ title: "Sync", onPress: sync });
    }
    allItems.push(PRIVACY_POLICY);
    if (!allItems.length) return null;

    return (
      <Menu
        visible={menuVisible}
        onDismiss={() => this.closeMenu()}
        anchor={
          <IconButton
            icon="dehaze"
            color={theme.colors.surface}
            onPress={() => this.openMenu()}
          />
        }
      >
        {allItems.map(({ onPress, title }) => (
          <Menu.Item
            key={title}
            title={title}
            onPress={() => this.runAndCloseMenu(onPress)}
          />
        ))}
      </Menu>
    );
  }

  renderBackButton() {
    const { onGoBack } = this.props;
    return onGoBack ? <Appbar.BackAction onPress={onGoBack} /> : null;
  }

  render() {
    const { title, subtitle } = this.props;
    return (
      <Appbar.Header>
        {this.renderBackButton()}
        <Appbar.Content title={title} subtitle={subtitle} />
        {this.renderMenu()}
      </Appbar.Header>
    );
  }
}

Header.defaultProps = {
  title: "IZ Input",
  subtitle: "",
  displaySettingsButton: false,
  displaySyncButton: false,
  goToSettings: () => {},
  onGoBack: null
};

Header.propTypes = {
  // ownProps
  title: PropTypes.string,
  subtitle: PropTypes.string,
  onGoBack: PropTypes.func,

  // redux props
  displaySettingsButton: PropTypes.bool,
  displaySyncButton: PropTypes.bool,
  goToSettings: PropTypes.func,
  sync: PropTypes.func.isRequired,

  // other
  theme: PropTypes.shape({
    colors: PropTypes.shape({
      primary: PropTypes.string.isRequired,
      surface: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

const mapStateToProps = state => ({
  displaySettingsButton:
    router.selectors.currentRoute(state) !== ROUTES.SETTINGS,
  displaySyncButton: router.selectors.currentRoute(state) === ROUTES.HOME
});

const mapDispatchToProps = dispatch => ({
  goToSettings: () => dispatch(router.actions.goToSettings()),
  sync: () => dispatch(syncThunk())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTheme(Header));
