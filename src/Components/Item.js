import React from 'react';

class Item extends React.Component {
    render() {
        const menuItems = this.props.menuItem;
        return (
            <div style={{height:'125px'}}>
                <div className='item-name'>{menuItems.name}</div>
                <div className='item-price'>{`₹${menuItems.price}`}</div>
                <div className='item-description'>{menuItems.description}</div>
                <img src='../Images/a.png' alt="error" className='item-image' />
            </div>
        )
    }
}

export default Item;