import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import BasketModal from "./BasketModal";
const el = document.getElementById('basket');

export default class Basket extends Component{
    constructor(props){
        super(props);
        this.state = {
            items: null,
            count: null
        };

        this.getItems = this.getItems.bind(this);
        this.countItems = this.countItems.bind(this);

        document.addEventListener('click', () => this.getItems());
    }

    componentDidMount(){
        this.getItems();
    }

    componentWillUnmount(){
        document.removeEventListener('click', () => this.getItems())
    }

    getItems(){
        const promise = new Promise(resolve => {
            resolve(this.setState({
                items: JSON.parse(sessionStorage.getItem('basket'))
            }))
        });
        promise.then(res => {
            this.countItems();
        })
    }

    countItems(){
        let count = 0;
        if (this.state.items && this.state.items.length > 0){
            this.state.items.map(item => {
                if (item !== null){
                    count = count + 1;
                    this.setState({
                        count: count
                    })
                }
            })
        }
    }

    render() {
        const {items, count} = this.state;
        return(
            <div>
                <BasketModal items={items} />
                <div className="position-fixed bg-light shadow rounded-circle basket-icon" data-toggle="modal" data-target="#basketModal">
                    <span className="badge badge-danger position-absolute badge-basket d-flex align-items-center justify-content-center rounded-circle">{count ? count : 0}</span>
                    <div className="text-center text-grey"><i className="fas fa-shopping-cart fa-2x"></i></div>
                </div>
            </div>
        )

    }
}
ReactDOM.render(<Basket/>, document.getElementById('basket'));