import React from "react";
import { View, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import { TextInput, Button } from "react-native-paper";
import { connect } from "react-redux";
import slice from "../slice";
import syncThunk from "../../sync/thunk";

const styles = StyleSheet.create({
  container: {
    marginTop: 10
  },
  input: {
    margin: 5
  }
});

const initialState = () => ({
  charge: "",
  description: ""
});

class NewTransaction extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState();
  }

  componentDidMount() {
    const { sync: runSync } = this.props;
    runSync();
  }

  save() {
    const { charge, description } = this.state;
    const { onAdd, sync } = this.props;
    const chargeAmount = parseFloat(charge, 10);
    if (chargeAmount === 0 || Number.isNaN(chargeAmount)) {
      return;
    }
    if (description === "") {
      return;
    }
    onAdd({ charge: chargeAmount, description });
    sync();
    this.setState(initialState());
  }

  render() {
    const { charge, description } = this.state;
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          label="Monto"
          value={charge}
          onChangeText={val => this.setState({ charge: val })}
        />
        <TextInput
          style={styles.input}
          label="Descripción"
          value={description}
          onChangeText={val => this.setState({ description: val })}
        />
        <Button
          style={styles.input}
          icon="attach-money"
          mode="contained"
          onPress={() => this.save()}
        >
          Agregar
        </Button>
      </View>
    );
  }
}

NewTransaction.propTypes = {
  onAdd: PropTypes.func.isRequired,
  sync: PropTypes.func.isRequired
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  onAdd: ({ charge, description }) => {
    dispatch(slice.actions.put({ charge, description }));
  },
  sync: () => dispatch(syncThunk())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewTransaction);
