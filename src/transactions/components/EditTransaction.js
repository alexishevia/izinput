import React from "react";
import { View, StyleSheet, Picker } from "react-native";
import PropTypes from "prop-types";
import { TextInput, Button } from "react-native-paper";
import { connect } from "react-redux";
import transactionsSlice from "../slice";
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
      transaction: { id, charge, category, description }
    } = this.props;
    this.state = {
      id,
      charge: `${charge}`,
      category: category || "",
      description: description || ""
    };
  }

  save() {
    const { id, charge, category, description } = this.state;
    const { categories, onEdit, onDone } = this.props;
    const chargeAmount = parseFloat(charge, 10);
    if (chargeAmount === 0 || Number.isNaN(chargeAmount)) {
      return;
    }
    onEdit({
      id,
      charge: chargeAmount,
      category: category || categories[0],
      description
    });
    onDone();
  }

  delete() {
    const { id } = this.state;
    const { onDelete, onDone } = this.props;
    onDelete(id);
    onDone();
  }

  render() {
    const { charge, category, description } = this.state;
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
        <View style={{ flexDirection: "row" }}>
          <Button
            style={styles.input}
            icon="edit"
            mode="contained"
            onPress={() => this.save()}
          >
            Editar
          </Button>
          <Button
            style={styles.input}
            color="#F8003C"
            icon="delete"
            mode="contained"
            onPress={() => this.delete()}
          >
            Borrar
          </Button>
          <Button
            style={styles.input}
            color="#808080"
            dark
            icon="cancel"
            mode="contained"
            onPress={onDone}
          >
            Cancelar
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
    description: PropTypes.string
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
  onEdit: ({ id, charge, category, description }) => {
    dispatch(
      transactionsSlice.actions.put({ id, charge, category, description })
    );
  },
  onDelete: id => dispatch(transactionsSlice.actions.delete(id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditTransaction);
