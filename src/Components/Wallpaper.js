import React from 'react';
import Modal from 'react-modal';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import axios from 'axios';

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white'
    },
  };

const googleStyles = {
    position: 'absolute',
    top: '30%',
    left: '10%',
    width: '398px',
    height: '50px',
    borderRadius: '6px',
    border: 'solid 1px #c7c7c7',
    backgroundColor: '#ffffff',
    cursor: 'pointer'
}

class Wallpaper extends React.Component {
    
    constructor() {
        super();
        this.state = {
            loginModalIsOpen: false,
            userName: undefined,
            userId: undefined,
            fname: undefined,
            lname: undefined,
            isLoggedIn: false,
            loginMethod: undefined,
            restaurants: [],
            inputText: undefined,
            suggestions: []
        }
    }

    handleChange = (event) => {
        const location_id = event.target.value;
        sessionStorage.setItem('selectedLocation',location_id);
        axios({
            url:`https://zomato-clone-back-end.herokuapp.com/restaurantsbylocation/${location_id}`,
            method:"GET",
            headers: {'Content-Type': 'application/json'}
        }).then(res => {
            this.setState({
                restaurants: res.data.restaurants,
                suggestions: []
            })
        }).catch(() => {console.log('error')})
    }

    openLoginModal = () => {
        this.setState({loginModalIsOpen: true});
    }

    createAccount = () => {
        this.setState({loginModalIsOpen: true, loginMethod: 2});
    }

    closeLoginModal = () => {
        this.setState({loginModalIsOpen: false});
    }

    responseFacebook = (response) => {
        const {loginMethod} = this.state;
        const userName = response.name;
        const userId = response.email;
        const password = response.userID;
        const fname = response.name.split(' ')[0];
        const lname = response.name.split(' ')[1];
        if(loginMethod === 2){
            const reqObj ={
                username: userId,
                password: password,
                fname: fname,
                lname: lname
            };
            axios({
                url:`https://zomato-clone-back-end.herokuapp.com/signup`,
                method:"POST",
                headers: {'Content-Type': 'application/json'},
                data: reqObj
            }).then(res => {
                this.setState({
                    loginModalIsOpen: false,
                    isLoggedIn: true,
                    loginMethod: undefined,
                    userName: userName,
                    userId: userId,
                    fname: fname,
                    lname: lname
                })
            }).catch(() => {console.log('error')})
        }
        else{
            this.setState({
                loginModalIsOpen: false, 
                    isLoggedIn: true, 
                    loginMethod: undefined,
                    userName: userName,
                    userId: userId,
                    fname: fname,
                    lname: lname  
            })
        }
    }

    responseGoogle = (response) => {
        const {loginMethod} = this.state;
        const userName = response.profileObj.name;
        const userId = response.profileObj.email;
        const password = response.profileObj.googleId;
        const fname = response.profileObj.givenName;
        const lname = response.profileObj.familyName;
        if(loginMethod === 2){
            const reqObj ={
                username: userId,
                password: password,
                fname: fname,
                lname: lname
            };
            axios({
                url:`https://zomato-clone-back-end.herokuapp.com/signup`,
                method:"POST",
                headers: {'Content-Type': 'application/json'},
                data: reqObj
            }).then(res => {
                this.setState({
                    loginModalIsOpen: false, 
                    isLoggedIn: true,
                    loginMethod: undefined,
                    userName: userName,
                    userId: userId,
                    fname: fname,
                    lname: lname
                })
            }).catch()
        }
        else{
            this.setState({
                loginModalIsOpen: false, 
                isLoggedIn: true,
                loginMethod: undefined,
                userName: userName,
                userId: userId,
                fname: fname,
                lname: lname
            })
        }
    }

    logoutUser = () => {
        this.setState({
            isLoggedIn: false, 
            userName: undefined,
            userId: undefined,
            fname: undefined,
            lname: undefined
        })
    }

    
    handleTextChange = (event) => {
        const {restaurants} = this.state;
        const input = event.target.value;
        let filteredRes = []; 
        if(input.length > 0){
            filteredRes = restaurants.filter((item) => {
                return item.name.toLowerCase().includes(input)
            });
        }
        this.setState({inputText: input, suggestions: filteredRes});
    }

    selectedText = (item) => {
        this.props.history.push(`./details?restId=${item._id}`);
    }

    renderSuggestions() {
        const {suggestions} = this.state;
        if(suggestions.length === 0){
            return null;
        }
        return (
            <div>
                {
                    suggestions.map((item) => (
                        <div className='suggestion-item' onClick={() => this.selectedText(item)}>{item.name}</div>
                    ))
                }
            </div>
            // <ul>
            //     {
            //         suggestions.map((item,index) => (<li key={index} onClick={() => this.selectedText(item)}>
            //             <div className='suggestion-item'>{item.name}</div>
            //         </li>))
            //     }
            // </ul>
        )
    }

    render(){
        const {loginModalIsOpen, isLoggedIn, userName} = this.state;
        const locationData = this.props.locations;
        const {inputText} = this.state;
        sessionStorage.setItem('selectedLocation','Select a Location');
        return (
            <div>
                {!isLoggedIn ?  <div>
                                    <div className="login-home" onClick={this.openLoginModal}>Login</div>
                                    <div className="create-account-home" onClick={this.createAccount}>Create an account</div>
                                </div>    
                             : <div>
                                    <div className="login-name">{`Welcome ${userName}!`}</div>
                                    <div className="logout-home" onClick={this.logoutUser}>Logout</div>
                                </div>
                    }
                <div className="top-div-home">
                    <div className="logo-home">e!</div>
                    <div className="top-heading-home">Find the best restaurants, cafés, and bars</div>
                </div>
                <select className="location-search" onChange = {this.handleChange}>
                    <option>Select a Location</option>
                    {locationData.map((item) => {
                        return <option id={item.location_id} value={item.location_id}>{`${item.name}, ${item.city}`}</option>
                    })}
                </select>
                <div className="restaurant-search">
                    <img src="../Images/magGlass.jpg" alt="error" className="magGlass" />  
                    <input type="text" placeholder="Search for restaurants" className="restaurant-search-text" value={inputText} onChange={this.handleTextChange}></input>
                </div>
                <div className='suggestion-list'>
                    {this.renderSuggestions()}
                </div>
                <Modal isOpen={loginModalIsOpen} style={customStyles}>
                <div style={{height:'300px',width:'450px'}}>
                        <div onClick={this.closeLoginModal} style={{cursor:'pointer', position:'fixed',top:'2%',left:'95%'}}>X</div>
                        <div className='item-list-heading'>Login</div>
                        <GoogleLogin
                            clientId="852243907649-6iog48fo4896c158bpdase4f6khnrgne.apps.googleusercontent.com"
                            render={renderProps => (
                                <div onClick={renderProps.onClick} style={googleStyles}>
                                    <span style={{position:'absolute',left:'30%',top:'23%',fontFamily: 'Poppins',fontSize: '18px',textAlign: 'left',color: 'red'}}>Login with Gmail</span>
                                </div>
                              )}
                            buttonText="Login"
                            onSuccess={this.responseGoogle}
                            onFailure={this.responseGoogle}
                            cookiePolicy={'single_host_origin'} />
                        <br/>
                        <FacebookLogin
                            appId="3009291009330705"
                            cssClass='facebook-login'
                            autoLoad={false}
                            fields="name,email,picture"
                            callback={this.responseFacebook} />
                    </div>
                </Modal>
            </div>
            
        )
    }
}


export default Wallpaper;