import React, {Component} from 'react';
import axios from 'axios';
import AddItemForm from "./AddItemForm";
import AddMarkForm from "./AddMarkForm";
import AddCategoryForm from "./AddCategoryForm";
import AddSubCategoryForm from "./AddSubCategoryForm";

export default class ItemHandler extends Component{
    constructor(props) {
        super(props);
        this.state = {
            items: null,
            isLoaded: false,
            marks: null,
            categories: null,
            childCategories: null
        };
        this.getItems = this.getItems.bind(this);
    }

    componentDidMount(){
        this.getItems();
    }

    getItems(){
        this.setState({
            isLoaded: false
        });
        axios.get('/api/item')
            .then(res => {
                this.setState({
                    items: res.data
                });
                axios.get('/api/mark')
                    .then(res => {
                        this.setState({
                            marks: res.data,
                        });
                        axios.get('/api/category')
                            .then(res => {
                                this.setState({
                                    categories: res.data
                                });
                                axios.get('/api/child/category')
                                    .then(res => {
                                        this.setState({
                                            childCategories: res.data,
                                            isLoaded: true
                                        })
                                    })
                            })
                    });
            })
    }

    hasToReload(){
        this.getItems();
    }


    render() {
        const {items, isLoaded, marks, categories, childCategories} = this.state;
        const {subTab} = this.props;
        if (subTab === 1){
            return (
                <div className="container-fluid">
                    <div className="row align-items-stretch mt-2 mb-2">
                        <div className="col-sm-12 col-md-6">
                            <div className="p-sm-5">
                                <div className="bg-pink-inherit p-2 p-sm-5 text-grey rounded shadow-lg">
                                    <AddItemForm hasToReload={this.hasToReload} marks={marks} categories={categories} childCategories={childCategories} isLoaded={isLoaded}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        if (subTab === 2){
            return(
                <div className="container-fluid">
                    <div className="row align-items-stretch mt-2 mb-2">
                        <div className="col-sm-12 col-md-6">
                            <div className="p-sm-5">
                                <div className="bg-pink-inherit p-2 p-sm-5 text-grey rounded shadow-lg">
                                    <AddMarkForm hasToReload={this.hasToReload} isLoaded={isLoaded} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        if (subTab === 4){
            return (
                <div className="container-fluid">
                    <div className="row align-items-stretch mt-2 mb-2">
                        <div className="col-sm-12 col-md-6">
                            <div className="p-sm-5">
                                <div className="bg-pink-inherit p-2 p-sm-5 text-grey rounded shadow-lg">
                                    <AddCategoryForm hasToReload={this.hasToReload}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        if (subTab === 5){
            return (
                <div className="container-fluid">
                    <div className="row align-items-stretch mt-2 mb-2">
                        <div className="col-sm-12 col-md-6">
                            <div className="p-sm-5">
                                <div className="bg-pink-inherit p-2 p-sm-5 text-grey rounded shadow-lg">
                                    <AddSubCategoryForm categories={categories} hasToReload={this.hasToReload} isLoaded={isLoaded}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        else {
            return (
                <div></div>
            )
        }
    }
}