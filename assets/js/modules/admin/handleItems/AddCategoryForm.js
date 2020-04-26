import React, {Component} from 'react';
import axios from 'axios';
import ButtonPinkLoader from "../../../common/loader/ButtonPinkLoader";
import Logger from "../../../common/logger/Logger";

export default class AddCategoryForm extends Component{
    constructor(props) {
        super(props);
        this.state = {
            name: null,
            localLoad: true,
            message: null,
            type: null
        };
        this.hasToReload = this.hasToReload.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.cancelCourse = this.cancelCourse.bind(this);
    }

    handleChange(e){
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit(e){
        this.setState({
            localLoad: false
        });
        e.preventDefault();
        axios.post('/admin/api/create/category',{name: this.state.name})
            .then(res => {
                console.log(res.data);
                this.setState({
                    name: null,
                    message: res.data.success,
                    type: 'success',
                    localLoad: true
                });
                this.cancelCourse();
                this.hasToReload();
            })
    }

    hasToReload(){
        this.props.hasToReload();
    }

    cancelCourse(){
        this.categoryForm.reset();
    }

    render() {
        const {localLoad, message, type} = this.state;
        return (
            <form className="form" onChange={this.handleChange} onSubmit={this.handleSubmit} ref={(el) => this.categoryForm = el}>
                {message && type ? <Logger message={message} type={type} /> : ''}
                <div className="form-group">
                    <label htmlFor="categoryName" >Nom de la categorie</label>
                    <input name="name" id="categoryName" type="text" className="form-control"/>
                </div>
                <div className="form-group mt-2 text-center">
                    <button className="btn btn-group btn-grey">{localLoad ? 'Envoyer' : <ButtonPinkLoader/>}</button>
                </div>
            </form>
        );
    }


}