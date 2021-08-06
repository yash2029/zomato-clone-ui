import React from 'react';
import '../Styles/details.css';
import queryString from 'query-string';
import axios from 'axios';
import Modal from 'react-modal';
import Item from './Item';
import Header from './Header';

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

  const customStyles2 = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'black'
    },
  };

  const customStyles3 = {
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

class Details extends React.Component {

    constructor() {
        super();
        this.state = {
            restaurant: {},
            itemModalIsOpen: false,
            galleryModalIsOpen: false,
            userDetailsModalIsOpen: false,
            menuItems: [],
            total: 0,
            url: undefined,
            userName: undefined,
            userContact: undefined,
            userEmail: undefined,
            userAddress: undefined,
            orderItems: []
        }
    }

    componentDidMount() {
        const qs = queryString.parse(this.props.location.search);
        const id = qs.restId;
        axios({
            url:`https://zomato-clone-back-end.herokuapp.com/restaurantById/${id}`,
            method:"GET",
            headers: {'Content-Type': 'application/json'}
        }).then(response => {
            this.setState({
                restaurant: response.data.details,
                url: 0
            })
        }).catch()
    }

    openCity = (evt, cityName) => {
        var i, x, tablinks;
        x = document.getElementsByClassName("tabs");
        for (i = 0; i < x.length; i++) {
            x[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("tablink");
        for (i = 0; i < x.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" w3-red", "");
        }
        document.getElementById(cityName).style.display = "block";
        document.getElementById(evt).className += " w3-red";
        }

    openModal = () => {
        this.setState({itemModalIsOpen: true,total:0, orderItems: []})
        const qs = queryString.parse(this.props.location.search);
        const id = qs.restId;
        axios({
            url:`https://zomato-clone-back-end.herokuapp.com/menuItems/${id}`,
            method:"GET",
            headers: {'Content-Type': 'application/json'}
        }).then(response => {
            this.setState({
                menuItems: response.data.Items
            })
        }).catch()

    }

    closeModal = () => {
        this.setState({itemModalIsOpen: false, userDetailsModalIsOpen: false, orderItems: []})
    }

    addItem = (index) => {
        var temp = this.state.menuItems;
        var temp2 = temp[index];
        temp2.qty = temp2.qty+1;
        var temp3 = this.state.total;
        temp[index] = temp2;
        temp3+=parseInt(temp2.price,10);
        this.setState({menuItems: temp, total: temp3});
    }

    removeItem = (index) => {
        var temp = this.state.menuItems;
        var temp2 = temp[index];
        var temp3 = this.state.total;
        if(temp2.qty > 0){
            temp2.qty = temp2.qty-1;
            temp3-=parseInt(temp2.price,10);
        }
        temp[index] = temp2;
        this.setState({menuItems: temp, total: temp3});
    }

    openGalleryModal = () => {
        this.setState({galleryModalIsOpen: true})
    }

    closeGalleryModal = () => {
        this.setState({galleryModalIsOpen: false})
    }

    nextPhoto = (len) => {
        var temp = this.state.url;
        console.log(len);
        if(temp !== len-1)
            this.setState({url: temp+1})
    }

    prevPhoto = () => {
        var temp = this.state.url;
        if(temp !== 0)
            this.setState({url: temp-1})
    }

    handlePay = () => {
        this.setState({itemModalIsOpen:false,userDetailsModalIsOpen:true})
    }

    handleDetailChange = (event,state) => {
        this.setState({[state]: event.target.value});
        console.log(this.state);
    }

    isObj = (val) => {
        return typeof val === 'object';
    }

    stringifyValue = (val) => {
        if (this.isObj(val) && !this.isDate(val)) {
            return JSON.stringify(val);
        } else {
            return val;
        }
    }

    buildForm = ({ action, params }) => {
        const form = document.createElement('form');
        form.setAttribute('method', 'post');
        form.setAttribute('action', action);
        console.log(`PARAMS: ${params}`);
        Object.keys(params).forEach(key => {
            const input = document.createElement('input');
            input.setAttribute('type', 'hidden');
            input.setAttribute('name', key);
            input.setAttribute('value', this.stringifyValue(params[key]));
            form.appendChild(input);
        })
        return form;
    }

    post = (details) => {
        const form = this.buildForm(details);
        document.body.appendChild(form);
        form.submit();
        form.remove();
    }

    getData = (data) => {
        return fetch(`https://zomato-clone-back-end.herokuapp.com/payment`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then(response => response.json()).catch(err => console.log(err));
    }

    payment = () => {
        const { userEmail, total, userName, restaurant, menuItems } = this.state;
        // primary validations
        var orderItems = menuItems.map((item) => {
            return {
                itemId: item._id,
                qty: item.qty
            }
        })
        orderItems = orderItems.filter((item) => item.qty > 0);
        var today = new Date();
        var orderObj = {
            placedBy: userName,
            placedByUserId: userEmail,
            placedOn: today.getDate(),
            items: orderItems,
            amount: total,
            restaurantId: restaurant._id
        };
        this.getData({ amount: total, email: userEmail, orderObj: orderObj }).then(response => {
            var information = {
                action: "https://securegw-stage.paytm.in/order/process",
                params: response
            }
            this.post(information);
        });
    }

    render(){
        const cuisines = ['North Indian','South Indian','Chinese','Fast Food','Street Food','Drinks'];
        const modalIsOpen = this.state.itemModalIsOpen;
        const modalIsOpen2 = this.state.galleryModalIsOpen;
        const modalIsOpen3 = this.state.userDetailsModalIsOpen;
        const resImages = this.state.restaurant.thumb;
        const Url = this.state.url;
        const userName = this.state.userName;
        const userContact = this.state.userContact;
        const userEmail = this.state.userEmail;
        const userAddress = this.state.userAddress;
        return (
            <div>
               <Header history={this.props.history}/>
                <img src="../Images/a.png" className="display-image" alt="error"/>
                <button className="image-gallery-button" onClick={this.openGalleryModal}>Click to see Image Gallery</button>
                <div className="restaurant-name">{this.state.restaurant.name}</div>
                <button className="place-order-button" onClick={this.openModal}>Place Order</button>
                <div className="w3-bar tab-bar">
                    <button className="w3-bar-item w3-button tablink w3-red" id="overview-tab-button" onClick={() => this.openCity("overview-tab-button",'Overview')}>Overview</button>
                    <button className="w3-bar-item w3-button tablink" id="contact-tab-button" onClick={() => this.openCity("contact-tab-button",'Contact')}>Contact</button>
                </div>
                <div id="Overview" className="w3-container tabs">
                    <div className="about-this-place">About this place</div>
                    <div className="small-headings">Cuisines</div>
                    <div className="small-text">{this.state.restaurant.cuisine_id !== undefined ? this.state.restaurant.cuisine_id.map((item) => `${cuisines[parseInt(item-1,10)]},`) : <div></div>}</div>
                    <div className="small-headings">Average Cost</div>
                    <div className="small-text">{`₹${this.state.restaurant.min_price} for two people (approx.)`}</div>
                </div>
                <div id="Contact" className="w3-container tabs" style={{display:"none"}}>
                    <div className="small-headings">Contact Number</div>
                    <div className="small-text2">{this.state.restaurant.contact_number}</div>
                    <div className="small-headings">Address</div>
                    <div className="small-text">{`${this.state.restaurant.locality}, ${this.state.restaurant.city}`}</div>
                </div>
                <Modal
                    isOpen={modalIsOpen}
                    style={customStyles}
                >
                    <div style={{height:'500px',width:'500px'}}>
                        <div onClick={this.closeModal} style={{cursor:'pointer', position:'fixed',top:'2%',left:'95%'}}>X</div>
                        <div className='item-list-heading'>{this.state.restaurant.name}</div>
                        <div className='item-list'>
                            {this.state.menuItems.map((Mitem,index) => {
                                return <div>
                                    <Item history={this.state.history} menuItem={Mitem} />
                                    <div className='item-quantity-control'>
                                        <button className='item-quantity-control-button' onClick={() => this.removeItem(index)}>-</button>
                                        <span>{Mitem.qty}</span>
                                        <button className='item-quantity-control-button' onClick={() => this.addItem(index)}>+</button>
                                    </div>
                                    <div className='item-line' />
                                </div>
                            })}
                        </div>
                        <div className='item-list-checkout'>
                            <div className='item-list-total'>{`Total: ${this.state.total}`}</div>
                            <button className='item-list-paynow' onClick={this.handlePay}>Pay Now</button>
                        </div>
                    </div>
                </Modal>
                <Modal isOpen={modalIsOpen2} style={customStyles2}>
                    <div style={{height:'500px',width:'800px'}}>
                        <div onClick={this.closeGalleryModal} style={{cursor:'pointer', position:'fixed',top:'2%',left:'95%',color:'white'}}>X</div>
                        <div className='picture-left' onClick={this.prevPhoto}>{`<`}</div>
                        {resImages ? <img src={`../Images/${resImages[Url]}`} alt="error" className='restaurant-images'></img>  
                                   : <img src="../ResImages/1.png" alt="error" className='restaurant-images'></img>
                        }
                        <div className='picture-right' onClick={() => this.nextPhoto(resImages.length)}>{`>`}</div>
                    </div>
                </Modal>
                <Modal isOpen={modalIsOpen3} style={customStyles3}>
                    <div style={{height:'500px',width:'500px'}}>
                        <div onClick={this.closeModal} style={{cursor:'pointer', position:'fixed',top:'2%',left:'95%'}}>X</div>
                        <div className='item-list-heading'>{this.state.restaurant.name}</div>
                        <form>
                            <div className="form-group name-input">
                                <label className="input-labels">Name</label>
                                <input type="text" className="form-control" id="nameInput" placeholder="Enter your Name" style={{width:'450px'}} value={userName} onChange={(event) => this.handleDetailChange(event,'userName')}/>
                            </div>
                            <div className="form-group phone-input">
                                <label className="input-labels">Phone</label>
                                <input type="telephone" className="form-control" id="contactInput" placeholder="Enter your Phone no." style={{width:'450px'}}  value={userContact} onChange={(event) => this.handleDetailChange(event,'userContact')}/>
                            </div>
                            <div className="form-group email-input">
                                <label className="input-labels">Email</label>
                                <input type="email" className="form-control" id="emailInput" placeholder="Enter your email id" style={{width:'450px'}}  value={userEmail} onChange={(event) => this.handleDetailChange(event,'userEmail')}/>
                            </div>
                            <div className="form-group address-input">
                                <label className="input-labels">Address</label>
                                <textarea className="form-control" id="addressInput" rows="5" placeholder="Enter your Address" style={{width:'450px'}} value={userAddress} onChange={(event) => this.handleDetailChange(event,'userAddress')}></textarea>
                            </div>
                        </form>
                        <button className="details-proceed-button" onClick={this.payment}>Proceed</button>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default Details;
//`../ResImages/${resImages[0]}` require(`http://localhost:3000/imgs/a.png`