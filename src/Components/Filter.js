import React from 'react';
import '../Styles/filter.css';
import queryString from 'query-string';
import axios from 'axios';
import ResFilterItem from './ResFilterItem';
import Header from './Header';

class Filter extends React.Component {

    constructor() {
        super();
        this.state = {
            restaurants: [],
            locations: [],
            mealtype: 0,
            location: undefined,
            cuisine: [1,2,3,4,5,6],
            lcost: undefined,
            hcost: undefined,
            sort: undefined,
            page: 1,
            firstTime: true
        }
    }

    componentDidMount() {
        var coll = document.getElementsByClassName("collapsible");
        var i;
        var a = document.getElementById("cd");
        for (i = 0; i < coll.length; i++) {
            coll[i].addEventListener("click", function() {
                this.classList.toggle("active");
                var content = this.nextElementSibling;
                if (content.style.maxHeight){
                    content.style.maxHeight = null;
                    //
                    a.style.display = "inline-block";
                } 
                else {
                    content.style.maxHeight = content.scrollHeight + "px";
                    //
                    a.style.display = "none";
                }
            });
        }

        const qs = queryString.parse(this.props.location.search);
        const mealtypeId = qs.mealtype;
        const locationId = qs.locationId;

        const reqObj = {
            mealtype: parseInt(mealtypeId,10),
            location: parseInt(locationId,10),
            page: 1
        };

        axios({
            url:"https://zomato-clone-back-end.herokuapp.com/restaurantFilter",
            method:"POST",
            headers: {'Content-Type': 'application/json'},
            data: reqObj

        }).then(response => {
            this.setState({
                restaurants: response.data.restaurants, mealtype: mealtypeId, location: locationId
            })
        }).catch()

        axios({
            url:"https://zomato-clone-back-end.herokuapp.com/locations",
            method:"GET",
            headers: {'Content-Type': 'application/json'}
        }).then(response => {
            this.setState({
                locations: response.data.locations
            })
        }).catch()
    }

    handleSortChange = (sort) => {
        const reqObj = {
            mealtype: this.state.mealtype,
            location: this.state.location,
            sort: sort,
            lcost: this.state.lcost,
            hcost: this.state.hcost,
            page: 1
        };
        axios({
            url:"https://zomato-clone-back-end.herokuapp.com/restaurantFilter",
            method:"POST",
            headers: {'Content-Type': 'application/json'},
            data: reqObj

        }).then(response => {
            this.setState({
                restaurants: response.data.restaurants,
                sort: sort,
                page: 1
            })
        }).catch()
    }

    handlePriceChange = (lcost,hcost) => {
        const reqObj = {
            mealtype: parseInt(this.state.mealtype,10),
            location: parseInt(this.state.location,10),
            sort: this.state.sort,
            lcost: lcost,
            hcost: hcost,
            page: 1
        };
        axios({
            url:"https://zomato-clone-back-end.herokuapp.com/restaurantFilter",
            method:"POST",
            headers: {'Content-Type': 'application/json'},
            data: reqObj

        }).then(response => {
            this.setState({
                restaurants: response.data.restaurants,
                lcost: lcost, 
                hcost: hcost,
                page: 1
            })
        }).catch()
    }

    paginationLeft = () => {
        var p = this.state.page-1;
        if(p === 0)
            p = 1;
        const reqObj = {
            mealtype: parseInt(this.state.mealtype,10),
            location: parseInt(this.state.location,10),
            sort: this.state.sort,
            lcost: this.state.lcost,
            hcost: this.state.hcost,
            cuisine: this.state.cuisine,
            page: p
        };
        axios({
            url:"https://zomato-clone-back-end.herokuapp.com/restaurantFilter",
            method:"POST",
            headers: {'Content-Type': 'application/json'},
            data: reqObj

        }).then(response => {
            this.setState({
                restaurants: response.data.restaurants,
                page: p
            })
        }).catch()
    }

    paginationRight = () => {
        const p = this.state.page+1;
        const reqObj = {
            mealtype: parseInt(this.state.mealtype,10),
            location: parseInt(this.state.location,10),
            sort: this.state.sort,
            lcost: this.state.lcost,
            hcost: this.state.hcost,
            cuisine: this.state.cuisine,
            page: p
        };
        axios({
            url:"https://zomato-clone-back-end.herokuapp.com/restaurantFilter",
            method:"POST",
            headers: {'Content-Type': 'application/json'},
            data: reqObj

        }).then(response => {
            this.setState({
                restaurants: response.data.restaurants,
                page: p
            })
        }).catch()
    }

    handleCuisineChange = (cid) => {
        var c = this.state.cuisine;
        var ft = this.state.firstTime;
        if(ft === true){
            c = []
            ft = false;
        }
        if(c.indexOf(cid) === -1)
            c.push(cid);
        else{
            c.splice(c.indexOf(cid), 1);
            if(c.length === 0){
                c = [1,2,3,4,5,6];
                ft = true;
            }
        }
        const reqObj = {
            mealtype: parseInt(this.state.mealtype,10),
            location: parseInt(this.state.location,10),
            sort: this.state.sort,
            lcost: this.state.lcost,
            hcost: this.state.hcost,
            cuisine: c,
            page: 1,
        };
        axios({
            url:"https://zomato-clone-back-end.herokuapp.com/restaurantFilter",
            method:"POST",
            headers: {'Content-Type': 'application/json'},
            data: reqObj

        }).then(response => {
            this.setState({
                restaurants: response.data.restaurants,
                cuisine: c,
                page: 1,
                firstTime: ft
            })
        }).catch()
    }

    handleLocationChange = () => {
        var loc = undefined;
        if(parseInt(document.getElementById("select-box").selectedOptions[0].value,10) !== -1){
            loc = document.getElementById("select-box").selectedOptions[0].value;
        }
        const reqObj = {
            mealtype: parseInt(this.state.mealtype,10),
            location: loc,
            sort: this.state.sort,
            lcost: this.state.lcost,
            hcost: this.state.hcost,
            cuisine: this.state.cuisine,
            page: 1,
        };
        axios({
            url:"https://zomato-clone-back-end.herokuapp.com/restaurantFilter",
            method:"POST",
            headers: {'Content-Type': 'application/json'},
            data: reqObj

        }).then(response => {
            this.setState({
                restaurants: response.data.restaurants,
                location: loc,
                page: 1,
            })
        }).catch()
    }

    render(){
        const locationData = this.state.locations;
        const mealtypeArray = ['Breakfast','Lunch','Snacks','Dinner','Drinks','Nightlife'];
        const restaurantData = this.state.restaurants;
        return (
            <div>
                <Header history={this.props.history}/>
                <div className="top-heading">{`${mealtypeArray[this.state.mealtype-1]} Places`}</div>
                <div className="bottom-div container">
                    <div className="filter-collapse-div" id="cd">Filters/Sort</div>
                    <button className="collapsible"><i className="arrow down"/></button>
                    <div className="filter-box" id="demo">
                        <div className="Filters">Filters</div>
                        <div className="sub-title">Select Location</div>
                        <select className="select-box" id="select-box" onChange={this.handleLocationChange}>
                            <option value={-1}>Select Location</option>
                            {locationData.map((item) => {
                                return <option id={item.location_id} value={item.location_id}>{`${item.name}, ${item.city}`}</option>
                            })}
                        </select>
                        <div className="sub-title">Cuisine</div>
                        <div className="radio-checkbox"><input type="checkbox" id="ccb1" value="North Indian" onChange={() => this.handleCuisineChange(1)}/><span> North Indian</span></div>
                        <div className="radio-checkbox"><input type="checkbox" id="ccb2" value="South Indian" onChange={() => this.handleCuisineChange(2)}/><span> South Indian</span></div>
                        <div className="radio-checkbox"><input type="checkbox" id="ccb3" value="Chinese" onChange={() => this.handleCuisineChange(3)}/><span> Chinese</span></div>
                        <div className="radio-checkbox"><input type="checkbox" id="ccb4" value="Fast Food" onChange={() => this.handleCuisineChange(4)}/><span> Fast Food</span></div>
                        <div className="radio-checkbox"><input type="checkbox" id="ccb5" value="Street Food" onChange={() => this.handleCuisineChange(5)}/><span> Street Food</span></div>
                        <div className="radio-checkbox"><input type="checkbox" id="ccb6" value="Drinks" onChange={() => this.handleCuisineChange(6)}/><span> Drinks</span></div><br/>
                        <div className="sub-title">Cost for Two</div>
                        <div className="radio-checkbox"><input type="radio" name="cost" onChange={() => this.handlePriceChange(0,500)}/><span> Less than 500</span></div>
                        <div className="radio-checkbox"><input type="radio" name="cost" onChange={() => this.handlePriceChange(500,1000)}/><span> 500-1000</span></div>
                        <div className="radio-checkbox"><input type="radio" name="cost" onChange={() => this.handlePriceChange(1000,1500)}/><span> 1000-1500</span></div>
                        <div className="radio-checkbox"><input type="radio" name="cost" onChange={() => this.handlePriceChange(1500,2000)}/><span> 1500-2000</span></div>
                        <div className="radio-checkbox"><input type="radio" name="cost" onChange={() => this.handlePriceChange(2000,5000)}/><span> 2000+</span></div>
                        <div className="radio-checkbox"><input type="radio" name="cost" onChange={() => this.handlePriceChange(1,5000)}/><span> ALL</span></div><br/>
                        <div className="sub-title">Sort</div>
                        <div className="radio-checkbox"><input type="radio" name="sort" onChange={() => this.handleSortChange(1)}/><span> Price low to high</span></div>
                        <div className="radio-checkbox"><input type="radio" name="sort" onChange={() => this.handleSortChange(-1)}/><span> Price high to low</span></div>
                    </div>

                    {restaurantData.length !== 0 ? restaurantData.map((item,index) => {
                        return <ResFilterItem history={this.props.history} restaurantData={item} index={index}/>
                    }):<div className="no-records-found">
                            No Records Found 
                       </div>}
                    <div>
                        <button className="page-arrow-left" onClick={this.paginationLeft}>{'<'}</button>
                        <span className="page-number" id="page-number">{this.state.page}</span>
                        <button className="page-arrow-right" onClick={this.paginationRight}>{'>'}</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Filter;