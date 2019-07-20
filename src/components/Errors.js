import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button, Dialog, Paragraph } from "react-native-paper";
import errorsSlice from "../redux/errors";

function Errors({ errors, onErrorsDismiss }) {
  const visible = errors && errors.length;
  return (
    <Dialog visible={visible} onDismiss={onErrorsDismiss}>
      <Dialog.Title>Alert</Dialog.Title>
      <Dialog.Content>
        {errors.map(err => (
          <Paragraph key={err}>{err}</Paragraph>
        ))}
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={onErrorsDismiss}>Done</Button>
      </Dialog.Actions>
    </Dialog>
  );
}

Errors.propTypes = {
  errors: PropTypes.arrayOf(PropTypes.string).isRequired,
  onErrorsDismiss: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  errors: errorsSlice.selectors.all(state)
});

const mapDispatchToProps = dispatch => ({
  onErrorsDismiss: () => dispatch(errorsSlice.actions.reset())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Errors);
