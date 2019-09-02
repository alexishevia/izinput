import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { View } from "react-native";
import { Title } from "react-native-paper";
import { categories as categoriesSlice } from "izreducer";
import EditCategory from "./EditCategory";
import AddCategory from "./AddCategory";

function CategorySettings({ categories }) {
  return (
    <View>
      <Title>Categories</Title>
      {categories.map(cat => (
        <EditCategory key={cat} category={cat} />
      ))}
      <AddCategory />
    </View>
  );
}

CategorySettings.propTypes = {
  // redux props
  categories: PropTypes.arrayOf(PropTypes.string).isRequired
};

const mapStateToProps = state => ({
  categories: categoriesSlice.selectors.all(state)
});
const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CategorySettings);
