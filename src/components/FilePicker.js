import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { View, ScrollView, RefreshControl } from "react-native";
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
    const { onOpenNode, contents } = this.props;
    if (!contents) return null;
    if (!contents.length) {
      return (
        <Paragraph style={{ marginLeft: 5 }}>The directory is empty.</Paragraph>
      );
    }
    return contents.map(node => (
      <FilePickerItem
        key={node.path}
        node={node}
        onPress={() => onOpenNode(node)}
      />
    ));
  }

  render() {
    const { onRefresh, path } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Header title="Select Transactions File" subtitle={path} />
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={onRefresh} />
          }
        >
          {this.renderContents()}
        </ScrollView>
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
