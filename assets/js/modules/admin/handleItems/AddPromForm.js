import React, {Component} from 'react';
import axios from 'axios';
import Loader from "../../../common/loader/Loader";
import Logger from "../../../common/logger/Logger";

export default class AddPromForm extends Component{
    constructor(props) {
        super(props);
        this.state = {
            itemId: null,
            amount: null,
            items: null,
            message: null,
            type: null
        };
        this.handleCat = this.handleCat.bind(this);
        this.hasToReload = this.hasToReload.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    hasToReload(){
        this.props.hasToReload();
    }

    handleChange(e){
        this.setState({
            [e.target.name]: e.target.value
        });
        if (e.target.name === 'cat'){
           this.handleCat(e.target.value);
        }
    }

    handleCat(id){
        axios.get('/api/subcategory/items/' + id)
            .then(res => {
                this.setState({
                    items: res.data
                })
            })
    }

    handleSubmit(e){
        e.preventDefault();
        axios.put('/admin/api/prom/' + this.state.itemId, {amount: this.state.amount})
            .then(res => {
                this.setState({
                    itemId: null,
                    amount: null,
                    items: null,
                    message: res.data.success,
                    type: 'success'
                });
                this.promForm.reset();
                this.hasToReload();
            })
    }

    render() {
        const {childs, isLoaded} = this.props;
        const {message, type, items, itemId, amount} = this.state;
        if (!isLoaded){
            return (
                <Loader/>
            )
        }
        return (
            <form ref={(el) => this.promForm = el} className="form" onChange={this.handleChange} onSubmit={this.handleSubmit}>
                {message && type ? <Logger message={message} type={type}/> : ''}
                <div className="form-row">
                    <div className="col-12">
                        <div className="form-group">
                            <label htmlFor="catProm">Catégorie</label>
                            <select name="cat" className="form-control" id="catProm">
                                <option value={null}> </option>
                                {childs && childs.length > 0 ?
                                    childs.map(child => {
                                        return (
                                            <option key={child.id} value={child.id} >{child.name}</option>
                                        )
                                    })
                                    : ''}
                            </select>
                        </div>

                    </div>
                    {items && items.length > 0 ?
                        <div className="col-12">
                            <div className="form-group">
                                <label htmlFor="itemPromSelect" >Produit </label>
                                <select id="itemPromSelect" className="form-control" required={true} name="itemId">
                                    <option value={null} > </option>
                                    {items.map(item => {
                                        return(
                                            <option value={item.id} key={item.id}>{item.name}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>
                        : ''}
                    {itemId ?
                        <div className="col">
                            <div className="form-group">
                                <label htmlFor="itemProm" >Pourcentage de promotion</label>
                                <input id="itemProm" className="form-control" required={true} name="amount" />
                            </div>
                        </div>
                        : ''}
                </div>
                {amount ?
                    <div className="form-row">
                        <div className="col">
                            <button className="btn btn-group btn-grey">Envoyer</button>
                        </div>
                    </div>
                    : ''}
            </form>
        );
    }
}