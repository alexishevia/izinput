import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { View, StyleSheet } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { categories as categoriesSlice } from "izreducer";

const styles = StyleSheet.create({
  button: {
    marginLeft: 10
  }
});

class AddCategory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ""
    };
  }

  addCategory() {
    const { text } = this.state;
    const { addCategory } = this.props;
    if (!text) return;
    addCategory(text);
    this.setState({ text: "" });
  }

  render() {
    const { text } = this.state;
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TextInput
          style={{ flex: 1 }}
          mode="outlined"
          label="New Category"
          value={text}
          onChangeText={val => this.setState({ text: val })}
        />
        <Button
          style={styles.button}
          icon="add"
          mode="contained"
          onPress={() => this.addCategory()}
        >
          Add
        </Button>
      </View>
    );
  }
}

AddCategory.propTypes = {
  // redux props
  addCategory: PropTypes.func.isRequired
};

const mapStateToProps = () => ({});
const mapDispatchToProps = dispatch => ({
  addCategory: name => dispatch(categoriesSlice.actions.new(name))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddCategory);
