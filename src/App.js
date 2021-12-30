import './App.css';
import axios from "axios";
import React from 'react';

const dict = {
  getInfo: (word) => {
    return new Promise((resolve, reject) => {
      axios
        .get("https://api.dictionaryapi.dev/api/v2/entries/en/" + word)
        .then((response) => {
          resolve({valid: true, response: response});
        })
        .catch((error) => {
          resolve({valid: false, error: error});
        });
    });
  }
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      word: "",
      data: null,
      message: ""
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleClick(event) {
    this.setState({message: "Loading..."}, () => {
        dict.getInfo(this.state.word).then((response) => {
          if (response.valid) {
            // console.log(response.response)
            if (response.response.data[0].meanings.length == 0) {
              this.setState({ data: response.response.data[0].meanings, message: "No Results"});
            } else {
              this.setState({ data: response.response.data[0].meanings, message: "Showing " + response.response.data[0].meanings.length + " Results"});
            }
          } else {
            this.setState({ data: null, message: "No Results"});
          }
        })
      }
    )

  }

  handleChange(event) {
    this.setState({word: event.target.value});
  }

  render() {
    return (
      <div className="App" style={{ textAlign: "center", overflowX: "hidden" }}>
        <h1>Dictionary</h1>
        <div className="input-group "style={{marginLeft: "5px", marginRight: "5px"}} >
        <div className="form-outline" style={{ width: "calc(100% - 50px)"}}>
          <input type="search" id="form1" className="form-control" placeholder="Search" onChange={this.handleChange}  />
          {/* <label class="form-label" for="form1">Search</label> */}
        </div>
        <button type="button" class="btn btn-primary" onClick={this.handleClick}>
          <i className="fas fa-search"></i>
        </button>
      </div>
        {/* <label style={{ marginRight: "5px"}} >Word</label>
        <input
          type="text"
          value={this.state.word}
          style={{ width: "80%" }}
          onChange={this.handleChange}
        />
        <button type="button" onClick={this.handleClick} style={{ marginLeft: "5px", padding: "0", border: "none", background: "none", cursor: "pointer"}}>
        <i className="fas fa-search" ></i>
        </button> */}
        
        {/* <button type="button" onClick={this.handleClick} style={{ marginLeft: "5px"}}>
          Search
        </button> */}
        {/* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header> */}
        
        <div style={{marginTop: "5px", marginBottom: "5px", marginLeft: "5px", marginRight: "5px"}}>
          {this.state.data != null ?
            <div>
              <p>{this.state.message}</p>
              {
              this.state.data.map((item, index) => (
                  
                <Meaning key={index} index={index} data={item} />
              ))
              }
            </div> :
            <p>{this.state.message}</p>
          }
            
          
        </div>
      </div>
    );
  }
}

class Meaning extends React.Component {
  constructor(props) {
    super(props);
    var color = "white";
    var textColor = "black"
    if (props.index % 2 == 1) {
      color = "#0d6efd";
      textColor = "white"
    }
    this.state = {
      data: this.props.data,
      color: color,
      textColor: textColor
    };
    // console.log(color)
  }

  render() {
    return (
      <div style={{border: '1px solid black', marginTop: "5px", background: this.state.color, color: this.state.textColor}}>
        <h5>{this.props.index + 1 + " " + this.state.data.partOfSpeech}</h5>

        {
          this.state.data.definitions.map((item, index) => (
            <div style={{border: '1px solid black', marginLeft: "5px", marginRight: "5px", marginBottom: "5px"}}>
            <p>{(this.props.index + 1) + "." + (index + 1) + " Definition"}</p>
            <p>{item.definition}</p>
            </div>
          ))
        }

      </div>
    );
  }
}
export default App;
