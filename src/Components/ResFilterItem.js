import React from 'react';

class ResFilterItem extends React.Component {

    toggleCollapse = (flag,cbn) => {
        var x = document.getElementById(cbn);
        if(flag === 1){
            switch(cbn){
                case 'cb1': x.style.top = "40%";
                            break;
                case 'cb2': x.style.top = "80%";
                            break;
                case 'cb3': x.style.top = "120%";
                            break;
                default: break;
            }
            console.log('if');
        }
        else{
            switch(cbn){
                case 'cb1': x.style.top = "140%";
                            break;
                case 'cb2': x.style.top = "180%";
                            break;
                case 'cb3': x.style.top = "220%";
                            break;
                default: break;
            }
            console.log('else');
        }
    };

    getRestaurant = (id) => {
        this.props.history.push(`./details?restId=${id}`);
    }

    render(){
        const cuisines = ['North Indian','South Indian','Chinese','Fast Food','Street Food','Drinks'];
        const restaurantData = this.props.restaurantData;
        return (
            <div className={`content-box${this.props.index+1}`} id={`cb${this.props.index+1}`} onClick={() => this.getRestaurant(restaurantData._id)}>
                <span><img src='./Images/res.png' className="food-img" alt="error"/></span>
                <span className="restaurant-details">
                    <div className="restaurant-name-filter">{restaurantData.name}</div>
                    <div className="sub-title">{restaurantData.type}</div>
                    <div className="restaurant-address">{`${restaurantData.locality}, ${restaurantData.city}`}</div>
                </span>
                <hr className="line"/>
                <span className="CUISINES-COST-FOR-TWO">
                    <div>CUISINES:</div>
                    <div>COST FOR TWO:</div>
                </span>
                <span className="cuisine-cost">
                    <div>{restaurantData.cuisine_id.map((x) => {
                        return `${cuisines[x-1]},`;
                    })}</div>
                    <div>{`₹${restaurantData.min_price}`}</div>
                </span>
            </div>
        )
    }
}


export default ResFilterItem;
//export default connect(null,null,null,{forwardRef: true})(ResFilterItem);