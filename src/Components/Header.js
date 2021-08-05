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

class Header extends React.Component {

    constructor() {
        super();
        this.state = {
            loginModalIsOpen: false,
            userName: undefined,
            userId: undefined,
            fname: undefined,
            lname: undefined,
            isLoggedIn: false,
            loginMethod: undefined
        }
    }

    goHome = () => {
        this.props.history.push(`./`);
    }

    openLoginModal = () => {
        this.setState({loginModalIsOpen: true, loginMethod: 1});
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

    render(){
        const {loginModalIsOpen, isLoggedIn, userName} = this.state;
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
                <div style={{height:'300px',width:'450px'}}>
                        <div onClick={this.closeLoginModal} style={{cursor:'pointer', position:'fixed',top:'2%',left:'95%'}}>X</div>
                        <div className='item-list-heading'>Login</div>
                        <GoogleLogin
                            clientId="997294644856-334nlr0tdbm7cshm1us5hql7d80frnb6.apps.googleusercontent.com"
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
                            appId="1035424760606014"
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

export default Header;