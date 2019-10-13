import React from "react";
import { View, StyleSheet, Picker } from "react-native";
import PropTypes from "prop-types";
import { TextInput, Button } from "react-native-paper";
import { connect } from "react-redux";
import { transactions as transactionsSlice } from "izreducer";
import syncThunk from "../../syncThunk";
import { sortedCategories } from "../../categories/selectors";
import { dateToDayStr } from "../../helpers/date";

const { TYPES: transactionTypes, CASH_FLOW } = transactionsSlice;

const styles = StyleSheet.create({
  container: {
    marginTop: 10
  },
  input: {
    margin: 5
  }
});

function today() {
  return dateToDayStr(new Date());
}

const initialState = () => ({
  amount: "",
  category: "",
  description: "",
  type: transactionTypes.CASH,
  cashFlow: CASH_FLOW.EXPENSE,
  transactionDate: today()
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
    const {
      amount,
      category,
      description,
      type,
      cashFlow,
      transactionDate
    } = this.state;
    const { categories, onAdd, sync } = this.props;
    const amountAsFloat = parseFloat(amount, 10);
    if (amountAsFloat === 0 || Number.isNaN(amountAsFloat)) {
      return;
    }
    onAdd({
      amount: amountAsFloat,
      category: category || categories[0],
      description,
      type: type || Object.values(transactionTypes)[0],
      cashFlow: cashFlow || Object.values(CASH_FLOW)[0],
      transactionDate
    });
    sync();
    this.setState(initialState());
  }

  render() {
    const { amount, category, description, type, cashFlow } = this.state;
    const { categories } = this.props;
    return (
      <View style={styles.container}>
        <View style={[{ flexDirection: "row", justifyContent: "center" }]}>
          <Button
            style={styles.input}
            mode={cashFlow === CASH_FLOW.EXPENSE ? "contained" : "outlined"}
            onPress={() => this.setState({ cashFlow: CASH_FLOW.EXPENSE })}
          >
            Expense
          </Button>
          <Button
            style={styles.input}
            mode={cashFlow === CASH_FLOW.INCOME ? "contained" : "outlined"}
            onPress={() => this.setState({ cashFlow: CASH_FLOW.INCOME })}
          >
            Income
          </Button>
        </View>

        <TextInput
          style={styles.input}
          mode="outlined"
          label="Amount"
          value={amount}
          onChangeText={val => this.setState({ amount: val })}
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
  categories: sortedCategories(state)
});

const mapDispatchToProps = dispatch => ({
  onAdd: tx => dispatch(transactionsSlice.actions.put(tx)),
  sync: () => dispatch(syncThunk())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewTransaction);
