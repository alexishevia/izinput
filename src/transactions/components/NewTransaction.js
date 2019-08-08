import React from "react";
import { View, StyleSheet, Picker } from "react-native";
import PropTypes from "prop-types";
import { TextInput, Button } from "react-native-paper";
import { connect } from "react-redux";
import transactionsSlice from "../slice";
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
    const { charge, category, description } = this.state;
    const { categories, onAdd, sync } = this.props;
    const chargeAmount = parseFloat(charge, 10);
    if (chargeAmount === 0 || Number.isNaN(chargeAmount)) {
      return;
    }
    onAdd({
      charge: chargeAmount,
      category: category || categories[0],
      description
    });
    sync();
    this.setState(initialState());
  }

  render() {
    const { charge, category, description } = this.state;
    const { categories } = this.props;
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
  // redux props
  onAdd: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  sync: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  categories: categoriesSlice.selectors.all(state)
});

const mapDispatchToProps = dispatch => ({
  onAdd: ({ charge, category, description }) => {
    dispatch(transactionsSlice.actions.put({ charge, category, description }));
  },
  sync: () => dispatch(syncThunk())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewTransaction);
