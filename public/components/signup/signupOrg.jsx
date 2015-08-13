var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var Methods = require('./sharedSignupMethods');

module.exports = React.createClass({
	render: function() {
		return (
			<form onSubmit={this.props.submitForm}>
	      <div className="form-group techstrengths">
			    <label htmlFor="orgname">Organization Name</label> 
		      <input type="text" id="orgname" placeholder="Humane Society (San Jose), Project Homeless Connect, etc." className="form-control" />
		    </div>
				<div className="form-group techstrengths" id="addlLinks">
			    <label htmlFor="links">Additional Links (optional)</label>
		      <input type="text" id="links" placeholder="LinkedIn, Website, etc." className="form-control" />
		    </div>
		    <div className="signupCentered">
			    <button className="btn signupBtn" onClick={Methods.addFields.bind(this, this.divId, this.newLinkHTML)}>Add +</button> <br />
			    <div className="form-group">
				    <input type="checkbox" value="termsAgreed" onChange={this.props.terms} className="checkbox-inline"> I agree to the terms</input>
				  </div>
			    	<button type="submit" className="btn signupBtn text-center">Sign Up</button>
				  <Link to={Methods.authenticate()}>
			    </Link>
			  </div>
			</form> 
		)
	},
	divId: 'addlLinks',
	newLinkHTML: '<input type="text" value="" id="links" placeholder="LinkedIn, Website, etc." class="form-control form-margin" />',
	addlFieldCount: 2,
	addlFieldLimit: 4
})
