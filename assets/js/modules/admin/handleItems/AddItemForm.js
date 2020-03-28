import React, {Component} from 'react';
import axios from 'axios';
import Loader from "../../../common/loader/Loader";

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
            categorySelected: null
        };
        this.handleChange = this.handleChange.bind(this);
        this.cancelCourse = this.cancelCourse.bind(this);
        this.hasToReload = this.hasToReload.bind(this);
        this.handleCatDropDown = this.handleCatDropDown.bind(this);
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
        //console.log('ici');
        axios.get('/api/category/child/' + id)
            .then(res => {
                this.setState({
                    categorySelected: res.data
                })
            })
    }

    render() {
        const {categorySelected} = this.state;
        const {marks, categories, childCategories, isLoaded} = this.props;
        if (!isLoaded){
            return(
                <Loader/>
            )
        }
        return (
            <form ref={(el) => this.createFormItem = el} onChange={this.handleChange} className="form">
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
                            <select name="category">
                                <option value={null}></option>
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
                                <select name="subCategory">
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
            </form>
        );
    }


}