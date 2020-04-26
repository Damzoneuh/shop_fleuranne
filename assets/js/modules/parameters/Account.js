import React, {Component} from 'react';
import axios from 'axios';
import Logger from "../../common/logger/Logger";
import Loader from "../../common/loader/Loader";
import Modal from "../../common/Modal";

export default class Account extends Component{
    constructor(props) {
        super(props);
        this.state = {
            edit: false,
            message: null,
            type: null,
            phone: null,
            accountDelete: false
        };
        this.handleNewsletter = this.handleNewsletter.bind(this);
        this.reloadUser = this.reloadUser.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleDeleteModal = this.handleDeleteModal.bind(this);
        this.deleteAccount = this.deleteAccount.bind(this);
    }

    reloadUser(){
        this.props.reloadUser();
    }

    handleNewsletter(){
        axios.put('/api/newsletter')
            .then(res => {
                this.setState({
                    message: res.data.success,
                    type: 'success'
                })
            })
            .catch(e => {
                this.setState({
                    message: 'Une erreur est survenue lors de votre demande si le problème persiste merci de nous contacter',
                    type: 'danger'
                })
            });
        this.reloadUser();
    }

    handleChange(e){
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit(e){
        e.preventDefault();
        axios.put('/api/user/phone', {phone: this.state.phone})
            .then(res => {
                this.setState({
                    message: res.data.success,
                    type: 'success',
                    edit: false,
                    phone: null
                });
                this.reloadUser();
                this.cancelCourse();
            });
    }

    handleEdit(){
        if (this.state.edit){
            this.setState({
                edit: false
            })
        }
        else {
            this.setState({
                edit: true
            })
        }
    }

    handleDeleteModal(){
        if (this.state.accountDelete){
            this.setState({
                accountDelete: false
            })
        }
        else {
            this.setState({
                accountDelete: true
            })
        }
    }

    deleteAccount(){
        window.location.href='/user/delete'
    }

    cancelCourse(){
        this.accountForm.reset();
    }


    render() {
        const {edit, message, type, accountDelete} = this.state;
        const {user, isLoaded} = this.props;

        if (!isLoaded){
           return (
               <div className="p-2 p-sm-4">
                   <Loader/>
               </div>
           )
        }

        if (isLoaded && !edit) {
            return (
                <div className="p-2 p-sm-4">
                    <h1 className="text-center h2">Paramètres de compte</h1>
                    {message && type ? <Logger message={message} type={type} /> : ''}
                    {accountDelete ? <Modal message={'Vous êtes sur le point de supprimer votre compte, en validant, toutes vos information seront supprimées'}
                                            onValidation={this.deleteAccount} onCancel={this.handleDeleteModal}
                    /> : ''}
                    {user ?
                        <div className="mt-2 mb-2">
                            <div>
                                Email : {user.email ? user.email : ''}
                            </div>
                            <div>
                                Téléphone : {user.phone ? '+33 ' + user.phone : ''}
                            </div>
                            <div className="mt-2">
                                <a href="/reset" className="btn btn-group btn-grey">Réinitialiser mon mot de passe</a>
                            </div>
                            <div className="mt-2">
                                <a className="btn btn-group btn-grey text-pink" onClick={this.handleNewsletter}>{user.newsletter ? 'Se désabonner de la newsletter' : 'S\'abonner à la newsletter'}</a>
                            </div>
                            <div className="mt-2 d-flex justify-content-between align-items-center">
                                <a className="btn btn-group btn-grey text-pink" onClick={this.handleEdit}>Editer mes informations</a>
                                <a className="btn btn-group btn-danger text-white" onClick={this.handleDeleteModal}>Supprimer mon compte</a>
                            </div>
                            <div className="mt-5 text-center">
                                <a href="/parameters/order" className="btn btn-group btn-success">Voir mes commandes</a>
                            </div>
                        </div>
                        : ''
                    }
                </div>
            );
        }
        else {
            return(
                <div className="p-2 p-sm-4">
                    <h1 className="text-center h2">Paramètres de compte</h1>
                    <form className="form" onChange={this.handleChange} onSubmit={this.handleSubmit} ref={(el) => this.accountForm = el}>
                        <div className="form-row">
                            <label htmlFor="parametersPhone">Téléphone</label>
                            <div className="input-group mb-2">
                                <div className="input-group-prepend">
                                    <div className="input-group-text">+33</div>
                                </div>
                                <input type="text" className="form-control" id="parametersPhone" name="phone"/>
                            </div>
                        </div>
                        <div className="form-row text-center mt-2 justify-content-between">
                            <a onClick={this.handleEdit} className="btn btn-group btn-grey text-pink">Retour</a>
                            <button className="btn btn-group btn-grey">Valider</button>
                        </div>
                    </form>
                </div>
            )
        }
    }


}