import React, {Component} from 'react';
import Loader from "../../../common/loader/Loader";
import axios from 'axios';
import Logger from "../../../common/logger/Logger";


export default class ItemTable extends Component{
    constructor(props) {
        super(props);
        this.state = {
            message: null,
            type: null
        };
        this.handleDelete = this.handleDelete.bind(this);
        this.hasToReload = this.hasToReload.bind(this);
    }

    handleDelete(id){
        axios.delete('/admin/api/item/delete/' + id)
            .then(res => {
                this.setState({
                    message: res.data.success,
                    type: 'success'
                });
                this.hasToReload();
            })
    }

    hasToReload(){
        this.props.hasToReload();
    }


    render() {
        const {isLoaded, items} = this.props;
        const {message, type} = this.state;
        if (!isLoaded){
            return (
                <Loader/>
            )
        }
        else {
            return (
                <div>
                    <h1 className="h4 text-pink text-center mb-4">Tableau de tous les produits</h1>
                    <table className="table table-responsive-md table-striped bg-pink-inherit text-grey">
                        {message && type ? <Logger message={message} type={type}/> : ''}
                        <thead>
                            <tr>
                                <th scope="col">Nom</th>
                                <th scope="col">Marque</th>
                                <th scope="col">Sous catégorie</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        {items && items.length > 0 ?
                                items.map(item => {
                                    return (
                                        <tr key={item.id}>
                                            <td>
                                                {item.name}
                                            </td>
                                            <td>
                                                {item.mark.name}
                                            </td>
                                            <td>
                                                {item.categoryChild.name}
                                            </td>
                                            <td className="text-right text-danger" onClick={() => this.handleDelete(item.id)}>
                                                <i className="fas fa-trash"></i>
                                            </td>
                                        </tr>
                                    )
                                })
                            : ''}
                        </tbody>
                    </table>
                </div>
            );
        }
    }

}