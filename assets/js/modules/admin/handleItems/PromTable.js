import React, {Component} from 'react';
import axios from 'axios';
import Logger from "../../../common/logger/Logger";
import Loader from "../../../common/loader/Loader";


export default class PromTable extends Component{
    constructor(props) {
        super(props);
        this.state = {
            message: null,
            type: null
        };
        this.hasToReload = this.hasToReload.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    hasToReload(){
        this.props.hasToReload();
    }

    handleDelete(id){
        axios.delete('/admin/api/prom/' + id)
            .then(res => {
                this.setState({
                    message: res.data.success,
                    type: 'success'
                });
                this.hasToReload();
            })
    }


    render() {
        const {isLoaded, proms} = this.props;
        const {message, type} = this.state;
        if (!isLoaded){
            return (
                <Loader/>
            )
        }
        else {
            return (
                <div>
                    <h1 className="h4 text-pink text-center mb-4">Tableau de touts les produits</h1>
                    <table className="table table-responsive-md table-striped bg-pink-inherit text-grey">
                        {message && type ? <Logger message={message} type={type}/> : ''}
                        <thead >
                        <tr>
                            <th scope="col">Nom</th>
                            <th scope="col">Promo (%)</th>
                            <th scope="col">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {proms && proms.length > 0 ? proms.map(prom => {
                            return (
                                <tr key={prom.id}>
                                    <td>
                                        {prom.name}
                                    </td>
                                    <td>
                                        {prom.prom}
                                    </td>
                                    <td className="text-right">
                                        <a className="text-danger link" onClick={() => this.handleDelete(prom.id)}><i className="fas fa-trash"></i></a>
                                    </td>
                                </tr>
                            )})
                            : '' }
                        </tbody>
                    </table>

                </div>
            );
        }
    }
}