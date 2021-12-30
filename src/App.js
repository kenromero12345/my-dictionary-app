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
      message: "",
      filterComp: null,
      filterWord: "",
      flagFilter: false,
      currentFilterWord: ""

    };
    this.handleClickSearch = this.handleClickSearch.bind(this);
    this.handleChangeSearch = this.handleChangeSearch.bind(this);
    this.handleChangeFilter = this.handleChangeFilter.bind(this);
    this.handleClickFilter = this.handleClickFilter.bind(this);
  }

  handleChangeFilter(event) {
    this.setState({filterWord: event.target.value,});
    
  }

  handleClickFilter(event) {
    if (this.state.filterWord == "") {
      this.setState({flagFilter: false, currentFilterWord: ""});
    } else {
      this.setState({flagFilter: true, currentFilterWord: this.state.filterWord});
    }
  }

  handleClickSearch(event) {
    this.setState({message: "Loading...", flagFilter: false, filterWord: ""}, () => {
        dict.getInfo(this.state.word).then((response) => {
          if (response.valid) {
            // console.log(response.response)
            if (response.response.data.length == 0) {
              this.setState({ data: null, message: "No Results"});
            } else {
              var count = 0;
              var list = []
              response.response.data.forEach(element => {
                // count += element.length;
                // console.log(element);
                element.meanings.forEach(e =>{
                  list.push(e);
                  count += 1;
                }
                )
              });
              this.setState({ data: list, message: "Showing " + count + " Results", 
              filterComp: (
              <div className="input-group "style={{marginLeft: "5px", marginRight: "5px", marginBottom: "10px"}} >
              <div className="form-outline" style={{ width: "calc(100% - 50px)"}}>
                <input type="search" id="form1" className="form-control" placeholder="Filter Part of Speech" onChange={this.handleChangeFilter}  />
      
              </div>
              <button type="button" class="btn btn-primary" onClick={this.handleClickFilter}>
                <i class="fas fa-filter"></i>
              </button>
              </div>)});
            }
          } else {
            this.setState({ data: null, message: "No Results - Unexpected Error"});
          }
        })
      }
    )

  }

  handleChangeSearch(event) {
    this.setState({word: event.target.value});
  }

  render() {
    return (
      <div className="App" style={{ textAlign: "center", overflowX: "hidden" }}>
        <h1>Dictionary</h1>
        <div className="input-group "style={{marginLeft: "5px", marginRight: "5px", marginBottom: "10px"}} >
        <div className="form-outline" style={{ width: "calc(100% - 50px)"}}>
          <input type="search" id="form1" className="form-control" placeholder="Search" onChange={this.handleChangeSearch
    }  />

        </div>
        <button type="button" class="btn btn-primary" onClick={this.handleClickSearch}>
          <i className="fas fa-search"></i>
        </button>
      </div>
        
        <div>
          {this.state.data != null ?
            <div>
              <p>{this.state.message}</p>
              {this.state.filterComp}
              {
              
              this.state.data.filter(word => !this.state.flagFilter || word.partOfSpeech == this.state.currentFilterWord).map((word, index) => (
                  <div style={{marginTop: "5px", marginBottom: "5px", marginLeft: "5px", marginRight: "5px"}}>
                  <Meaning key={index} index={index} data={word} /> 
                  </div>
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
  static getDerivedStateFromProps(props, state) {

            if (props !== state) {

                return {
                    data: props.data
                };
            }

            return null;
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
