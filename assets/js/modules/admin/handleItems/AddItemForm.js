import React, {Component} from 'react';
import axios from 'axios';
import Loader from "../../../common/loader/Loader";
import Logger from "../../../common/logger/Logger";

export default class AddItemForm extends Component{
    constructor(props) {
        super(props);
        this.state = {
            name: null,
            description: null,
            price: null,
            file: null,
            mark: null,
            category: null,
            reference: null,
            prom: null,
            subCategory: null,
            categorySelected: null,
            message: null,
            type: null
        };

        this.handleChange = this.handleChange.bind(this);
        this.cancelCourse = this.cancelCourse.bind(this);
        this.hasToReload = this.hasToReload.bind(this);
        this.handleCatDropDown = this.handleCatDropDown.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    cancelCourse(){
        this.createFormItem.reset();
    }

    hasToReload(){
        this.props.hasToReload()
    }

    handleChange(e){
        this.setState({
            [e.target.name]: e.target.name === 'file' ? e.target.files[0] : e.target.value
        });
        if (e.target.name === 'category'){
            this.handleCatDropDown(e.target.value);
        }
    }

    handleCatDropDown(id){
        axios.get('/api/category/child/' + id)
            .then(res => {
                this.setState({
                    categorySelected: res.data
                })
            })
    }

    handleSubmit(e){
        e.preventDefault();
        const createPayload = new Promise((resolve => {
            let payload = {
                name: this.state.name,
                description: this.state.description,
                price: this.state.price,
                prom: this.state.prom,
                ref: this.state.reference,
            };
            resolve(payload)
        }));

        createPayload.then(payload => {
            let form = new FormData();
            form.append('file', this.state.file);
            form.append('payload', JSON.stringify(payload));
            form.append('mark', this.state.mark);
            form.append('categoryChild', this.state.subCategory);

            axios.post('/admin/api/create/item', form)
                .then(res => {
                    this.setState({
                        name: null,
                        description: null,
                        price: null,
                        file: null,
                        mark: null,
                        category: null,
                        reference: null,
                        prom: null,
                        subCategory: null,
                        categorySelected: null,
                        message: res.data.success,
                        type: 'success'
                    });
                    this.cancelCourse();
                    this.hasToReload();
                })
        })
    }

    render() {
        const {categorySelected, subCategory, mark, message, type} = this.state;
        const {marks, categories, isLoaded} = this.props;
        if (!isLoaded){
            return(
                <Loader/>
            )
        }
        return (
            <form ref={(el) => this.createFormItem = el} onChange={this.handleChange} onSubmit={this.handleSubmit} className="form">
                {message && type ? <Logger message={message} type={type} /> : ''}
                <h1 className="h4 text-grey text-center mb-4">Créer un produit</h1>
                <div className="form-group">
                    <label htmlFor="itemName">Nom du produit</label>
                    <input type="text" name="name" id="itemName" className="form-control"/>
                </div>
                <div className="form-group">
                    <label htmlFor="itemDescription">Description du produit</label>
                    <textarea name="description" id="itemDescription" className="form-control"/>
                </div>
                <div className="custom-file">
                    <input type="file" className="custom-file-input" id="itemFile" name="file" />
                    <label className="custom-file-label" htmlFor="itemFile">Image</label>
                </div>
                <div className="form-row mt-2">
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="itemPrice">Prix</label>
                            <input name="price" id="itemPrice" className="form-control"/>
                        </div>
                    </div>
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="itemPrice">Promotion</label>
                            <input name="prom" id="itemPrice" className="form-control" required={false}/>
                        </div>
                    </div>
                </div>
                <div className="form-row mt-2">
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="itemCat">Catégorie</label>
                            <select name="category" className="form-control" id="itemCat">
                                <option value={null}> </option>
                                {categories && categories.length > 0 ? categories.map(cat => {
                                   return (
                                       <option value={cat.id} key={cat.id}>{cat.name}</option>
                                   )
                                }) : ''}
                            </select>
                        </div>
                    </div>
                    {categorySelected ?
                        <div className="col">
                            <div className="form-group">
                                <label htmlFor="itemSubCat">Sous catégorie</label>
                                <select name="subCategory" className="form-control" id="itemSubCat">
                                    <option value={null}> </option>
                                {categorySelected && categorySelected.length > 0 ?
                                    categorySelected.map(cs => {
                                        return(
                                            <option value={cs.id} key={cs.id} >{cs.name}</option>
                                        )
                                    })
                                    :
                                    ''}
                                </select>
                            </div>
                        </div>
                        : ''}
                </div>
                <div className="form-row">
                    {subCategory ?
                        <div className="col">
                            <div className="form-group">
                                <label htmlFor="itemRef">Référence du produit</label>
                                <input id="itemRef" name="reference" className="form-control" required={true} />
                            </div>
                        </div>
                        : ''}
                    {marks && subCategory && marks.length > 0 ?
                        <div className="col">
                            <div className="form-group">
                                <label htmlFor="itemMark">Marque</label>
                                <select id="itemMark" className="form-control" name="mark">
                                    <option value={null}> </option>
                                    {marks.map(mark => {
                                        return (
                                            <option value={mark.id} key={mark.id}>{mark.name}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>
                        : ''}
                </div>
                {mark && categorySelected && subCategory ?
                    <div className="form-row mt-2">
                        <div className="col text-center">
                            <button className="btn btn-group btn-grey">Envoyer</button>
                        </div>
                    </div>
                    : ''}
            </form>
        );
    }


}