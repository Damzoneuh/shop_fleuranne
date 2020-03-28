import React, {Component} from 'react';
import axios from 'axios';
import Logger from "../../../common/logger/Logger";
import ButtonPinkLoader from "../../../common/loader/ButtonPinkLoader";

export default class AddMarkForm extends Component{
    // name & file fields form formdata /admin/api/mark/img
    constructor(props) {
        super(props);
        this.state = {
            name: null,
            file: null,
            message: null,
            type: null,
            localLoad: true
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.hasToReload = this.hasToReload.bind(this);
        this.cancelCourse = this.cancelCourse.bind(this);
    }

    handleChange(e){
        if (e.target.name === 'file'){
            this.setState({
                [e.target.name]: e.target.files[0]
            })
        }
        else {
            this.setState({
                [e.target.name]: e.target.value
            })
        }
    }

    handleSubmit(e){
        e.preventDefault();
        this.setState({
            localLoad: false
        });
        let data = new FormData();
        data.append('file', this.state.file);
        data.append('name', this.state.name);
        axios.post('/admin/api/mark/img', data)
            .then(res => {
                this.setState({
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
        this.addMarkForm.reset();
        this.setState({
            file: null,
            name: null
        })
    }

    render() {
        const {localLoad, message, type} = this.state;
        return (
            <form className="form" onChange={this.handleChange} onSubmit={this.handleSubmit} ref={(el) => this.addMarkForm = el}>
                {message && type ? <Logger message={message} type={type} /> : ''}
                <h1 className="h4">Créer une marque</h1>
                <div className="form-group">
                    <label htmlFor="markName" >Nom de la marque</label>
                    <input type="text" className="form-control" name="name" id="markName" />
                </div>
                <div className="custom-file">
                    <input type="file" className="custom-file-input" id="markFile" name="file" />
                    <label className="custom-file-label" htmlFor="markFile">Image</label>
                </div>
                <div className="form-group text-center mt-2">
                    <button className="btn btn-group btn-grey">{localLoad ? 'Envoyer' : <ButtonPinkLoader/>}</button>
                </div>
            </form>
        );
    }

}