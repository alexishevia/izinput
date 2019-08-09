import React from "react";
import { View, StyleSheet, Picker } from "react-native";
import PropTypes from "prop-types";
import { TextInput, Button } from "react-native-paper";
import { connect } from "react-redux";
import transactionsSlice, { TYPES as transactionTypes } from "../slice";
import categoriesSlice from "../../categories/slice";
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
  category: "",
  description: "",
  type: transactionTypes.CASH
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
    const { charge, category, description, type } = this.state;
    const { categories, onAdd, sync } = this.props;
    const chargeAmount = parseFloat(charge, 10);
    if (chargeAmount === 0 || Number.isNaN(chargeAmount)) {
      return;
    }
    onAdd({
      charge: chargeAmount,
      category: category || categories[0],
      description,
      type: type || Object.values(transactionTypes)[0]
    });
    sync();
    this.setState(initialState());
  }

  render() {
    const { charge, category, description, type } = this.state;
    const { categories } = this.props;
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Amount"
          value={charge}
          onChangeText={val => this.setState({ charge: val })}
        />
        <TextInput
          style={styles.input}
          label="Category"
          mode="outlined"
          value=" "
          render={() => (
            <Picker
              selectedValue={category}
              onValueChange={newVal => this.setState({ category: newVal })}
              style={{ height: 54, marginTop: 10 }}
            >
              {categories.map(cat => (
                <Picker.Item key={cat} label={cat} value={cat} />
              ))}
            </Picker>
          )}
        />
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Description"
          value={description}
          onChangeText={val => this.setState({ description: val })}
        />
        <View
          style={[
            styles.input,
            { flexDirection: "row", justifyContent: "center" }
          ]}
        >
          <Button
            icon="local-atm"
            style={styles.input}
            mode={type === transactionTypes.CASH ? "contained" : "outlined"}
            onPress={() => this.setState({ type: transactionTypes.CASH })}
          >
            Cash
          </Button>
          <Button
            icon="credit-card"
            style={styles.input}
            mode={type === transactionTypes.CREDIT ? "contained" : "outlined"}
            onPress={() => this.setState({ type: transactionTypes.CREDIT })}
          >
            Credit
          </Button>
          <Button
            icon="account-balance"
            style={styles.input}
            mode={type === transactionTypes.TRANSFER ? "contained" : "outlined"}
            onPress={() => this.setState({ type: transactionTypes.TRANSFER })}
          >
            Transfer
          </Button>
        </View>
        <Button
          style={styles.input}
          icon="attach-money"
          mode="contained"
          onPress={() => this.save()}
        >
          Add
        </Button>
      </View>
    );
  }
}

NewTransaction.propTypes = {
  // redux props
  onAdd: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  sync: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  categories: categoriesSlice.selectors.all(state)
});

const mapDispatchToProps = dispatch => ({
  onAdd: tx => dispatch(transactionsSlice.actions.put(tx)),
  sync: () => dispatch(syncThunk())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewTransaction);
