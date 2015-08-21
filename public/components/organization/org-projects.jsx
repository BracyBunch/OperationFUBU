var React = require('react');
var Link = require('react-router').Link
var Navigation = require('react-router').Navigation;
var Thumbnail = require('../thumbnail/thumbnail')

module.exports = React.createClass({
  mixins: [Navigation],

  getInitialState: function() {
    return {
      projectID: null,
      ThumbnailData: [],
    };
  },

  componentWillMount: function(){
    this.setState({
      projects: this.props.projects
    })
    console.log('what', this.state.projects)
  },

  goToProject: function(projectID){
    this.transitionTo('/project/' + projectID);
    {this.renderThumbnail()}
  },

  renderThumbnail: function(){
    return this.props.projects.map(function(thumbnailProps){
      return <Thumbnail {...thumbnailProps} />
    });
  },

  nothing: function(){
    var header = '';
    var imageURL = '';
    var description = '';
    var tags = '';
  },

  render: function() {
    return (
    <div>
    {this.props.projects.map(function(thumbnailProps){
      console.log('tb',thumbnailProps)
      return <Thumbnail
       header={thumbnailProps.name} 
       imageURL={'https://upload.wikimedia.org/wikipedia/en/thumb/5/5f/HSUS_logo.svg/1280px-HSUS_logo.svg.png'} 
       description={thumbnailProps.description} 
       tags={['angular', 'node']} /> })
    }
    </div> )
  }
});
