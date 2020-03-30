import React, {Component} from 'react';
import axios from 'axios';
import AddItemForm from "./AddItemForm";
import AddMarkForm from "./AddMarkForm";
import AddCategoryForm from "./AddCategoryForm";
import AddSubCategoryForm from "./AddSubCategoryForm";
import ItemTable from "./ItemTable";
import AddPromForm from "./AddPromForm";
import PromTable from "./PromTable";

export default class ItemHandler extends Component{
    constructor(props) {
        super(props);
        this.state = {
            items: null,
            isLoaded: false,
            marks: null,
            categories: null,
            childCategories: null,
            proms: null
        };
        this.getItems = this.getItems.bind(this);
        this.hasToReload = this.hasToReload.bind(this);
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
                                    });
                                axios.get('/api/prom')
                                    .then(res => {
                                        this.setState({
                                            proms: res.data
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
        const {items, isLoaded, marks, categories, childCategories, proms} = this.state;
        const {subTab} = this.props;
        if (subTab === 1){
            return (
                <div className="container-fluid">
                    <div className="row align-items-stretch mt-2 mb-2">
                        <div className="col-md-12 col-lg-6">
                            <div className="p-2">
                                <div className="bg-pink-inherit p-2 p-sm-5 text-grey rounded shadow-lg">
                                    <AddItemForm hasToReload={this.hasToReload} marks={marks} categories={categories} childCategories={childCategories} isLoaded={isLoaded}/>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12 col-lg-6">
                            <div className="p-2 ">
                                <div className="bg-grey-inherit p-2 p-sm-5 text-pink rounded shadow-lg">
                                    <ItemTable items={items} isLoaded={isLoaded} hasToReload={this.hasToReload}/>
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
                            <div className="p-2">
                                <div className="bg-pink-inherit p-2 p-sm-5 text-grey rounded shadow-lg">
                                    <AddMarkForm hasToReload={this.hasToReload} isLoaded={isLoaded} childs={childCategories}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        if (subTab === 3){
            return (
                <div className="container-fluid">
                    <div className="row align-items-stretch mt-2 mb-2">
                        <div className="col-sm-12 col-md-6">
                            <div className="p-2">
                                <div className="bg-pink-inherit p-2 p-sm-5 text-grey rounded shadow-lg">
                                    <AddPromForm items={items} hasToReload={this.hasToReload} isLoaded={isLoaded} childs={childCategories}/>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6">
                            <div className="p-2">
                                <div className="bg-grey-inherit p-2 p-sm-5 text-pink rounded shadow-lg">
                                    <PromTable proms={proms} isLoaded={isLoaded} hasToReload={this.hasToReload} />
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
                            <div className="p-2">
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
                            <div className="p-2">
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