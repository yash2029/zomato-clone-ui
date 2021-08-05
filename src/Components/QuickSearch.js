import React from 'react';
import QuickSearchItem from './QuickSeachItem';

class QuickSearch extends React.Component {

    handleNavigate = () => {
        this.props.history.push('./filter');
    } 

    render(){

        const mealtypeData = this.props.mealtypes;
        return (
            <div>
                <div className="quick-searches">Quick Searches</div>
                <div className="mid-heading">Discover restaurants by type of meal</div>
                <div className="container">
                    <div className="row">
                        {mealtypeData.map((item) => {
                            return (
                                <QuickSearchItem history={this.props.history} mealtypeData={item}/>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }
}


export default QuickSearch;