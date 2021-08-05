import React from 'react';
import axios from 'axios';
import '../Styles/home.css';
import Wallpaper from './Wallpaper';
import QuickSearch from './QuickSearch';

class Home extends React.Component {

    constructor() {
        super();
        this.state = {
            locations: [],
            mealtypes: []
        }
    }

    componentDidMount() {
        axios({
            url:"https://zomato-clone-back-end.herokuapp.com/locations",
            method:"GET",
            headers: {'Content-Type': 'application/json'}
        }).then(response => {
            this.setState({
                locations: response.data.locations
            })
        }).catch()
        
        axios({
            url:"https://zomato-clone-back-end.herokuapp.com/mealtypes",
            method:"GET",
            headers: {'Content-Type': 'application/json'}
        }).then(response => {
            this.setState({
                mealtypes: response.data.mealtypes
            })
        }).catch()
    }

    render(){
        return (
            <div>
                <Wallpaper history={this.props.history} locations={this.state.locations}/>
                <QuickSearch history={this.props.history} mealtypes={this.state.mealtypes}/>
            </div>
        )
    }
}

export default Home;