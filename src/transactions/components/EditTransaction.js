import React from "react";
import { View, StyleSheet, Picker, Alert } from "react-native";
import PropTypes from "prop-types";
import { TextInput, Button } from "react-native-paper";
import { connect } from "react-redux";
import transactionsSlice, { TYPES as transactionTypes } from "../slice";
import categoriesSlice from "../../categories/slice";

const styles = StyleSheet.create({
  container: {
    marginTop: 10
  },
  input: {
    margin: 5
  }
});

class EditTransaction extends React.Component {
  constructor(props) {
    super(props);
    const {
      transaction: { id, charge, category, description, type }
    } = props;
    this.state = {
      id,
      charge: `${charge}`,
      category: category || "",
      description: description || "",
      type
    };
  }

  save() {
    const { id, charge, category, description, type } = this.state;
    const { categories, onEdit, onDone } = this.props;
    const chargeAmount = parseFloat(charge, 10);
    if (chargeAmount === 0 || Number.isNaN(chargeAmount)) {
      return;
    }
    onEdit({
      id,
      charge: chargeAmount,
      category: category || categories[0],
      description,
      type
    });
    onDone();
  }

  delete() {
    const { id } = this.state;
    const { onDelete, onDone } = this.props;
    Alert.alert(
      "Delete Transaction",
      `Are you sure you want to delete the transaction?`,
      [
        { text: "Cancel", onPress: () => false, style: "cancel" },
        {
          text: "Delete",
          onPress: () => {
            onDelete(id);
            onDone();
          }
        }
      ]
    );
  }

  render() {
    const { charge, category, description, type } = this.state;
    const { categories, onDone } = this.props;
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Monto"
          value={charge}
          onChangeText={val => this.setState({ charge: val })}
        />
        <TextInput
          style={styles.input}
          label="Categoría"
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
          label="Descripción"
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
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Button
            style={styles.input}
            icon="edit"
            mode="contained"
            onPress={() => this.save()}
          >
            Edit
          </Button>
          <Button
            style={styles.input}
            color="#F8003C"
            icon="delete"
            mode="contained"
            onPress={() => this.delete()}
          >
            Delete
          </Button>
          <Button
            style={styles.input}
            color="#808080"
            dark
            icon="cancel"
            mode="contained"
            onPress={onDone}
          >
            Cancel
          </Button>
        </View>
      </View>
    );
  }
}

EditTransaction.propTypes = {
  // own props
  transaction: PropTypes.shape({
    id: PropTypes.string.isRequired,
    charge: PropTypes.number.isRequired,
    category: PropTypes.string,
    description: PropTypes.string,
    type: PropTypes.string.isRequired
  }).isRequired,
  onDone: PropTypes.func.isRequired,

  // redux props
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired
};

const mapStateToProps = state => ({
  categories: categoriesSlice.selectors.all(state)
});

const mapDispatchToProps = dispatch => ({
  onEdit: tx => dispatch(transactionsSlice.actions.put(tx)),
  onDelete: id => dispatch(transactionsSlice.actions.delete(id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditTransaction);
