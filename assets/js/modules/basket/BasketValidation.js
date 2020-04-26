import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Loader from "../../common/loader/Loader";
import AddressForm from "./AddressForm";
import Logger from "../../common/logger/Logger";

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
            isLoaded: false,
            deliveryMode: null,
            message: null,
            type: null
        };
        this.calculatePrice = this.calculatePrice.bind(this);
        this.handleToggleAddress = this.handleToggleAddress.bind(this);
        this.reloadAddress = this.reloadAddress.bind(this);
        this.handleAddressSelected = this.handleAddressSelected.bind(this);
        this.handleDeliveryMode = this.handleDeliveryMode.bind(this);
        this.handleValidate = this.handleValidate.bind(this);
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
        if (item.item.prom){
            return this.calculateProm(item.item) * item.qty;
        }
        return item.item.price * item.qty;
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
        this.setState({
            isLoaded: false
        })
        axios.get('/api/address/invoice')
            .then(res => {
                this.setState({
                    invoiceAddress: res.data
                });
                axios.get('/api/address/delivery')
                    .then(res => {
                        this.setState({
                            deliveryAddress: res.data,
                            isLoaded: true
                        });
                    });
            });
    }

    handleAddressSelected(id, type){
        if (type === 'invoice'){
            if (this.state.invoiceSelected === id){
                this.setState({
                    invoiceSelected: null
                })
            }
            else {
                this.setState({
                    invoiceSelected: id
                })
            }
        }
        else {
            if (this.state.deliverySelected === id){
                this.setState({
                    deliverySelected: null
                })
            }
            else {
                this.setState({
                    deliverySelected: id
                })
            }
        }
    }

    handleDeliveryMode(e){
        this.setState({
            deliveryMode: e.target.value
        })
    }

    handleValidate(e){
        e.preventDefault();
        let states = this.state;
        if (states.invoiceSelected === null || states.deliverySelected === null || states.deliveryMode === null){
            this.setState({
                message: 'Vous devez remplir toutes les informations afin de poursuivre votre achat',
                type: 'danger'
            })
        }
        else {
            this.setState({
                isLoaded: false
            });
            axios.post('/api/basket/session/command', this.state)
                .then(res => {
                    window.location.href = '/basket/recap';
                })
        }
    }

    calculateProm(item){
        console.log(item)
        if (item.prom){
            let price = item.price - item.price * item.prom /100;
            return price.toFixed(2)
        }
        return item.price.toFixed(2)
    }


    render() {
        const {isLoaded, invoiceAddress, deliveryAddress, addAddress, products, invoiceSelected, deliverySelected, message, type} = this.state;
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
                    {message && type ? <Logger message={message} type={type} /> : ''}
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
                                    <h1 className="h4">Adresse de Facturation</h1>
                                    <div className="mt-2 mb-2">
                                        {invoiceAddress && invoiceAddress.length > 0 ?
                                            <form className="mt-2 mb-2">
                                                {invoiceAddress.map(i => {
                                                    return(
                                                        <div className="p-2 shadow-lg mt-2 mb-2">
                                                            <div className="form-group form-check mt-1 mb-1">
                                                                <input type="checkbox" checked={i.id === invoiceSelected} value={i.id} onClick={() => this.handleAddressSelected(i.id, 'invoice')} className="form-check-input" id={"invoice-" + i.id}/>
                                                                <label htmlFor={"invoice-" + i.id} className="form-check-label">{i.name} {i.lastName}, {i.number} {i.type} {i.street} {i.city}</label>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </form>
                                            : ''}
                                    </div>
                                </div>
                                <div className="p-2">
                                    <h1 className="h4">Adresse de Livraison</h1>
                                    <div className="mt-2 mb-2">
                                        {deliveryAddress && deliveryAddress.length > 0 ?
                                            <form className="mt-2 mb-2">
                                                {deliveryAddress.map(d => {
                                                    return (
                                                        <div className="p-2 shadow-lg mt-2 mb-2">
                                                            <div className="form-group form-check mt-1 mb-1">
                                                                <input type="checkbox" checked={d.id === deliverySelected} value={d.id} onClick={() => this.handleAddressSelected(d.id, 'delivery')} className="form-check-input" id={"delivery-" + d.id}/>
                                                                <label htmlFor={"delivery-" + d.id} className="form-check-label">{d.name} {d.lastName}, {d.number} {d.type} {d.street} {d.city}</label>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </form>
                                            : ''}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 bg-grey">
                            <div className=" p-2 text-pink">
                                <h1 className="text-center">Mode de livraison</h1>
                                <form onChange={this.handleDeliveryMode}>
                                    <select className="form-control" name="deliveryMode" required={true}>
                                        <option value={null}></option>
                                        <option value={1}>Collissimo</option>
                                        <option value={2}>Retrait sur place (pas de frais de port)</option>
                                    </select>
                                </form>
                            </div>
                            <div className="text-center p-4">
                                <button className="btn btn-group btn-pink" onClick={this.handleValidate}>Valider</button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

ReactDOM.render(<BasketValidation/>, document.getElementById('basket-validation'));