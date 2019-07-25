import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Linking } from "react-native";
import { Appbar, IconButton, Menu, withTheme } from "react-native-paper";

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
    const { theme } = this.props;
    const { menuVisible } = this.state;

    const allItems = [];
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

  render() {
    const { title, subtitle } = this.props;
    return (
      <Appbar.Header>
        <Appbar.Content title={title} subtitle={subtitle} />
        {this.renderMenu()}
      </Appbar.Header>
    );
  }
}

Header.defaultProps = {
  title: "IZ Input",
  subtitle: ""
};

Header.propTypes = {
  // ownProps
  title: PropTypes.string,
  subtitle: PropTypes.string,

  // other
  theme: PropTypes.shape({
    colors: PropTypes.shape({
      primary: PropTypes.string.isRequired,
      surface: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTheme(Header));
