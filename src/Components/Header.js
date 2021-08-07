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
    top: '70%',
    left: '10%',
    width: '398px',
    height: '50px',
    borderRadius: '6px',
    border: 'solid 1px #c7c7c7',
    backgroundColor: '#ffffff',
    cursor: 'pointer'
}

class Header extends React.Component {

    constructor() {
        super();
        this.state = {
            loginModalIsOpen: false,
            signupModalIsOpen: false,
            userName: undefined,
            userId: undefined,
            fname: undefined,
            lname: undefined,
            isLoggedIn: false,
            credentials: []
        }
    }

    goHome = () => {
        this.props.history.push(`./`);
    }

    openLoginModal = () => {
        axios({
            url:"https://zomato-clone-back-end.herokuapp.com/login",
            method:"GET",
            headers: {'Content-Type': 'application/json'}
        }).then(response => {
            console.log(response);
            this.setState({
                credentials: response.data.Credentials,
                signupModalIsOpen: false,
                loginModalIsOpen: true
            })
        }).catch();
    }

    createAccount = () => {
        axios({
            url:"https://zomato-clone-back-end.herokuapp.com/login",
            method:"GET",
            headers: {'Content-Type': 'application/json'}
        }).then(response => {
            console.log(response);
            this.setState({
                credentials: response.data.Credentials,
                signupModalIsOpen: true,
                loginModalIsOpen: false
            })
        }).catch()
    }
    
    closeLoginModal = () => {
        this.setState({loginModalIsOpen: false});
    }

    closeSignupModal = () => {
        this.setState({signupModalIsOpen: false});
    }

    signup = () => {
        var signupName = document.getElementById('signupName').value;
        var signupEmail = document.getElementById('signupEmail').value;
        var signupPassword = document.getElementById('signupPassword').value;
        var signupPassword2 = document.getElementById('signupPassword2').value;
        const {credentials} = this.state;
        console.log(credentials);
        var temp = credentials.filter((item) => item.username === signupEmail);
        console.log(temp);
        if(temp.length > 0 ){
            alert('Email already has registered user!!')
            return null;
        }
        if(signupPassword !== signupPassword2){
            alert('Passwords do not match!!')
            return null;
        }
        alert('Signup Complete!!');
        const reqObj ={
            username: signupEmail,
            password: signupPassword,
            fname: signupName.split(' ')[0],
            lname: signupName.split(' ')[1]
        };
        axios({
            url:`https://zomato-clone-back-end.herokuapp.com/signup`,
            method:"POST",
            headers: {'Content-Type': 'application/json'},
            data: reqObj
        }).then(res => {
            this.setState({
                signupModalIsOpen: false
            })
        }).catch(() => {console.log('error')})
    }

    signin = () => {
        var inputEmail = document.getElementById('inputEmail').value;
        var inputPassword = document.getElementById('inputPassword').value;
        const {credentials} = this.state;
        var temp = credentials.filter((item) => item.username === inputEmail);
        if(temp.length === 0 || inputPassword !== temp[0].password){
            alert('Invalid Email or Password')
            return null;
        }
        this.setState({
            loginModalIsOpen: false, 
            isLoggedIn: true,
            userName: temp[0].fname + ' ' + temp[0].lname,
            userId: inputEmail,
            fname: temp[0].fname,
            lname: temp[0].lname  
        })
    }

    responseFacebook = (response) => {
        const userName = response.name;
        const userId = response.email;
        var fname,lname;
        if(response.name !== undefined){
            fname = response.name.split(' ')[0];
            lname = response.name.split(' ')[1];
        }
        this.setState({
            loginModalIsOpen: false, 
                isLoggedIn: true,
                userName: userName,
                userId: userId,
                fname: fname,
                lname: lname  
        })
    }

    responseGoogle = (response) => {
        const userName = response.profileObj.name;
        const userId = response.profileObj.email;
        const fname = response.profileObj.givenName;
        const lname = response.profileObj.familyName;
        this.setState({
            loginModalIsOpen: false, 
            isLoggedIn: true,
            userName: userName,
            userId: userId,
            fname: fname,
            lname: lname
        })
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

    render(){
        const {loginModalIsOpen, isLoggedIn, userName, signupModalIsOpen} = this.state;
        return(
            <div>
                <div className="top-div">
                    <div className="logo" onClick={this.goHome}>e!</div>
                    {!isLoggedIn ? <div>
                                    <div className="login" onClick={this.openLoginModal}>Login</div>
                                    <div className="create-account" onClick={this.createAccount}>Create an account</div>
                                  </div>    
                                : <div>
                                    <div className="login-name">{`Welcome ${userName}!`}</div>
                                    <div className="logout" onClick={this.logoutUser}>Logout</div>
                                  </div>
                    }
                </div>
                <Modal isOpen={loginModalIsOpen} style={customStyles}>
                    <div style={{height:'550px',width:'450px'}}>
                        <div onClick={this.closeLoginModal} style={{cursor:'pointer', position:'fixed',top:'2%',left:'95%'}}>X</div>
                        <div className='item-list-heading'>Login</div>
                        <input type="email" className="form-control inputEmail" id="inputEmail" placeholder="Enter email"/>
                        <input type="password" className="form-control inputPassword" id="inputPassword" placeholder="Enter password"/>
                        <button className='signin-button' onClick={this.signin}>Signin</button>
                        <div className='signup-link' onClick={this.createAccount}>Not a user?? Signup Now</div>
                        <GoogleLogin
                            clientId="852243907649-6iog48fo4896c158bpdase4f6khnrgne.apps.googleusercontent.com"
                            render={renderProps => (
                                <div onClick={renderProps.onClick} style={googleStyles}>
                                    <span style={{position:'absolute',left:'30%',top:'23%',fontFamily: 'Poppins',fontSize: '18px',textAlign: 'left',color: 'red'}}>Login with Gmail</span>
                                </div>
                              )}
                            buttonText="Login"
                            onSuccess={this.responseGoogle}
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
                <Modal isOpen={signupModalIsOpen} style={customStyles}>
                    <div style={{height:'400px',width:'450px'}}>
                        <div onClick={this.closeSignupModal} style={{cursor:'pointer', position:'fixed',top:'2%',left:'95%'}}>X</div>
                        <div className='item-list-heading'>Signup</div>
                        <input type="text" className="form-control signupName" id="signupName" placeholder="Enter name"/>
                        <input type="email" className="form-control signupEmail" id="signupEmail" placeholder="Enter email"/>
                        <input type="password" className="form-control signupPassword" id="signupPassword" placeholder="Enter password"/>
                        <input type="password" className="form-control signupPassword2" id="signupPassword2" placeholder="Re-Enter password"/>
                        <button className='signup-button' onClick={this.signup}>Signup</button>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default Header;