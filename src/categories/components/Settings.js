import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { View } from "react-native";
import { Title, TextInput, Button, List } from "react-native-paper";
import categoriesSlice from "../slice";

class CategorySettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newCategory: ""
    };
  }

  addCategory() {
    const { newCategory } = this.state;
    const { addCategory } = this.props;
    if (!newCategory) return;
    addCategory(newCategory);
    this.setState({ newCategory: "" });
  }

  render() {
    const { categories } = this.props;
    const { newCategory } = this.state;
    return (
      <View>
        <Title>Categories</Title>
        {categories.map(cat => (
          <List.Item key={cat} title={cat} style={{ paddingLeft: 0 }} />
        ))}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TextInput
            style={{ flex: 1 }}
            mode="outlined"
            label="New Category"
            value={newCategory}
            onChangeText={val => this.setState({ newCategory: val })}
          />
          <Button
            style={{ marginLeft: 10 }}
            icon="add"
            mode="contained"
            onPress={() => this.addCategory()}
          >
            Add
          </Button>
        </View>
      </View>
    );
  }
}

CategorySettings.propTypes = {
  // redux props
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  addCategory: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  categories: categoriesSlice.selectors.all(state)
});
const mapDispatchToProps = dispatch => ({
  addCategory: name => dispatch(categoriesSlice.actions.new(name))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CategorySettings);
