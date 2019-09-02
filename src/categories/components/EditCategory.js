import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { categories as categoriesSlice } from "izreducer";

const styles = StyleSheet.create({
  button: {
    marginLeft: 10
  }
});

class EditCategory extends React.Component {
  constructor(props) {
    super(props);
    const { category } = props;
    this.state = {
      initialText: category,
      text: category
    };
  }

  rename() {
    const { initialText, text } = this.state;
    const { renameCategory } = this.props;
    if (!text || initialText === text) return;
    renameCategory({ from: initialText, to: text });
    this.setState({ initialText: text });
  }

  delete() {
    const { initialText } = this.state;
    const { deleteCategory } = this.props;
    Alert.alert(
      "Delete Category",
      `Are you sure you want to delete category: ${initialText}?`,
      [
        { text: "Cancel", onPress: () => false, style: "cancel" },
        { text: "Delete", onPress: () => deleteCategory(initialText) }
      ]
    );
  }

  render() {
    const { initialText, text } = this.state;
    const hasChanges = initialText !== text;
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TextInput
          style={{ flex: 1 }}
          mode="outlined"
          value={text}
          onChangeText={val => this.setState({ text: val })}
        />
        <Button
          style={styles.button}
          color={hasChanges ? null : "gray"}
          icon="edit"
          mode="contained"
          onPress={() => (hasChanges ? this.rename() : false)}
        >
          Rename
        </Button>
        <Button
          style={styles.button}
          color="#F8003C"
          icon="delete"
          mode="contained"
          onPress={() => this.delete()}
        >
          Delete
        </Button>
      </View>
    );
  }
}

EditCategory.propTypes = {
  // own props
  category: PropTypes.string.isRequired,

  // redux props
  renameCategory: PropTypes.func.isRequired,
  deleteCategory: PropTypes.func.isRequired
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  renameCategory: ({ from, to }) =>
    dispatch(categoriesSlice.actions.rename({ from, to })),
  deleteCategory: name => dispatch(categoriesSlice.actions.delete(name))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditCategory);
