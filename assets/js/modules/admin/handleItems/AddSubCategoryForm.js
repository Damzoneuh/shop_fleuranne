import React, {Component} from 'react';
import axios from 'axios';
import ButtonPinkLoader from "../../../common/loader/ButtonPinkLoader";
import Loader from "../../../common/loader/Loader";

export default class AddSubCategoryForm extends Component{
    constructor(props) {
        super(props);
        this.state = {
            name: null,
            category: null,
            localLoad: true,
            message: null,
            type: null
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.hasToReload = this.hasToReload.bind(this);
        this.cancelCourse = this.cancelCourse.bind(this);
    }

    handleChange(e){
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit(e){
        e.preventDefault();
        this.setState({
            localLoad: false
        });
        if (!this.state.category){
            this.setState({
                message: 'Vous devez choisir une categorie',
                type: 'danger'
            });
        }
        else {
            axios.post('/admin/api/create/categorychild', {name: this.state.name, category: this.state.category})
                .then(res => {
                    this.setState({
                        message: res.data.success,
                        type: 'success',
                        category: null,
                        name: null,
                        localLoad: true
                    });
                    this.cancelCourse();
                    this.hasToReload();
                })
                .catch(e => {
                    this.setState({
                        message: 'Une erreur est survenue lors de la création',
                        type: 'danger'
                    })
                })
        }
    }

    hasToReload(){
        this.props.hasToReload();
    }

    cancelCourse(){
        this.subCategoryForm.reset();
    }

    render() {
        const {categories, isLoaded} = this.props;
        const {localLoad} = this.state;
        if (!isLoaded){
            return (
                <Loader/>
            )
        }
        else {
            return (
                <form className="form" ref={(el) => this.subCategoryForm = el} onChange={this.handleChange} onSubmit={this.handleSubmit}>
                    <h1 className="h4">Créer une sous categorie</h1>
                    <div className="form-group">
                        <label htmlFor="subCategoryName" >Nom de la sous categorie</label>
                        <input className="form-control" type="text" name="name" id="subCategoryName"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="categoryId">Nom de la categorie</label>
                        <select name="category" id="categoryId" className="form-control" required={true}>
                            <option value={null} ></option>
                            {categories && categories.length > 0 ? categories.map(cat => {
                                    return(
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    )
                                })
                                : ''}
                        </select>
                    </div>
                    <div className="form-group mt-2 text-center">
                        <button className="btn btn-group btn-grey">{localLoad ? 'Envoyer' : <ButtonPinkLoader/>}</button>
                    </div>
                </form>
            );
        }
    }

}