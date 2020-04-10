import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Loader from "../../common/loader/Loader";
import AddressForm from "./AddressForm";

export default class BasketValidation extends Component{

    constructor(props) {
        super(props);
        this.state = {
            invoiceAddress: null,
            deliveryAddress: null,
            invoiceSelected: null,
            deliverySelected: null,
            products: null,
            addAddress: false,
            isLoaded: false
        };
        this.calculatePrice = this.calculatePrice.bind(this);
        this.handleToggleAddress = this.handleToggleAddress.bind(this);
        this.reloadAddress = this.reloadAddress.bind(this);
    }

    componentDidMount(){
        axios.get('/api/address/invoice')
            .then(res => {
                this.setState({
                    invoiceAddress: res.data
                });
                axios.get('/api/address/delivery')
                    .then(res => {
                        this.setState({
                            deliveryAddress: res.data,
                        });
                        let product = [];
                        let storage = JSON.parse(sessionStorage.getItem('basket'));
                        const getItem = new Promise(resolve => resolve(storage.map(s => {
                            if (s !== null){
                                axios.get('/api/item/' + s.id)
                                    .then(res => {
                                        product.push({item: res.data, qty: s.quantity});
                                        this.setState({
                                            products: product
                                        })
                                    });
                            }
                        })));
                        getItem.then(res => {
                            this.setState({
                                isLoaded: true
                            })
                        })
                    })
            });
    }

    calculatePrice(item){
        let total = item.item.price * item.qty;
        return total.toFixed(2);
    }

    handleToggleAddress(){
        if (this.state.addAddress){
            this.setState({
                addAddress: false
            })
        }
        else{
            this.setState({
                addAddress: true
            })
        }
    }

    reloadAddress(){
        axios.get('/api/address/invoice')
            .then(res => {
                this.setState({
                    invoiceAddress: res.data
                });
                axios.get('/api/address/delivery')
                    .then(res => {
                        this.setState({
                            deliveryAddress: res.data,
                        });
                    });
            });
    }

    render() {
        const {isLoaded, invoiceAddress, deliveryAddress, addAddress, products} = this.state;
        if (!isLoaded){
            return (
                <div className="mt-5 mb-5">
                    <div className="m-auto">
                        <Loader/>
                    </div>
                </div>
            )
        }
        else {
            return (
                <div className="container-fluid">
                    <div className="row mt-2 mb-2 align-items-stretch">
                        <div className="col-md-6 col-12 bg-pink-inherit">
                            <div className=" p-2 text-grey">
                                <h1 className="text-center">Mon panier</h1>
                                <div className="mt-2 mb-2">
                                    <table className="table table-responsive-sm text-grey">
                                    {products && products.length > 0 ? products.map(p => {
                                         return (
                                             <tr key={p.item.id}>
                                                 <td>
                                                     {p.item.name}
                                                 </td>
                                                 <td>
                                                     {p.qty}
                                                 </td>
                                                 <td>
                                                     {this.calculatePrice(p)} €
                                                 </td>
                                             </tr>
                                         )
                                        })
                                        :
                                        ''}
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-12 bg-grey-inherit">
                            <div className=" p-2 text-pink">
                                <div className="p-2">
                                    <div className="text-center mb-4">
                                        <button className="btn btn-group btn-pink" onClick={this.handleToggleAddress}>{addAddress ? 'Réduire' : 'Ajouter une adresse'}</button>
                                        <div className={addAddress ? 'mt-2 mb-2' : 'd-none'}>
                                            <AddressForm reloadAddress={this.reloadAddress} />
                                        </div>
                                    </div>
                                    <h1>Adresse de Facturation</h1>
                                    <div className="mt-2 mb-2">
                                        {invoiceAddress && invoiceAddress.length > 0 ?
                                            ''
                                            //TODO list of addresses
                                            : ''}
                                    </div>
                                </div>
                                <div className="p-2">
                                    <h1>Adresse de Livraison</h1>
                                    <div className="mt-2 mb-2">
                                        {deliveryAddress && deliveryAddress.length > 0 ?
                                            ''
                                            //TODO list of delivery
                                            : ''}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

ReactDOM.render(<BasketValidation/>, document.getElementById('basket-validation'));