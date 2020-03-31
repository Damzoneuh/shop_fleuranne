import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
const el = document.getElementById('basket');

export default class Basket extends Component{
    constructor(props){
        super(props);
        this.state = {
            items: null
        };

        this.getItems = this.getItems.bind(this);
        document.addEventListener('click', () => this.getItems())
    }

    componentDidMount(){
        this.getItems();
    }

    componentWillUnmount(){
        document.removeEventListener('click', () => this.getItems())
    }

    getItems(){
        this.setState({
            items: JSON.parse(sessionStorage.getItem('basket'))
        });
    }

    render() {
        const {items} = this.state;
        return (
            <div>
                {items ? console.log(items) : ''}
            </div>
        );
    }
}
ReactDOM.render(<Basket/>, document.getElementById('basket'));