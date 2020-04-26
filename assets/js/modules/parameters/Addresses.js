import React, {Component} from 'react';
import Loader from "../../common/loader/Loader";

export default class Addresses extends Component{
    constructor(props) {
        super(props);
    }


    render() {
        const {isLoaded, user} = this.props;
        if (!isLoaded){
            return (
                <div className="p-2 p-sm-4">
                    <Loader />
                </div>
            )
        }
        else {
            return(
                <div className="p-2 p-sm-4">
                    <h1 className="h2 text-center">Mes adresses</h1>
                    <h1 className="h4 text-center">Mes adresses de facturation</h1>
                    <table className="table table-responsive-sm table-striped bg-pink-inherit">
                        <tbody>
                        {user && user.invoiceAdress.length > 0  ? user.invoiceAdress.map(invoice => {
                            return (
                                <tr>
                                    <td>{invoice.number} {invoice.street} {invoice.city}</td>
                                </tr>
                            )
                        }) : ''}
                        </tbody>
                    </table>
                    <h1 className="h4 text-center">Mes adresses de livraison</h1>
                    <table className="table table-responsive-sm table-striped bg-pink-inherit">
                        <tbody>
                        {user && user.deliveryAddress.length > 0  ? user.deliveryAddress.map(delivery => {
                            return (
                                <tr>
                                    <td>{delivery.number} {delivery.street} {delivery.city}</td>
                                </tr>
                            )
                        }) : ''}
                        </tbody>
                    </table>
                </div>
            )
        }
    }

}