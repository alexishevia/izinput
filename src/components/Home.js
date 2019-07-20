import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { View, Text } from "react-native";
import Header from "./Header";
import fileSystem from "../redux/fileSystem";

function Home({ path }) {
  return (
    <View style={{ flex: 1 }}>
      <Header subtitle={path} />
      <Text>Home</Text>
    </View>
  );
}

Home.propTypes = {
  path: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  path: fileSystem.selectors.getPath(state)
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
