import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { ActivityIndicator } from "react-native-paper";
import loading from "../redux/loading";

const Loading = ({ isLoading }) => {
  if (!isLoading) return null;
  return <ActivityIndicator animating style={{ marginTop: 110 }} />;
};

Loading.propTypes = {
  isLoading: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  isLoading: loading.selectors.isLoading(state)
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Loading);
