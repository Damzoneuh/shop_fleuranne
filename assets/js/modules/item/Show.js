import React, {Component} from 'react';
import ReactDOM from 'react-dom';

export default class Show extends Component{
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);

    }

    handleClick(){
      handleAddBasketItem(document.getElementById('item').dataset.item);
    }

    render() {
        return (
            <div>
                <button className="btn btn-group btn-grey" onClick={this.handleClick}>COUCOU</button>
            </div>
        );
    }

}

ReactDOM.render(<Show/>, document.getElementById('item'));