class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      phone: '',
      address: '',
      dob: '',
      age: 0,
      height: '',
      education: '',
	  degree: '',
      userId: 0
    };
    this.message = {
      text: '',
      class: '',
      enabled: false
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderSaveBtn = this.renderSaveBtn.bind(this);
    this.renderSubmitBtn = this.renderSubmitBtn.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.renderMessage = this.renderMessage.bind(this);
	this.renderDegree = this.renderDegree.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  submitForm() {
    const that = this;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    };
    fetch('https://reqres.in/api/users', requestOptions).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Network Error');
      }
    }).then(data => this.setState({
      postId: data.userId,
      completed: true
    })).then(that.sendMessage('SUCCESS: Form saved successfully', 'green'
    )).catch((error) => {
      that.sendMessage('FAILED: '+error, 'red')
    });
  }

  editForm(id, field, data){
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id, field, data})
    };
    fetch('https://reqres.in/api/users', requestOptions).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Network Error');
      }
    }).then(data => this.setState({
      postId: data.userId // add into state
    })).then(that.sendMessage('SUCCESS: Form saved successfully', 'green'
    )).catch((error) => {
      that.sendMessage('FAILED: '+error, 'red')
    });;
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });

    if(name == 'dob'){
      let age = this.getAge(value);
      this.setState({age: age})
    }
  }

  handleSubmit(event) {
    if(!!this.state.firstName &&
       !!this.state.lastName &&
       !!this.state.phone &&
       !!this.state.address &&
       !!this.state.dob){
        this.submitForm();
    }
    event.preventDefault();
  }

  handleSave(event){
    event.preventDefault();
    let name = event.target.value; // Grab text input name
    let data = this.state[name]; // Use input name to get input value
    this.editForm(this.state.postId, name, data);
  }

  renderDegree(){ // Render degree select if needed
    if(this.state.education == 'Degree Obtained'){
      return React.createElement("label", null, "Degree Obtained", 
      this.renderSaveBtn('degree'),
      React.createElement("select", {
        name: "degree",
        value: this.state.degree,
        onChange: this.handleInputChange
      }, 
      React.createElement("option", {
        value: "Associates"
      }, "Associates"), React.createElement("option", {
        value: "Bachelors"
      }, "Bachelors"), React.createElement("option", {
        value: "Masters"
      }, "Master"), React.createElement("option", {
        value: "Phd"
      }, "Phd")));
    }
  }

  getAge(dateString) { // Borrowed function from stackoverflow
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
  }

  renderSaveBtn(name){ // Render save button on fields if completed
    if(!!this.state.completed){
      return React.createElement("button", {
        onClick: this.handleSave,
        value: name, // Store associated input name as the value to this save button, to use in this.handleSave
      }, 'Save');
    }
  }

  renderSubmitBtn(){ // Render on/off save button after submission
    if(!this.state.completed){
      return React.createElement("input", {
        type: "submit",
        value: "Submit"
      });
    } 
  }

  sendMessage(text, className){
    this.message.enabled = true;
    this.message.text = text;
    this.message.class = className;
    //this.forceUpdate();
  }

  renderMessage(){
    if(this.message.enabled){
      return React.createElement("div", {
        className: this.message.class
      }, this.message.text);
    }
  }

  render() {
    return React.createElement("form", {
      onSubmit: this.handleSubmit
    },  React.createElement("label", {className: "required"}, "First Name", 
          this.renderSaveBtn('firstName'),
          React.createElement("input", {
            name: "firstName",
            type: "text",
            value: this.state.firstName,
            required: 'required',
            onChange: this.handleInputChange
    })), React.createElement("label", {className: "required"}, "Last Name", 
          this.renderSaveBtn('lastName'),
          React.createElement("input", {
            name: "lastName",
            type: "text",
            value: this.state.lastName,
            required: 'required',
            onChange: this.handleInputChange
    })), React.createElement("label", {className: "required"}, "Phone (xxx-xxx-xxxx)", 
          this.renderSaveBtn('phone'),
          React.createElement("input", {
            name: "phone",
            type: "tel",
            value: this.state.phone,
            required: 'required',
            pattern: "[0-9]{3}-[0-9]{3}-[0-9]{4}",
            title: 'Type in XXX-XXX-XXXX Format',
            onChange: this.handleInputChange
    })), React.createElement("label", {className: "required"}, "Address", 
          this.renderSaveBtn('address'),
          React.createElement("input", {
            name: "address",
            type: "text",
            value: this.state.address,
            required: 'required',
            onChange: this.handleInputChange
    })), React.createElement("label", {className: "required"}, "Date of Birth", 
          this.renderSaveBtn('dob'),
          React.createElement("input", {
            name: "dob",
            type: "date",
            value: this.state.dob,
            required: 'required',
            onChange: this.handleInputChange
    })), React.createElement("label", null, "Age", 
          this.renderSaveBtn('age'),
          React.createElement("input", {
            name: "age",
            type: "number",
            value: this.state.age,
            onChange: this.handleInputChange
    })), React.createElement("label", null, "Height", 
          this.renderSaveBtn('height'),
          React.createElement("input", {
            name: "height",
            type: "text",
            value: this.state.height,
            onChange: this.handleInputChange
    })), React.createElement("label", null, "Highest Level of Education",
          this.renderSaveBtn('education'),
          React.createElement("select", {
            name: "education",
            value: this.state.education,
            onChange: this.handleInputChange
    },   React.createElement("option", {
            value: "Middle School"
          }, "Middle School"), 
          React.createElement("option", {
            value: "High School"
          }, "High School"),
          React.createElement("option", {
            value: "Diploma Obtained"
          }, "Diploma Obtained"), 
          React.createElement("option", {
            value: "Degree Obtained"
          }, "Degree Obtained")
    )),  this.renderDegree(),
         this.renderSubmitBtn(),
         this.renderMessage()
    );
  }

}

ReactDOM.render(React.createElement(NameForm, null), document.getElementById('app-container'));