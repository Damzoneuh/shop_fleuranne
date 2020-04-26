import React, {Component} from 'react';
import axios from 'axios';
import Logger from "../../common/logger/Logger";

export default class AddressForm extends Component{
    constructor(props) {
        super(props);
        this.state = {
            number: null,
            type: null,
            street: null,
            streetComplement: null,
            zip: null,
            city: null,
            country: null,
            addressType: null,
            loggerType: null,
            loggerMessage: null,
            name: null,
            lastName: null
        };
        this.handleChange = this.handleChange.bind(this);
        this.resetForm = this.resetForm.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.reloadAddress = this.reloadAddress.bind(this);
    }

    handleChange(e){
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    resetForm(){
        this.addressForm.reset();
        this.setState({
            number: null,
            type: null,
            street: null,
            streetComplement: null,
            zip: null,
            city: null,
            country: null,
            addressType: null,
            loggerType: null,
            loggerMessage: null,
            name: null,
            lastName: null
        })
    }

    handleSubmit(e){
        e.preventDefault();
        if (!this.state.addressType){
            this.setState({
                loggerMessage: 'Vous devez selectionner un type d\'adresse',
                loggerType: 'danger'
            })
        }
        else {
            let payload = this.state
            axios.post('/api/parameters/address/create', payload)
                .then(res => {
                    this.setState({
                        loggerMessage: res.data,
                        loggerType: 'success'
                    });
                    this.resetForm();
                    this.reloadAddress();
                })
        }
    }

    reloadAddress(){
        this.props.reloadAddress();
    }

    render() {
        const {loggerMessage, loggerType} = this.state;
        return (
            <form className="form" ref={(el) => this.addressForm = el} onChange={this.handleChange} onSubmit={this.handleSubmit}>
                {loggerMessage && loggerType ? <Logger message={loggerMessage} type={loggerType} /> : ''}
                <div className="form-row">
                    <div className="col form-group">
                        <label htmlFor="name">Nom</label>
                        <input className="form-control" required={true} name="name" id="name"/>
                    </div>
                    <div className="col form-group">
                        <label htmlFor="lastName">Prénom</label>
                        <input className="form-control" required={true} name="lastName" id="lastName"/>
                    </div>
                </div>
                <div className="form-row">
                    <div className="col form-group">
                        <label htmlFor="number">Numéro de rue</label>
                        <input type="number" id="number" className="form-control" name="number" required={true} />
                    </div>
                    <div className="col form-group">
                        <label htmlFor="type">Type de voie</label>
                        <input type="text" id="type" name="type" className="form-control" required={true} />
                    </div>
                </div>
                <div className="form-row">
                    <div className="col form-group">
                        <label htmlFor="street">Nom de la voie</label>
                        <input type="text" id="street" name="street" className="form-control" required={true} />
                    </div>
                    <div className="col form-group">
                        <label htmlFor="streetComplement">Complément nom de la voie</label>
                        <input type="text" id="streetComplement" name="streetComplement" className="form-control" />
                    </div>
                </div>
                <div className="form-row">
                    <div className="col form-group">
                        <label htmlFor="zip">Code postal</label>
                        <input type="text" name="zip" id="zip" className="form-control" required={true} />
                    </div>
                    <div className="col form-group">
                        <label htmlFor="city">Ville</label>
                        <input name="city" id="city" className="form-control" type="text" required={true} />
                    </div>
                    <div className="col form-group">
                        <label htmlFor="country">Pays</label>
                        <input name="country" id="country" type="text" className="form-control" required={true} />
                    </div>
                </div>
                <div className="form-row">
                    <div className="col form-group">
                        <label htmlFor="addressType">Type d'adresse</label>
                        <select name="addressType" id="addressType" className="form-control" required={true}>
                            <option></option>
                            <option value="delivery">Livraison</option>
                            <option value="invoice">Facturation</option>
                            <option value="both">Les deux</option>
                        </select>
                    </div>
                </div>
                <div className="mt-2 mb-2 text-center">
                    <button className="btn btn-group btn-pink">Créer mon adresse</button>
                </div>
            </form>
        );
    }

}