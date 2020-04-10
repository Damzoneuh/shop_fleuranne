import React, {Component} from 'react';
import axios from 'axios';

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
            country: null
        };
        this.handleChange = this.handleChange.bind(this);
        this.resetForm = this.resetForm.bind(this);
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
            country: null
        })
    }


    render() {
        return (
            <form className="form" ref={(el) => this.addressForm = el}>
                <div className="form-row">
                    <div className="col form-group">
                        <label htmlFor="number">Numéro de rue</label>
                        <input type="number" id="number" className="form-control" name="number"/>
                    </div>
                    <div className="col form-group">
                        <label htmlFor="type">Type de voie</label>
                        <input type="text" id="type" name="type" className="form-control"/>
                    </div>
                </div>
                <div className="form-row">
                    <div className="col form-group">
                        <label htmlFor="street">Nom de la voie</label>
                        <input type="text" id="street" name="street" className="form-control"/>
                    </div>
                    <div className="col form-group">
                        <label htmlFor="streetComplement">Complément nom de la voie</label>
                        <input type="text" id="streetComplement" name="streetComplement" className="form-control"/>
                    </div>
                </div>
                <div className="form-row">
                    <div className="col form-group">
                        <label htmlFor="zip">Code postal</label>
                        <input type="text" name="zip" id="zip" className="form-control"/>
                    </div>
                    <div className="col form-group">
                        <label htmlFor="city">Ville</label>
                        <input name="city" id="city" className="form-control" type="text"/>
                    </div>
                    <div className="col form-group">
                        <label htmlFor="country">Pays</label>
                        <input name="country" id="country" type="text" className="form-control"/>
                    </div>
                </div>
                <div className="mt-2 mb-2 text-center">
                    <button className="btn btn-group btn-pink">Créer mon adresse</button>
                </div>
            </form>
        );
    }

}