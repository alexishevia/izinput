import React from "react";
import PropTypes from "prop-types";
import { Button } from "react-native-paper";
import { connect } from "react-redux";
import login from "../api/login";
import slice from "../slice";
import errors from "../../errors/slice";

const loginToDropbox = () => async dispatch => {
  try {
    const accessToken = await login();
    dispatch(slice.actions.login(accessToken));
  } catch (err) {
    dispatch(
      errors.actions.push({ error: err, description: "connecting to Dropbox" })
    );
  }
};

function DropboxLoginButton({ onPress }) {
  return (
    <Button mode="contained" onPress={onPress}>
      Connect to Dropbox
    </Button>
  );
}

DropboxLoginButton.propTypes = {
  // redux props
  onPress: PropTypes.func.isRequired
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  onPress: () => dispatch(loginToDropbox())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DropboxLoginButton);
