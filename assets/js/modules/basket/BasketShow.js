import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Loader from "../../common/loader/Loader";

export default class BasketShow extends Component{
    constructor(props) {
        super(props);
        this.state = {
            items: null,
            isLoaded: false,
            payload: null,
            shippingFees: null,
            totalPrice: null
        };
        this.getItems = this.getItems.bind(this);
        this.getItemsDetails = this.getItemsDetails.bind(this);
        this.handleDecrease = this.handleDecrease.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleIncrease = this.handleIncrease.bind(this);
        this.clearPayload = this.clearPayload.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
       this.getItems();
    }

    getItems(values){
       this.setState({
           isLoaded: false
       });
        const getItems = new Promise(resolve => {
            resolve(this.setState({
                items: JSON.parse(sessionStorage.getItem('basket'))
            }))
        });
        getItems.then(res => {
            const details = new Promise(resolve => resolve(this.getItemsDetails()));
            details.then(res => {
                this.setState({
                    isLoaded: true
                });
            });
        });
    }

    getItemsDetails(){
        let items = this.state.items;
        let iterator = 0;
        if (items && items.length > 0){
            let payLoad = [];
            items.map(i => {
                if (i !== null){
                    iterator ++;
                    axios.get('/api/item/' + i.id)
                        .then(res => {
                            payLoad.push({item : res.data, qty: i.quantity});
                            this.setState({
                                payload: payLoad
                            })
                        })
                }
            })
        }
    }

    handleIncrease(id){
        this.setState({
            isLoaded: false
        });
        handleAddBasketItem(id);
        const clear = new Promise(resolve => resolve(this.clearPayload()));
        clear.then(res => {
            this.getItems();
        })
    }

    handleDecrease(id){
        this.setState({
            isLoaded: false
        });
        decreaseItem(id);
        const clear = new Promise(resolve => resolve(this.clearPayload()));
        clear.then(res => {
            this.getItems();
        })
    }

    handleDelete(id){
        deleteItem(id);
        this.setState({
            isLoaded: false
        });
        const clear = new Promise(resolve => resolve(this.clearPayload()));
        clear.then(res => {
            this.getItems();
        })
    }

    clearPayload(){
        this.setState({
            isLoaded: false
        });
        this.setState({
            payload: null
        });
    }

    handleSubmit(e){
        e.preventDefault();
        axios.post('/api/basket/session', JSON.parse(e.target.payload.value))
            .then(res => {
                window.location.href = '/basket/validation';
            })
    }

    calculateProm(item){
        if (item.prom){
            let price = item.price - item.price / 100 * item.prom;
            return price.toFixed(2)
        }
        return item.price.toFixed(2)
    }

    render() {
        const {isLoaded, payload} = this.state;
        if (!isLoaded){
            return (
                <div className="container-fluid">
                    <div className="row">
                        <div className="col">
                            <Loader/>
                        </div>
                    </div>
                </div>
            )
        }
        else {
            let total = 0;
            return (
                <div className="container-fluid">
                    <div className="row">
                        <div className="col">
                            {payload && payload.length > 0 ?
                                <div className="bg-grey-inherit m-5">
                                    <table className="table table-striped table-responsive-md">
                                        <thead>
                                            <tr className="text-center text-pink h4">
                                                <th scope="col">Produit</th>
                                                <th scope="col">Nom du produit</th>
                                                <th scope="col">Quantité</th>
                                                <th scope="col">Prix</th>
                                                <th scope="col">Retirer du panier</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {payload.map(item => {
                                            let price = 0;
                                            price = this.calculateProm(item.item) * item.qty;
                                            total = total + this.calculateProm(item.item) * item.qty;
                                            return(
                                                <tr className="text-center text-pink h5">
                                                    <th scope="row">
                                                        <img src={'https://' + window.location.hostname + '/img/' + item.item.img[0].id} alt={item.item.name} className="img-thumbnail img-basket"/>
                                                    </th>
                                                    <td className="vertical-align-center">
                                                        {item.item.name}
                                                    </td>
                                                    <td className="vertical-align-center">
                                                        <div className="text-center">
                                                            {item.qty}
                                                            <button className="btn btn-group btn-grey ml-3" onClick={() => this.handleDecrease(item.item.id)}><span className="m-0 p-0">-</span></button>
                                                            <button className="btn btn-group btn-grey" onClick={() => this.handleIncrease(item.item.id)}><span className="m-0 p-0">+</span></button>
                                                        </div>
                                                    </td>
                                                    <td className="vertical-align-center">
                                                        {price.toFixed(2)} €
                                                    </td>
                                                    <td className="vertical-align-center">
                                                        <i className="fas fa-trash text-danger link" onClick={() => this.handleDelete(item.item.id)}></i>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                        </tbody>
                                    </table>
                                    <div className="d-flex justify-content-around align-items-center p-2">
                                        <div className="text-center">
                                            <h1 className="h4 text-pink">Frais de port</h1>
                                            <h1 className="h4 text-info">{total > 75 ? 'offert' : 5.95 + ' €'}</h1>
                                        </div>
                                        <div className="text-center">
                                            <h1 className="h4 text-pink">Prix total</h1>
                                            <h1 className="h4 text-info">{total < 75 ? total + 5.95 : total} €</h1>
                                        </div>
                                    </div>
                                    <form className="form p-2" onSubmit={this.handleSubmit}>
                                        <input type="hidden" value={JSON.stringify(payload)} name="payload"/>
                                        <div className="form-group form-check text-center">
                                            <input className="form-check-input" name="cgu" id="cgu" required={true} type="checkbox"/>
                                            <label htmlFor="cgv">En cochant cette case vous acceptez les <a href="/cgv">conditions générale de vente</a> et renoncez à votre délais de rétractation de 7 jours </label>
                                        </div>
                                        <div className="text-center mt-2">
                                            <button title="Valider mon panier" className="btn btn-group btn-grey">Valider mon panier</button>
                                        </div>
                                    </form>
                                </div>
                                :
                                <div className="text-center">
                                    <h2 className="h3 text-grey p-5">Votre panier est vide</h2>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            )
        }
    }
}
ReactDOM.render(<BasketShow/>, document.getElementById('basket-show'));