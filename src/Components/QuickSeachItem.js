import React from 'react';

class QuickSearchItem extends React.Component {

    handleNavigate = (id) => {
        const locationId = sessionStorage.getItem('selectedLocation');
        if(locationId !== 'Select a Location')
            this.props.history.push(`./filter?mealtype=${id}&locationId=${locationId}`);
        else
            this.props.history.push(`./filter?mealtype=${id}`);
    } 

    render(){

        const mealtypeData = this.props.mealtypeData;
        return (
            <div className="col-lg-4 col-md-6 col-sm-12 search-type" onClick={() => this.handleNavigate(mealtypeData.meal_type)}>
                <img src={mealtypeData.image} alt="error" height="200px" width="220px" className="col-md-6 quick-search-image"/>
                <span className="type-right">
                    <div className="type-name">{mealtypeData.name}</div>
                    <div className="type-description">
                        {mealtypeData.content}
                    </div>
                </span>
            </div>
        )
    }
}


export default QuickSearchItem;