import React, {Component} from 'react';
import axios from 'axios';
import Loader from "../../../common/loader/Loader";

export default class ShowInvoice extends Component{
    constructor() {
        super();
        this.state = {
            invoices: null,
            invoice: null,
            isLoaded: false,
            address: null
        };
        this.showInvoice = this.showInvoice.bind(this);
        this.handleBack = this.handleBack.bind(this);
    }
    componentDidMount(){
        axios.get('/admin/api/order')
            .then(res => {
                this.setState({
                    invoices: res.data,
                    isLoaded: true
                })
            })
    }

    showInvoice(invoice){
        this.setState({
            isLoaded: false
        })
        axios.get('/api/address/' + invoice.invoiceAddress)
            .then(res => {
                this.setState({
                    invoice: invoice,
                    address: res.data,
                    isLoaded: true
                })
            })
    }

    handleBack(){
        this.setState({
            invoice: null,
            address: null,
        })
    }


    render() {
        const {invoice, invoices, isLoaded, address} = this.state;
        if (!isLoaded){
            return (
                <div className="mt-5 mb-5">
                    <Loader />
                </div>
            )
        }
        else {
            if (!invoice && invoices && invoices.length > 0){
                return(
                    <div className="container-fluid">
                        <div className="row mt-5 mb-5">
                            <div className="col bg-pink-inherit text-grey">
                                <table className="table table-striped table-responsive-sm">
                                    <thead>
                                    <tr>
                                        <th scope="col">Numéro</th>
                                        <th scope="col">Ref SystemPay</th>
                                        <th scope="col">Montant</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {invoices.map(i => {
                                        let total = 0;
                                        if (i.invoice.amount > 75 || i.mode !== 1){
                                            total = i.invoice.payment.amount;
                                        }
                                        else {
                                            let price = i.invoice.payment.amount + 5.95;
                                            total = Math.round(price * 100) /100
                                        }

                                        console.log(Math.round(total * 100) / 100)
                                        return (
                                            <tr>
                                                <td><a className="link text-primary" onClick={() => this.showInvoice(i)}>{i.invoice.payment.transactionUuid}</a></td>
                                                <td>{i.invoice.payment.transactionId}</td>
                                                <td>{total} €</td>
                                            </tr>
                                        )
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )
            }
            if (invoice && address){
                let total = 0;
                return (
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col mt-2 mb-2 text-grey">
                                <div className="text-center mt-2 mb-2">
                                    <button className="btn btn-group btn-grey" onClick={this.handleBack}>Retour</button>
                                </div>
                                <h1 className="text-center">
                                    Facture : {invoice.invoice.id}
                                </h1>
                                <div className="mt-2">
                                    <div className="text-left">
                                        {address.name} {address.lastName}
                                    </div>
                                    <div className="text-left">
                                        {address.number} {address.type} {address.street} {address.streetComplement}
                                    </div>
                                    <div className="text-left">
                                        {address.zip} {address.city} {address.country}
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <table className="table table-striped table-responsive-sm">
                                    <tbody>
                                    {invoice.invoice.line.map(p => {
                                        if (p.prom){
                                            total = total + p.price - p.price * p.prom / 100;
                                        }
                                        else {
                                            total = total + p.price
                                        }
                                        return (
                                            <tr>
                                                <td>{p.name}</td>
                                                <td>{p.ref}</td>
                                                <td>{p.quantity}</td>
                                                <td>{p.prom} %</td>
                                                <td>{p.prom ? p.price - p.price * p.prom / 100 : p.price} €</td>
                                            </tr>
                                        )
                                    })}
                                    <tr>
                                        <td>Frais de port</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>{total > 75 || invoice.mode !== 1 ? 0 : 5.95} €</td>
                                    </tr>
                                    <tr>
                                        <td>Total</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>{total > 75 || invoice.mode !== 1 ? total : total + 5.95} €</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )
            }
            else {
                return (
                    <div className="mt-5 mb-5">
                        <div className="text-center text-grey">
                            <h1>Pas de Nouvelles factures</h1>
                        </div>
                    </div>
                )
            }
        }
    }
}