import React, {Component} from 'react';
import axios from 'axios';
import Loader from "../../../common/loader/Loader";

export default class ShowOrder extends Component{
    constructor(props) {
        super(props);
        this.state = {
            orders: null,
            isLoaded: false,
        }
    }

   componentDidMount(){
        axios.get('/admin/api/order')
            .then(res => {
                this.setState({
                    isLoaded: true,
                    orders: res.data
                })
            })
   }

    render() {
        const {isLoaded, orders} = this.state;
        if (!isLoaded){
            return (
                <div className="container-fluid">
                    <div className="row">
                        <div className="col mt-5 mb-5">
                            <Loader />
                        </div>
                    </div>
                </div>
            )
        }
        if (orders){
            if (orders.length > 0){
                return (
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12 bg-pink-inherit text-grey mt-5 mb-5">
                                <h1 className="text-center mt-2">
                                    Commande non traitées
                                </h1>
                                <table className="table table-responsive-sm table-striped text-grey">
                                    <thead>
                                        <tr>
                                            <th scope="col">uuid</th>
                                            <th scope="col">Faite par</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {orders.map(o => {
                                        if (o.status === 'En attente')
                                        return (
                                            <tr>
                                                <td><a href={"/admin/order/" + o.id} >{o.invoice.payment.transactionUuid}</a></td>
                                                <td>{o.invoice.buyer.email}</td>
                                                <td className="text-danger">{o.status}</td>
                                                <td>{o.invoice.payment.date.slice(8, 10)}/{o.invoice.payment.date.slice(5, 7)}/{o.invoice.payment.date.slice(0, 4)}</td>
                                            </tr>
                                        )
                                    })}
                                    </tbody>
                                </table>
                            </div>
                            <div className="col-12 bg-grey-inherit text-pink mt-5 mb-5">
                                <h1 className="text-center mt-2">
                                    Commande Conditionnés
                                </h1>
                                <table className="table table-responsive-sm table-striped text-pink">
                                    <thead>
                                        <tr>
                                            <th scope="col">uuid</th>
                                            <th scope="col">Faite par</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {orders.map(o => {
                                        if (o.status === 'En cours de préparation')
                                            return (
                                                <tr>
                                                    <td><a href={"/admin/order/" + o.id} >{o.invoice.payment.transactionUuid}</a></td>
                                                    <td>{o.invoice.buyer.email}</td>
                                                    <td className="text-warning">{o.status}</td>
                                                    <td>{o.invoice.payment.date.slice(8, 10)}/{o.invoice.payment.date.slice(5, 7)}/{o.invoice.payment.date.slice(0, 4)}</td>
                                                </tr>
                                            )
                                    })}
                                    </tbody>
                                </table>
                            </div>
                            <div className="col-12 bg-pink-inherit text-grey mt-5 mb-5">
                                <h1 className="text-center mt-2">
                                    Commande Terminées
                                </h1>
                                <table className="table table-responsive-sm table-striped text-grey">
                                    <thead>
                                        <tr>
                                            <th scope="col">uuid</th>
                                            <th scope="col">Faite par</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {orders.map(o => {
                                        if (o.status === 'Prête' || o.status === 'Expédié')
                                            return (
                                                <tr>
                                                    <td><a href={"/admin/order/" + o.id} >{o.invoice.payment.transactionUuid}</a></td>
                                                    <td>{o.invoice.buyer.email}</td>
                                                    <td className="text-success">{o.status}</td>
                                                    <td>{o.invoice.payment.date.slice(8, 10)}/{o.invoice.payment.date.slice(5, 7)}/{o.invoice.payment.date.slice(0, 4)}</td>
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
            else {
                return (
                    <div className="container-fluid">
                        <div className="row mt-5 mb-5">
                            <div className="col">
                                <h1 className="text-center text-grey">Pas de commandes</h1>
                            </div>
                        </div>
                    </div>
                )
            }
        }
        else {
            return (
                <div className="container-fluid">
                    <div className="row">
                        <div className="col">
                            <h1 className="mt-5 mb-5">
                                Pas de nouvelles commandes
                            </h1>
                        </div>
                    </div>
                </div>
            )
        }
    }
}