import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button } from "react-native-paper";
import dropbox from "../redux";

function LogoutButton({ onPress }) {
  return <Button onPress={onPress}>Disconnect</Button>;
}

LogoutButton.propTypes = {
  // redux props
  onPress: PropTypes.func.isRequired
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  onPress: () => dispatch(dropbox.actions.logout())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LogoutButton);
