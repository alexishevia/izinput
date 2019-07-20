import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { View, ScrollView, FlatList, RefreshControl } from "react-native";
import { Paragraph } from "react-native-paper";
import Header from "./Header";
import FilePickerItem from "./FilePickerItem";
import fileSystem from "../redux/fileSystem";
import loading from "../redux/loading";

class FilePicker extends React.Component {
  componentDidMount() {
    this.load();
  }

  componentDidUpdate() {
    this.load();
  }

  load() {
    const { isLoading, onRefresh, contents } = this.props;
    if (!contents && !isLoading) onRefresh();
  }

  renderContents() {
    const { contents, onRefresh, onOpenNode } = this.props;

    if (!contents) {
      return (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={onRefresh} />
          }
        />
      );
    }

    if (!contents.length) {
      return (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={onRefresh} />
          }
        >
          <Paragraph style={{ marginLeft: 5 }}>
            The directory is empty.
          </Paragraph>
        </ScrollView>
      );
    }

    return (
      <FlatList
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={onRefresh} />
        }
        data={contents}
        keyExtractor={item => item.path}
        renderItem={({ item }) => (
          <FilePickerItem node={item} onPress={() => onOpenNode(item)} />
        )}
      />
    );
  }

  render() {
    const { path } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Header title="Select Transactions File" subtitle={path} />
        {this.renderContents()}
      </View>
    );
  }
}

FilePicker.defaultProps = {
  isLoading: false,
  contents: null
};

FilePicker.propTypes = {
  path: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  contents: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      fileType: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired
    })
  ),
  onRefresh: PropTypes.func.isRequired,
  onOpenNode: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  isLoading: loading.selectors.isLoading(state),
  path: fileSystem.selectors.getPath(state),
  contents: fileSystem.selectors.getContents(state)
});

const mapDispatchToProps = dispatch => ({
  onRefresh: () => dispatch(fileSystem.actions.refresh()),
  onOpenNode: node => dispatch(fileSystem.actions.open(node))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilePicker);
