import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Alert } from "react-native";
import { Appbar, IconButton, Menu, withTheme } from "react-native-paper";
import fileSystem from "../redux/fileSystem";

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

  logout() {
    const { onLogout } = this.props;
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Log Out", onPress: onLogout },
        { text: "Cancel", onPress: () => false, style: "cancel" }
      ],
      { cancelable: true }
    );
  }

  renderMenu() {
    const { theme, includeLogoutButton, onLogout } = this.props;
    const { menuVisible } = this.state;

    const allItems = [];
    if (includeLogoutButton && onLogout) {
      allItems.push({ title: "Log Out", onPress: () => this.logout() });
    }

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
    const { includeBackButton, onGoBack } = this.props;
    return includeBackButton && onGoBack ? (
      <Appbar.BackAction onPress={() => onGoBack()} />
    ) : null;
  }

  render() {
    const { subtitle } = this.props;
    return (
      <Appbar.Header>
        {this.renderBackButton()}
        <Appbar.Content title="MDo" subtitle={subtitle} />
        {this.renderMenu()}
      </Appbar.Header>
    );
  }
}

Header.defaultProps = {
  subtitle: "",
  includeBackButton: false,
  onGoBack: null,
  includeLogoutButton: false,
  onLogout: null
};

Header.propTypes = {
  // ownProps
  subtitle: PropTypes.string,

  // redux props
  includeBackButton: PropTypes.bool,
  onGoBack: PropTypes.func,
  includeLogoutButton: PropTypes.bool,
  onLogout: PropTypes.func,

  // other
  theme: PropTypes.shape({
    colors: PropTypes.shape({
      primary: PropTypes.string.isRequired,
      surface: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

const fs = {
  ...fileSystem.selectors,
  ...fileSystem.actions
};

const mapStateToProps = state => ({
  includeBackButton: fs.isMounted(state) && !fs.isRoot(state),
  includeLogoutButton: fs.isMounted(state)
});

const mapDispatchToProps = dispatch => ({
  onGoBack: () => dispatch(fs.goBack()),
  onLogout: () => dispatch(fs.reset())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTheme(Header));
