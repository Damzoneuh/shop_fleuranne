import React, {Component} from 'react';
import ShowInvoice from "./ShowInvoices";
import ShowInvoices from "./ShowInvoices";
import ShowOrders from "./ShowOrders";

export default class Invoice extends Component{
    constructor(props) {
        super(props);
    }


    render() {
        const {subTab} = this.props;
        if (subTab === 1){
            return (
                <ShowInvoices />
            )
        }
        if (subTab === 2){
            return (
                <ShowOrders />
            )
        }
    }

}